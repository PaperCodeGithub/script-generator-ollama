import ollama
from langchain_community.vectorstores import DocArrayInMemorySearch
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document

def get_response_stream(messages, model='gemma3'):
    stream = ollama.chat(model=model, messages=messages, stream=True)
    return stream

plot_summary = input("Enter scene: ")
print("\nRefining Plot Summary...")

person_1 = input("\n\nEnter P1 personality/background: ")
print("\nRefining P1...")
p1_summary = ""
for chunk in get_response_stream([
    {'role': 'system', 'content': "Polish this into point-by-point characteristics."}, 
    {'role': 'user', 'content': person_1}
    ]):
    content = chunk['message']['content']
    print(content, end='', flush=True); p1_summary += content

person_2 = input("\n\nEnter P2 personality/background: ")
print("\nRefining P2...")
p2_summary = ""
for chunk in get_response_stream([
    {'role': 'system', 'content': "Polish this into point-by-point characteristics."}, 
    {'role': 'user', 'content': person_2}
    ]):
    content = chunk['message']['content']
    print(content, end='', flush=True); p2_summary += content

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
knowledge_base = [
    Document(page_content=plot_summary, metadata={"type": "plot"}),
    Document(page_content=p1_summary, metadata={"type": "char_p1"}),
    Document(page_content=p2_summary, metadata={"type": "char_p2"})
]
vectorstore = DocArrayInMemorySearch.from_documents(knowledge_base, embeddings)

def get_context(query):
    docs = vectorstore.similarity_search(query, k=2)
    return "\n".join([d.page_content for d in docs])

p1_history = []
p2_history = []
current_message = "The scene begins. Character 1, you start."

print("\n\n--- STARTING CONVERSATION ---")

for i in range(50):
    context_p1 = get_context(current_message)
    
    sys_p1 = f"""
        ACTING ROLE: You are {p1_summary}.
        STORY CONTEXT: {plot_summary}
        RULE 1: ONLY write dialogue. Do NOT describe the scene or the character's thoughts.
        RULE 2: Use natural, short, human-like sentences. Avoid "AI-speak" or overly dramatic metaphors.
        RULE 3: Do NOT invent new plot twists. Stay focused on the oxygen leak and the airlock.
        FORMAT: "[Character Name]: (Dialogue only)"
        """
    
    print(f"\n\n[P1]: ", end="")
    p1_response = ""

    p1_history.append({'role': 'user', 'content': current_message})
    for chunk in get_response_stream([{'role': 'system', 'content': sys_p1}] + p1_history):
        content = chunk['message']['content']
        print(content, end='', flush=True); p1_response += content
    p1_history.append({'role': 'assistant', 'content': p1_response})

    current_message = p1_response
    context_p2 = get_context(current_message)
    
    sys_p2 = f"""
        ACTING ROLE: You are {p2_summary}.
        STORY CONTEXT: {plot_summary}
        RULE 1: ONLY write dialogue. Do NOT describe the scene or the character's thoughts.
        RULE 2: Use natural, short, human-like sentences. Avoid "AI-speak" or overly dramatic metaphors.
        RULE 3: Do NOT invent new plot twists. Stay focused on the oxygen leak and the airlock.
        FORMAT: "[Character Name]: (Dialogue only)"
        """
    

    print(f"\n\n[P2]: ", end="")
    p2_response = ""
    p2_history.append({'role': 'user', 'content': current_message})
    for chunk in get_response_stream([{'role': 'system', 'content': sys_p2}] + p2_history):
        content = chunk['message']['content']
        print(content, end='', flush=True); p2_response += content
    p2_history.append({'role': 'assistant', 'content': p2_response})
    
    current_message = p2_response