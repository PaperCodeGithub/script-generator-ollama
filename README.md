# A script-writer website

Directero is an AI-powered screenplay generation tool that creates dynamic, context-aware dialogue between multiple characters. By leveraging local Large Language Models (LLMs) and vector embeddings, the application maintains story continuity and character personalities over the course of a scene.
## Features

* Dynamic Character Casting: Define multiple characters with unique names and backgrounds.
* Context-Aware Generation: Uses LangChain and HuggingFace embeddings to retrieve relevant story and character context for every line of dialogue.
* Alternating Turns: Automatically rotates speaking turns between active characters.
* Screenplay UI: A dedicated, auto-scrolling reading environment formatted to resemble traditional screenplay margins and typography.
* PDF Export: Download the generated script directly to a correctly formatted PDF.
* 100% Local Processing: Runs entirely on your local machine using Ollama, ensuring privacy and zero API costs.

## Tech Stack
* Frontend: React.js, jsPDF, CSS
* Backend: Django, Python
* AI / NLP: Ollama (Gemma 3), LangChain, HuggingFace Embeddings (all-MiniLM-L6-v2)

## Prerequisites
Before running this project, ensure you have the following installed on your system:
* Node.js and npm
* Python 3.8+
* Ollama (for running local LLMs)

## Installation & Setup

### 1. Set up the Local LLM (Ollama)
First, ensure Ollama is installed and the required model is downloaded. We use `gemma3` by default.

```
# Pull the Gemma 3 model
ollama pull gemma3
```
**Important Optimization** : To prevent the model from unloading between generations (which causes massive delays), set the keep-alive environment variable before starting Ollama:
`Windows (Command Prompt): setx OLLAMA_KEEP_ALIVE "-1"`
`Mac/Linux: export OLLAMA_KEEP_ALIVE="-1"`

### 2. Set up the Django Backend
Navigate to your backend directory and set up a Python virtual environment.
```
cd backend
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install required Python packages
pip install django ollama langchain-community langchain-huggingface sentence-transformers

# Run the Django server
python manage.py runserver
```
The backend will run on http://127.0.0.1:8000.

### 3. Set up the React Frontend
Open a new terminal window, navigate to your frontend directory, and install the dependencies.
```
cd frontend

# Install standard dependencies and jsPDF for export
npm install
npm install jspdf

# Start the development server
npm start
```
The frontend will run on http://localhost:3000.

## Usage
* Open the application in your browser.
* In the "Scene Setup" panel, describe the setting and plot in the text area.
* Add your characters. Provide a name and a detailed background/personality for each.
* Click "Next" to generate the first line of dialogue.
* Continue clicking "Next" to advance the conversation. The AI will alternate between characters automatically.
* Use the "Download PDF" button to export your finished draft.

## Customization
To change the underlying AI model, update the model parameter in the `api/views.py` file:
```
def get_response_stream(messages, model='llama3'): # Change 'gemma3' to your preferred local model
```
Make sure you have pulled the new model via Ollama `ollama pull llama3` before running the script.

## License
MIT License

Copyright (c) 2026 PaperCode
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
