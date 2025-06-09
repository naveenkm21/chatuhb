import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Plus, Hash, MoreVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import UserProfile from '@/components/chat/UserProfile';
import MessageBubble from '@/components/chat/MessageBubble';
import EmojiPicker from '@/components/chat/EmojiPicker';
import FileUpload from '@/components/chat/FileUpload';
import SearchBar from '@/components/chat/SearchBar';

interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  roomId: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
}

interface Room {
  id: string;
  name: string;
  userCount: number;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

const Index = () => {
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string>('general');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rooms, setRooms] = useState<Room[]>([
    { 
      id: 'general', 
      name: 'General', 
      userCount: 12,
      lastMessage: 'Hey everyone! 👋',
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 2
    },
    { 
      id: 'random', 
      name: 'Random', 
      userCount: 8,
      lastMessage: 'Anyone up for a game?',
      lastMessageTime: new Date(Date.now() - 600000),
      unreadCount: 0
    },
    { 
      id: 'tech', 
      name: 'Tech Talk', 
      userCount: 15,
      lastMessage: 'Check out this new framework!',
      lastMessageTime: new Date(Date.now() - 120000),
      unreadCount: 5
    }
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
      toast.success(`Welcome to ChatHub, ${username}!`);
      // Simulate loading some initial messages
      const initialMessages: Message[] = [
        {
          id: '1',
          username: 'Alice',
          content: 'Hey everyone! 👋',
          timestamp: new Date(Date.now() - 300000),
          roomId: 'general',
          status: 'read'
        },
        {
          id: '2',
          username: 'Bob',
          content: 'How is everyone doing today?',
          timestamp: new Date(Date.now() - 180000),
          roomId: 'general',
          status: 'delivered'
        }
      ];
      setMessages(initialMessages);
    } else {
      toast.error('Username must be at least 3 characters long');
    }
  };

  const sendMessage = (content: string = newMessage, type: 'text' | 'image' | 'file' = 'text', fileData?: any) => {
    if ((content.trim() || type !== 'text') && isAuthenticated) {
      const message: Message = {
        id: Date.now().toString(),
        username,
        content: content.trim(),
        timestamp: new Date(),
        roomId: currentRoom,
        status: 'sending',
        type,
        ...fileData
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulate message status updates
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'sent' } : msg
        ));
      }, 500);
      
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 1000);
      
      toast.success('Message sent!');
    }
  };

  const handleFileSelect = (file: File, type: 'image' | 'file') => {
    const fileUrl = URL.createObjectURL(file);
    const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
    
    sendMessage('', type, {
      fileUrl,
      fileName: file.name,
      fileSize
    });
    
    toast.success(`${type === 'image' ? 'Image' : 'File'} uploaded successfully!`);
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const createRoom = () => {
    if (newRoomName.trim()) {
      const newRoom: Room = {
        id: newRoomName.toLowerCase().replace(/\s+/g, '-'),
        name: newRoomName,
        userCount: 1,
        unreadCount: 0
      };
      setRooms(prev => [...prev, newRoom]);
      setNewRoomName('');
      setShowCreateRoom(false);
      toast.success(`Room "${newRoomName}" created!`);
    }
  };

  const filteredMessages = messages
    .filter(msg => msg.roomId === currentRoom)
    .filter(msg => !searchTerm || msg.content.toLowerCase().includes(searchTerm.toLowerCase()));

  const currentRoomData = rooms.find(r => r.id === currentRoom);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm shadow-xl">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              ChatHub
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
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              Join Chat
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <UserProfile username={username} isOnline={true} />
        </div>
        
        <div className="p-4">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClearSearch={() => setSearchTerm('')}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
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
              <div className="space-y-2 mb-4">
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
            
            <div className="space-y-1">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setCurrentRoom(room.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                    currentRoom === room.id ? 'bg-green-50 border-l-4 border-green-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium"># {room.name}</span>
                    {room.unreadCount! > 0 && (
                      <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                        {room.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{room.lastMessage}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">
                      {room.lastMessageTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {room.userCount}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                #
              </div>
              <div>
                <h1 className="text-lg font-semibold">
                  {currentRoomData?.name || 'General'}
                </h1>
                <p className="text-sm text-gray-500">
                  {currentRoomData?.userCount || 0} members
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Hash className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                currentUser={username}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <FileUpload onFileSelect={handleFileSelect} />
            <div className="flex-1 relative">
              <Input
                placeholder={`Message #${currentRoomData?.name || 'general'}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="pr-10"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </div>
            </div>
            <Button 
              onClick={() => sendMessage()} 
              disabled={!newMessage.trim()}
              className="bg-green-500 hover:bg-green-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use **bold**, *italic* for formatting. Upload images and files.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
