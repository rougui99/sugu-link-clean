// src/pages/AdminMessages.tsx
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const AdminMessages = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<number | null>(null);

  useEffect(() => {
    fetchAdminId();
  }, []);

  const fetchAdminId = async () => {
    try {
      const token = localStorage.getItem("sugu_admin_token");
      // ✅ SOLUTION : utiliser "any" pour éviter les erreurs TypeScript
      const response: any = await axios.get(`${API_BASE_URL}/api/users/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminId(response.data.id);
      fetchConversations();
    } catch (error) {
      console.error('❌ Erreur récupération admin:', error);
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("sugu_admin_token");
      const response: any = await axios.get(`${API_BASE_URL}/api/admin/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setConversations(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error('❌ Erreur chargement conversations:', error);
      setConversations([]);
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: number) => {
    try {
      const token = localStorage.getItem("sugu_admin_token");
      const response: any = await axios.get(`${API_BASE_URL}/api/admin/messages/with/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('❌ Erreur chargement messages:', error);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !adminId) return;

    try {
      const token = localStorage.getItem("sugu_admin_token");
      const response: any = await axios.post(
        `${API_BASE_URL}/api/admin/messages`,
        { receiver_id: selectedUser.id, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessages([...messages, response.data]);
      setNewMessage('');
      fetchConversations();
    } catch (error) {
      console.error('❌ Erreur envoi message:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-100px)] flex bg-white rounded-lg shadow overflow-hidden">
        {/* Liste des conversations */}
        <div className="w-1/3 border-r bg-gray-50">
          <div className="p-4 border-b bg-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold">Conversations</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-65px)]">
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center p-4 text-gray-500">
                Aucune conversation
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setSelectedUser(conv);
                    fetchMessages(conv.id);
                  }}
                  className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition ${
                    selectedUser?.id === conv.id ? 'bg-blue-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                      {conv.first_name?.[0]?.toUpperCase() || conv.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">
                          {conv.first_name} {conv.last_name}
                        </p>
                        {conv.last_message_time && (
                          <span className="text-xs text-gray-400 ml-2">
                            {formatTime(conv.last_message_time)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conv.last_message || 'Aucun message'}</p>
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Zone de chat */}
        <div className="w-2/3 flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b bg-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                  {selectedUser.first_name?.[0]?.toUpperCase() || selectedUser.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{selectedUser.first_name} {selectedUser.last_name}</p>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-8">
                    Aucun message dans cette conversation
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isFromAdmin = msg.sender_id === adminId;
                    return (
                      <div key={msg.id} className={`flex ${isFromAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className="flex flex-col max-w-[70%]">
                          <div className={`p-3 rounded-lg ${
                            isFromAdmin
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-gray-200 text-gray-800 rounded-bl-none'
                          }`}>
                            {msg.content}
                          </div>
                          <span className="text-xs text-gray-400 mt-1">
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-4 border-t bg-white flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre réponse..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Sélectionnez une conversation pour répondre
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;