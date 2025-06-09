
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface UserProfileProps {
  username: string;
  isOnline: boolean;
  lastSeen?: Date;
  avatar?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ username, isOnline, lastSeen, avatar }) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="relative">
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
            {username[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{username}</p>
        <p className="text-xs text-gray-500">
          {isOnline ? 'Online' : lastSeen ? `Last seen ${lastSeen.toLocaleString()}` : 'Offline'}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
