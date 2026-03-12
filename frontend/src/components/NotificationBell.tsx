// src/components/NotificationBell.tsx
import { useState } from 'react';
import { Button } from './ui/button';
import { useNotifications } from '@/contexts/NotificationContext'; // ← CORRIGÉ

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount } = useNotifications(); // ← CORRIGÉ

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="hover:bg-blue-100 hover:text-blue-600 text-xl relative"
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
          <div className="p-4">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500">Aucune notification</p>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="border-b last:border-0 py-2">
                  <p className="font-medium">{notif.title}</p>
                  <p className="text-sm text-gray-600">{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};