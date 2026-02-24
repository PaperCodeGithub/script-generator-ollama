import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import '../styles/Generator.css';

export default function Generator() {
  const [scenePrompt, setScenePrompt] = useState('');
  const [characters, setCharacters] = useState([
    { id: 1, name: '', background: '' },
    { id: 2, name: '', background: '' }
  ]);
  const [progressText, setProgressText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chat_history, setChatHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat_history]);

  const addCharacter = () => {
    setCharacters([
      ...characters,
      { id: Date.now(), name: '', background: '' }
    ]);
  };

  const removeCharacter = (id) => {
    if (characters.length > 1) {
      setCharacters(characters.filter(char => char.id !== id));
    }
  };

  const updateCharacter = (id, field, value) => {
    setCharacters(characters.map(char => 
      char.id === id ? { ...char, [field]: value } : char
    ));
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the current script?")) {
      setChatHistory([]);
      setErrorMessage('');
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let y = 20;

    doc.setFont("courier");

    chat_history.forEach((msg) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = 20;
      }

      if (msg.id === 'system') {
        doc.setFont("courier", "italic");
        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(msg.content, pageWidth - margin * 2);
        doc.text(splitText, pageWidth / 2, y, { align: "center" });
        y += (splitText.length * 6) + 10;
      } else {
        doc.setFont("courier", "bold");
        doc.setFontSize(12);
        doc.text(msg.role.toUpperCase(), pageWidth / 2, y, { align: "center" });
        y += 6;

        doc.setFont("courier", "normal");
        doc.setFontSize(12);
        const splitDialogue = doc.splitTextToSize(msg.content, 120); 
        doc.text(splitDialogue, 45, y); 
        y += (splitDialogue.length * 6) + 10;
      }
    });

    doc.save("script_draft.pdf");
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgressText('Generating dialogue...');
    setErrorMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/get_reply_from_context/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scene: scenePrompt, characters, chat_history }),
      });
      
      const data = await response.json();
      
      if (data.reply) {
        setChatHistory(data.chat_history);
      } else if (data.error) {
        setErrorMessage(data.error);
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsGenerating(false);
      setProgressText('');
    }
  };

  return (
    <div className="sg-container">
      <div className="sg-layout">
        
        <div className="sg-panel sg-form-panel">
          <div className="sg-header">
            <h1>Scene Setup</h1>
          </div>

          <div className="sg-input-group">
            <label>Plot & Scene Description</label>
            <textarea
              className="sg-textarea"
              rows="4"
              placeholder="e.g., A getaway car is parked in a dark alley after a bank robbery went wrong..."
              value={scenePrompt}
              onChange={(e) => setScenePrompt(e.target.value)}
            />
          </div>

          <div className="sg-input-group">
            <div className="sg-char-header">
              <label>Cast ({characters.length})</label>
              <button onClick={addCharacter} className="sg-btn-add">
                + Add Character
              </button>
            </div>

            <div className="sg-char-list">
              {characters.map((char, index) => (
                <div key={char.id} className="sg-char-card">
                  <div className="sg-char-card-header">
                    <span>Character {index + 1}</span>
                    {characters.length > 1 && (
                      <button 
                        onClick={() => removeCharacter(char.id)}
                        className="sg-btn-remove"
                        title="Remove Character"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Character Name (e.g., Mick)"
                    className="sg-input"
                    value={char.name}
                    onChange={(e) => updateCharacter(char.id, 'name', e.target.value)}
                  />
                  <textarea
                    placeholder="Personality & Background..."
                    className="sg-textarea sg-textarea-small"
                    rows="2"
                    value={char.background}
                    onChange={(e) => updateCharacter(char.id, 'background', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !scenePrompt}
            className={`sg-btn-generate ${isGenerating ? 'loading' : ''}`}
          >
            {isGenerating ? `${progressText}` : 'Next'}
          </button>
        </div>

        <div className="sg-panel sg-output-panel">
          <div className="sg-output-header">
            <h2 className="sg-output-title">FINAL DRAFT</h2>
            {chat_history.length > 0 && (
              <div className="sg-output-actions">
                <button onClick={handleClear} className="sg-btn-clear">Clear</button>
                <button onClick={handleDownloadPDF} className="sg-btn-download">Download PDF</button>
              </div>
            )}
          </div>
          
          <div className="sg-script-content">
            {errorMessage && (
              <div className="sg-error-message">Error: {errorMessage}</div>
            )}
            
            {chat_history.length > 0 ? (
              <div className="sg-chat-scroll-area">
                {chat_history.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`sg-chat-message ${msg.id === 'system' ? 'sg-message-system' : 'sg-message-character'}`}
                  >
                    {msg.id !== 'system' && (
                      <div className="sg-message-role">{msg.role.toUpperCase()}</div>
                    )}
                    <div className="sg-message-text">{msg.content}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="sg-empty-state">
                <span className="sg-empty-icon">📝</span>
                <p>Your script will appear here</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}