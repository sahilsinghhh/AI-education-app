import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import ChatBox from '../components/chat/ChatBox';
import { apiFetch } from '../services/api';
import { FaHistory, FaPlus } from 'react-icons/fa';
import Spinner from '../components/common/Spinner';

export default function Chat() {
  const router = useRouter();
  const { subject } = router.query;
  
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
    // Prompt the AI if we arrived via a subject link and have no messages
    if (subject && messages.length === 0) {
      setMessages([{ role: 'model', content: `Hi! I see you're interested in ${subject}. How can I help you with that?` }]);
    }
  }, [subject]);

  const fetchHistory = async () => {
    try {
      const data = await apiFetch('/chat/history');
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch chat history", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadSession = async (id) => {
    try {
      setLoading(true);
      const data = await apiFetch(`/chat/history/${id}`);
      setSessionId(data._id);
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Failed to load session", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    const newMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, newMsg]);
    setLoading(true);

    try {
      const data = await apiFetch('/chat/ask', {
        method: 'POST',
        body: JSON.stringify({ message: text, sessionId })
      });
      setSessionId(data.sessionId);
      setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
      
      // Refresh history if this was a new session
      if (!sessionId) {
        fetchHistory();
      }
    } catch (error) {
      console.error("Failed to send message", error);
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I couldn't process that request." }]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setSessionId(null);
    setMessages([]);
    router.push('/chat', undefined, { shallow: true });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-120px)] animate-fade-in -mx-2 md:mx-0">
      {/* Sidebar History */}
      <div className="w-full md:w-64 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden shrink-0 h-48 md:h-full">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2 text-gray-800"><FaHistory className="text-blue-500" /> History</h2>
          <button onClick={startNewChat} className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors bg-blue-50" title="New Chat">
            <FaPlus />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {loadingHistory ? (
            <div className="flex justify-center py-8"><Spinner size="sm" /></div>
          ) : history.length > 0 ? (
            <ul className="space-y-1.5">
              {history.map(session => (
                <li key={session._id}>
                  <button 
                    onClick={() => loadSession(session._id)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm transition-all truncate ${sessionId === session._id ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    {session.sessionTitle}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8 px-4">No chat history yet.</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0 h-full">
        <ChatBox messages={messages} onSendMessage={handleSendMessage} loading={loading} />
      </div>
    </div>
  );
}

Chat.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}
