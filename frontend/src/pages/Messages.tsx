// src/pages/Messages.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface Conversation {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  read: boolean;
  created_at: string;
}

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // 1. Récupérer les vraies conversations
      const response = await axios.get<Conversation[]>('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let convs = Array.isArray(response.data) ? response.data : [];
      
      // 2. Vérifier si l'admin est déjà dans les conversations
      const adminExists = convs.some(c => c.email === 'admin@sugu-link.com');
      
      // 3. Si l'admin n'est pas présent, l'ajouter manuellement
      if (!adminExists) {
        convs = [
          {
            id: 9999, // ID fictif pour l'admin
            first_name: 'Admin',
            last_name: '',
            email: 'admin@sugu-link.com',
            last_message: 'Contacter l\'administration',
            last_message_time: new Date().toISOString(),
            unread_count: 0
          },
          ...convs
        ];
      }
      
      setConversations(convs);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
      
      // En cas d'erreur, afficher au moins l'admin
      setConversations([
        {
          id: 9999,
          first_name: 'Admin',
          last_name: '',
          email: 'admin@sugu-link.com',
          last_message: 'Contacter l\'administration',
          last_message_time: new Date().toISOString(),
          unread_count: 0
        }
      ]);
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      
      // Si c'est l'admin fictif (id 9999), on simule une conversation vide
      if (userId === 9999) {
        setMessages([]);
        return;
      }
      
      const response = await axios.get<Message[]>(`/api/messages/with/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      
      let response;
      
      // Si c'est l'admin fictif, on simule l'envoi
      if (selectedUser.id === 9999) {
        // Message envoyé
        const newMsg: Message = {
          id: Date.now(),
          sender_id: user?.id || 0,
          receiver_id: 9999,
          content: newMessage,
          read: false,
          created_at: new Date().toISOString()
        };
        
        // Réponse automatique de l'admin
        const adminReply: Message = {
          id: Date.now() + 1,
          sender_id: 9999,
          receiver_id: user?.id || 0,
          content: "Merci pour votre message. L'équipe d'administration vous répondra dans les plus brefs délais.",
          read: false,
          created_at: new Date(Date.now() + 1000).toISOString()
        };
        
        setMessages([...messages, newMsg, adminReply]);
        setNewMessage('');
        return;
      }
      
      // Sinon, appel API normal
      response = await axios.post<Message>(
        '/api/messages',
        { receiver_id: selectedUser.id, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Erreur envoi message:', error);
    }
  };

  if (!user) return null;

  const safeConversations = Array.isArray(conversations) ? conversations : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container py-8">
        <div className="mx-auto max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden h-[600px] flex">
          {/* Liste des conversations */}
          <div className="w-1/3 border-r bg-gray-50">
            <div className="p-4 border-b bg-white">
              <h2 className="font-semibold">Messages</h2>
            </div>
            <div className="overflow-y-auto h-[calc(600px-65px)]">
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : safeConversations.length === 0 ? (
                <div className="text-center p-4 text-gray-500">
                  Aucune conversation
                </div>
              ) : (
                safeConversations.map((conv) => (
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
                        {conv.avatar_url ? (
                          <img src={conv.avatar_url} alt={conv.first_name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          conv.first_name?.[0]?.toUpperCase() || conv.email[0].toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {conv.first_name} {conv.last_name}
                        </p>
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
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedUser(null)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                    {selectedUser.first_name?.[0]?.toUpperCase() || selectedUser.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{selectedUser.first_name} {selectedUser.last_name}</p>
                    <p className="text-xs text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {Array.isArray(messages) && messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender_id === user.id
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {(!messages || messages.length === 0) && (
                    <div className="text-center text-gray-400 mt-8">
                      Aucun message dans cette conversation
                    </div>
                  )}
                </div>

                <div className="p-4 border-t bg-white flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Sélectionnez une conversation pour commencer
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;