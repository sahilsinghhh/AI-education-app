import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

export default function ChatBox({ messages, onSendMessage, loading }) {
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-5">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 shadow-inner">
              <FaRobot size={48} className="text-blue-400" />
            </div>
            <p className="text-lg font-medium text-gray-600">Hi! I'm your AI Tutor.</p>
            <p className="text-sm">What do you want to learn today?</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                  {msg.role === 'user' ? <FaUser size={14} /> : <FaRobot size={16} />}
                </div>
                <div className={`py-4 px-6 text-[15px] ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-3xl rounded-tr-sm shadow-sm' : 'bg-white border text-gray-800 border-gray-100 shadow-sm rounded-3xl rounded-tl-sm w-full overflow-x-auto'}`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="space-y-3 [&>h1]:text-xl [&>h1]:font-black [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-gray-900 [&>h3]:font-bold [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-1 [&>strong]:text-blue-900">
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%] flex-row">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 shadow-sm">
                <FaRobot size={16} />
              </div>
              <div className="py-3 px-5 rounded-3xl bg-white border border-gray-100 shadow-sm rounded-tl-sm">
                <div className="flex gap-1.5 items-center h-5">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-5 border-t border-gray-100 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={loading}
            className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all text-[15px]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <FaPaperPlane className="ml-1" size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
