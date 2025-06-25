// Chatbot React bundle (ESM, standalone)
import React, { useState } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';

const backendUrl = window.CHATBOT_BACKEND_URL || '/api/chatbot';

function ChatIcon({ onClick }) {
  return (
    <button
      aria-label="Abrir chat"
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 9999,
        background: '#0078FF',
        border: 'none',
        borderRadius: '50%',
        width: 56,
        height: 56,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
      }}
      onClick={onClick}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 15s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
    </button>
  );
}

function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: '¡Hola! ¿En qué puedo ayudarte?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { from: 'bot', text: data.reply || '...' }]);
    } catch {
      setMessages(msgs => [...msgs, { from: 'bot', text: 'Error de conexión.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      right: 24,
      bottom: 90,
      width: 320,
      maxWidth: '90vw',
      height: 420,
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      animation: 'chatbot-popin 0.4s cubic-bezier(.68,-0.55,.27,1.55)'
    }}>
      <style>{`
        @keyframes chatbot-popin {
          0% { transform: scale(0.7) translateY(100px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .chatbot-scroll { scrollbar-width: thin; }
      `}</style>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #eee',
        background: '#0078FF',
        color: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>Chat</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>&times;</button>
      </div>
      <div className="chatbot-scroll" style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            margin: '8px 0',
            textAlign: msg.from === 'user' ? 'right' : 'left'
          }}>
            <span style={{
              display: 'inline-block',
              background: msg.from === 'user' ? '#e6f0fa' : '#f1f1f1',
              color: '#222',
              borderRadius: 12,
              padding: '8px 14px',
              maxWidth: '80%',
              fontSize: 15
            }}>{msg.text}</span>
          </div>
        ))}
        {loading && <div style={{textAlign:'left',color:'#888'}}>Escribiendo...</div>}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', borderTop: '1px solid #eee', padding: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, padding: 8, borderRadius: 8, background: '#f7f7f7' }}
          disabled={loading}
        />
        <button type="submit" style={{ marginLeft: 8, background: '#0078FF', color: '#fff', border: 'none', borderRadius: 8, padding: '0 16px', fontWeight: 600, cursor: 'pointer' }} disabled={loading || !input.trim()}>
          Enviar
        </button>
      </form>
    </div>
  );
}

function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && <ChatIcon onClick={() => setOpen(true)} />}
      {open && <ChatWindow onClose={() => setOpen(false)} />}
    </>
  );
}

const container = document.createElement('div');
container.id = 'chatbot-widget-root';
document.body.appendChild(container);
createRoot(container).render(<ChatbotWidget />);
