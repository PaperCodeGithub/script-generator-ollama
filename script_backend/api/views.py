import json
import ollama
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from langchain_community.vectorstores import DocArrayInMemorySearch
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document
import random

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

@csrf_exempt
def reply_hello(request):
    if request.method == 'POST':
        return JsonResponse({'message': 'Hello, World!'})
    return JsonResponse({'error': 'Invalid method'}, status=405)

def get_response_stream(messages, model='gemma3'):
    return ollama.chat(model=model, messages=messages, stream=True)

def get_context(query, vectorstore):
    docs = vectorstore.similarity_search(query, k=2)
    return "\n".join([d.page_content for d in docs])

@csrf_exempt
def get_reply_from_context(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            scene = data.get('scene', '')
            characters = data.get('characters', [])
            chat_history = data.get('chat_history', [])

            scene = scene.strip() + "\n\nCharacters:\n" + "\n".join([f"{c['name']}" for c in characters]) + "\n"

            if not scene or not characters:
                return JsonResponse({'error': 'Scene and characters are required.'}, status=400)
            
            selected_character_id = 0

            if not chat_history:
                chat_history = [{'role': 'user', 'content': f"The scene begins. {characters[selected_character_id]['name']}, you start.", 'id': 'system'}]
                selected_character_id = 0
            else:
                last_speaker_id = chat_history[-1].get('id')
                total_speakers = len(characters)
                
                while True:
                    get_random_index = random.randint(0, total_speakers - 1)
                    if characters[get_random_index]['id'] != last_speaker_id:
                        selected_character_id = get_random_index
                        break

            acting_character = characters[selected_character_id]

            knowledge_base = [
                Document(page_content=scene, metadata={"type": "plot"}),
                Document(page_content=f"{acting_character['name']}: {acting_character['background']}", metadata={"type": "character"})
            ]    

            vectorstore = DocArrayInMemorySearch.from_documents(knowledge_base, embeddings)

            chat_context = get_context(chat_history[-1]['content'], vectorstore)

            mapped_history = []
            for msg in chat_history:
                role = 'assistant' if msg.get('id') == acting_character['id'] else 'user'
                mapped_history.append({'role': role, 'content': msg['content']})

            sys_prompt = f"""
                ACTING ROLE: You are {acting_character['name']}. 
                YOUR BACKGROUND/PERSONALITY: {acting_character['background']}
                STORY CONTEXT: {scene}.
                CHAT CONTEXT: {chat_context}
                RULE 1: ONLY write dialogue. Do NOT describe the scene or the character's thoughts or character's name.
                RULE 2: Use natural, short, human-like sentences. Avoid "AI-speak" or overly dramatic metaphors.
            """
            
            response = ""
            for chunk in get_response_stream([{'role': 'system', 'content': sys_prompt}] + mapped_history):
                content = chunk['message']['content']
                print(content, end='', flush=True)
                response += content
                
            response = response.replace(f"{acting_character['name']}:", "").strip()

            chat_history.append({'role': acting_character['name'], 'content': response, 'id': acting_character['id']})
            return JsonResponse({'reply': response, 'chat_history': chat_history})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Invalid method'}, status=405)