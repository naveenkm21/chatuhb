
import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Plus, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  roomId: string;
}

interface Room {
  id: string;
  name: string;
  userCount: number;
}

const Index = () => {
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string>('general');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [rooms, setRooms] = useState<Room[]>([
    { id: 'general', name: 'General', userCount: 12 },
    { id: 'random', name: 'Random', userCount: 8 },
    { id: 'tech', name: 'Tech Talk', userCount: 15 }
  ]);
  const [newRoomName, setNewRoomName] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLogin = () => {
    if (username.trim().length >= 3) {
      setIsAuthenticated(true);
      toast.success(`Welcome to the chat, ${username}!`);
      // Simulate loading some initial messages
      const initialMessages: Message[] = [
        {
          id: '1',
          username: 'Alice',
          content: 'Hey everyone! 👋',
          timestamp: new Date(Date.now() - 300000),
          roomId: 'general'
        },
        {
          id: '2',
          username: 'Bob',
          content: 'How is everyone doing today?',
          timestamp: new Date(Date.now() - 180000),
          roomId: 'general'
        }
      ];
      setMessages(initialMessages);
    } else {
      toast.error('Username must be at least 3 characters long');
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && isAuthenticated) {
      const message: Message = {
        id: Date.now().toString(),
        username,
        content: newMessage.trim(),
        timestamp: new Date(),
        roomId: currentRoom
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      toast.success('Message sent!');
    }
  };

  const createRoom = () => {
    if (newRoomName.trim()) {
      const newRoom: Room = {
        id: newRoomName.toLowerCase().replace(/\s+/g, '-'),
        name: newRoomName,
        userCount: 1
      };
      setRooms(prev => [...prev, newRoom]);
      setNewRoomName('');
      setShowCreateRoom(false);
      toast.success(`Room "${newRoomName}" created!`);
    }
  };

  const formatMessage = (content: string) => {
    // Basic formatting support
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>');
  };

  const filteredMessages = messages.filter(msg => msg.roomId === currentRoom);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-sm shadow-xl">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to ChatHub
            </h1>
            <p className="text-muted-foreground">Enter your username to join the conversation</p>
          </div>
          <div className="space-y-4">
            <Input
              placeholder="Choose your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="text-center"
            />
            <Button 
              onClick={handleLogin} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Join Chat
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white/90 backdrop-blur-sm border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ChatHub
          </h2>
          <p className="text-sm text-muted-foreground">Welcome, {username}</p>
        </div>
        
        <div className="flex-1 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Rooms
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowCreateRoom(!showCreateRoom)}
              className="h-6 w-6 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {showCreateRoom && (
            <div className="space-y-2">
              <Input
                placeholder="Room name..."
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createRoom()}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={createRoom}>Create</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowCreateRoom(false)}>Cancel</Button>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setCurrentRoom(room.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-100 ${
                  currentRoom === room.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium"># {room.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {room.userCount}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-semibold">
              {rooms.find(r => r.id === currentRoom)?.name || 'General'}
            </h1>
            <Badge variant="outline" className="ml-auto">
              <Users className="w-3 h-3 mr-1" />
              {rooms.find(r => r.id === currentRoom)?.userCount || 0} online
            </Badge>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Hash className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div key={message.id} className="group">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {message.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{message.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div 
                      className="text-gray-700 break-words"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <Input
              placeholder={`Message #${rooms.find(r => r.id === currentRoom)?.name || 'general'}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use **bold**, *italic* for formatting. Links will be automatically detected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
