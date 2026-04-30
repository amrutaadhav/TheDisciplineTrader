import React, { useState, useRef, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const defaultMessages = [
    { role: 'assistant', content: "Hello! I am your AI Trading Mentor. You can ask me questions, upload a chart, or even use your voice to talk to me!" }
  ];
  
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('disciplineTrader_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return defaultMessages; }
    }
    return defaultMessages;
  });

  useEffect(() => {
    localStorage.setItem('disciplineTrader_chat_history', JSON.stringify(messages));
  }, [messages]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [image, setImage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const [playingIndex, setPlayingIndex] = useState(null);

  const toggleVoice = (text, index) => {
    if (!window.speechSynthesis) return alert('Your browser does not support text-to-speech.');
    
    if (playingIndex === index) {
      window.speechSynthesis.cancel();
      setPlayingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setPlayingIndex(null);
    utterance.onerror = () => setPlayingIndex(null);
    
    setPlayingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoice = () => {
    if (!recognition) return alert('Your browser does not support speech recognition.');
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() && !image) return;

    const userMsg = { role: 'user', content: input };
    if (image) userMsg.image = image; // Send base64 image if present

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setImage(null);
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error: ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, data]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Failed to connect to server." }]);
    }
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#2962FF] to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(41,98,255,0.4)] hover:scale-110 transition-transform z-50 border-2 border-[#2B2B43]"
      >
        {isOpen ? <span className="text-white text-2xl">✕</span> : <span className="text-white text-2xl">💬</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] md:w-[400px] h-[550px] max-h-[80vh] bg-[#131722] border border-[#2B2B43] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-[#1E222D] p-4 border-b border-[#2B2B43] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">AI</div>
              <div>
                <h3 className="text-white font-bold text-sm">Trading Mentor AI</h3>
                <p className="text-[#787B86] text-xs">Groq Vision Enabled</p>
              </div>
            </div>
            <button 
              onClick={() => { setMessages(defaultMessages); localStorage.removeItem('disciplineTrader_chat_history'); }}
              className="text-[#787B86] hover:text-[#EF5350] p-2 transition-colors"
              title="Clear Chat History"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm relative group ${msg.role === 'user' ? 'bg-[#2962FF] text-white rounded-br-sm' : 'bg-[#1E222D] text-[#D1D4DC] rounded-bl-sm border border-[#2B2B43]'}`}>
                  {msg.image && <img src={msg.image} alt="Upload" className="w-full rounded-xl mb-2" />}
                  <p className="whitespace-pre-wrap pr-6">{msg.content}</p>
                  {msg.role === 'assistant' && (
                    <button 
                      onClick={() => toggleVoice(msg.content, i)} 
                      className={`absolute top-2 right-2 hover:text-[#2962FF] transition-opacity ${playingIndex === i ? 'opacity-100 text-[#2962FF]' : 'text-[#787B86] opacity-0 group-hover:opacity-100'}`}
                      title={playingIndex === i ? "Stop playback" : "Listen to message"}
                    >
                      {playingIndex === i ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1E222D] text-[#D1D4DC] rounded-2xl rounded-bl-sm p-3 border border-[#2B2B43]">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#787B86] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#787B86] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-[#787B86] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Image Preview */}
          {image && (
            <div className="px-4 py-2 bg-[#1E222D] border-t border-[#2B2B43] flex items-center justify-between">
              <span className="text-xs text-[#26A69A] flex items-center gap-1">📷 Chart Attached</span>
              <button onClick={() => setImage(null)} className="text-[#EF5350] text-xs font-bold">Remove</button>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-3 bg-[#131722] border-t border-[#2B2B43] flex items-center gap-2">
            <label className="cursor-pointer p-2 text-[#787B86] hover:text-[#2962FF] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            
            <button type="button" onClick={handleVoice} className={`p-2 transition-colors ${isListening ? 'text-[#EF5350] animate-pulse' : 'text-[#787B86] hover:text-[#2962FF]'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </button>

            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask about a trade..."
              className="flex-1 bg-[#1E222D] border border-[#2B2B43] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2962FF]"
            />
            
            <button type="submit" disabled={!input.trim() && !image} className="p-2 bg-[#2962FF] text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
