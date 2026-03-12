// src/components/MessageButton.tsx
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const MessageButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate('/messages')}
      className="hover:bg-blue-100 hover:text-blue-600 text-xl"
      title="Messages"
    >
      💬
    </Button>
  );
};