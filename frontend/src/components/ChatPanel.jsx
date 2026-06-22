import { useState, useRef, useEffect } from 'react';
import MermaidDiagram from './MermaidDiagram';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Helper to render text with LaTeX inline ($...$ and $$...$$)
function renderTextWithLatex(text) {
  if (!text) return null;
  const parts = text.split(/(\$\$?[\s\S]*?\$\$?)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const formula = part.slice(2, -2);
      const html = katex.renderToString(formula, {
        displayMode: true,
        throwOnError: false,
      });
      return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      const formula = part.slice(1, -1);
      const html = katex.renderToString(formula, {
        displayMode: false,
        throwOnError: false,
      });
      return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
    }
    return <span key={index}>{part}</span>;
  });
}

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', ...data }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          answer: 'Sorry, I encountered an error. Please try again.',
          latex: '',
          diagram: '',
          quiz: null,
          hints: '',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-3xl ${
              msg.role === 'user' ? 'ml-auto bg-blue-700' : 'mr-auto bg-gray-800'
            } rounded-lg p-4 shadow`}
          >
            {/* User message */}
            {msg.role === 'user' && <p className="text-white whitespace-pre-wrap">{msg.content}</p>}

            {/* Assistant structured content */}
            {msg.role === 'assistant' && (
              <div className="space-y-3">
                {/* Answer text */}
                {msg.answer && (
                  <div className="prose prose-invert max-w-none">
                    <div className="text-gray-100 whitespace-pre-wrap">
                      {renderTextWithLatex(msg.answer)}
                    </div>
                  </div>
                )}

                {/* LaTeX highlighted */}
                {msg.latex && (
                  <div className="bg-gray-900 p-3 rounded border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">Key Formula</p>
                    <div className="overflow-x-auto">
                      {renderTextWithLatex(`$$${msg.latex}$$`)}
                    </div>
                  </div>
                )}

                {/* Diagram (Mermaid) */}
                {msg.diagram && (
                  <div className="bg-white rounded p-3">
                    <MermaidDiagram chart={msg.diagram} />
                  </div>
                )}

                {/* Quiz */}
                {msg.quiz && (
                  <div className="bg-gray-850 border border-gray-600 rounded p-3">
                    <p className="font-semibold mb-2">{msg.quiz.question}</p>
                    <div className="space-y-2">
                      {msg.quiz.options.map((opt, oidx) => (
                        <button
                          key={oidx}
                          className="block w-full text-left px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
                          onClick={() => {
                            if (oidx === msg.quiz.correctIndex) {
                              alert('Correct!');
                            } else {
                              alert('Incorrect, try again.');
                            }
                          }}
                        >
                          {String.fromCharCode(65 + oidx)}. {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hints */}
                {msg.hints && (
                  <p className="text-sm text-gray-400 italic">💡 {msg.hints}</p>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-center text-gray-400 italic">Tutor is thinking…</div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            rows={2}
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 rounded-lg transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}