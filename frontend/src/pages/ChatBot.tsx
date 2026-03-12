// src/pages/ChatBot.tsx
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const ChatBot = () => {
  const { user } = useAuth();

  useEffect(() => {
    console.log("👤 Utilisateur connecté:", user);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold mb-6 text-center">💬 Assistant Sugu-Link</h1>
          <p className="text-center text-gray-600 mb-8">
            {user ? `Connecté en tant que : ${user.email}` : 'Non connecté'}
          </p>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
            <iframe
              src="https://cdn.botpress.cloud/webchat/v3.6/shareable.html?configUrl=https://files.bpcontent.cloud/2026/03/06/14/20260306143139-IZD0PRH5.json"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              title="Chatbot Sugu-Link"
              allow="microphone; camera"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatBot;