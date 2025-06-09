import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Plus, Hash, MoreVertical, Phone, Video, MessageSquareReply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import LoginForm from '@/components/auth/LoginForm';
import UserProfile from '@/components/chat/UserProfile';
import MessageBubble from '@/components/chat/MessageBubble';
import EmojiPicker from '@/components/chat/EmojiPicker';
import FileUpload from '@/components/chat/FileUpload';
import SearchBar from '@/components/chat/SearchBar';
import CallScheduler from '@/components/chat/CallScheduler';
import VoiceRecorder from '@/components/chat/VoiceRecorder';
import StickerPicker from '@/components/chat/StickerPicker';
import ReplySystem from '@/components/chat/ReplySystem';
import PollCreator from '@/components/chat/PollCreator';
import PollDisplay from '@/components/chat/PollDisplay';

interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  roomId: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'file' | 'voice' | 'sticker' | 'poll' | 'call-schedule';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  voiceDuration?: number;
  replyTo?: {
    id: string;
    username: string;
    content: string;
  };
  pollData?: {
    question: string;
    options: string[];
    allowMultiple: boolean;
    votes: Record<string, number>;
    userVotes: string[];
  };
  callData?: {
    type: 'voice' | 'video';
    date: Date;
    time: string;
    title: string;
  };
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
  const [userId, setUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string>('general');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState<{id: string; username: string; content: string} | null>(null);
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

  const handleLogin = (inputUserId: string, password: string) => {
    setUserId(inputUserId);
    setIsAuthenticated(true);
    toast.success(`Welcome to ChatHub, ${inputUserId}!`);
    
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
  };

  const sendMessage = (content: string = newMessage, type: 'text' | 'image' | 'file' | 'voice' | 'sticker' | 'poll' | 'call-schedule' = 'text', extraData?: any) => {
    if ((content.trim() || type !== 'text') && isAuthenticated) {
      const message: Message = {
        id: Date.now().toString(),
        username: userId,
        content: content.trim(),
        timestamp: new Date(),
        roomId: currentRoom,
        status: 'sending',
        type,
        replyTo: replyingTo,
        ...extraData
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setReplyingTo(null);
      
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

  const handleVoiceNote = (audioBlob: Blob, duration: number) => {
    console.log('Creating voice note:', { duration, blobSize: audioBlob.size });
    
    // Create a proper audio URL that persists
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const voiceMessage: Message = {
      id: Date.now().toString(),
      username: userId,
      content: 'Voice message',
      timestamp: new Date(),
      roomId: currentRoom,
      status: 'sending',
      type: 'voice',
      fileUrl: audioUrl,
      voiceDuration: duration,
      replyTo: replyingTo
    };
    
    console.log('Voice message created:', voiceMessage);
    
    setMessages(prev => [...prev, voiceMessage]);
    setReplyingTo(null);
    
    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === voiceMessage.id ? { ...msg, status: 'sent' } : msg
      ));
    }, 500);
    
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === voiceMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);
    
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === voiceMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 2000);
    
    toast.success('Voice message sent!');
  };

  const handleStickerSelect = (sticker: string) => {
    sendMessage(sticker, 'sticker');
  };

  const handleReplyToMessage = (message: Message) => {
    setReplyingTo({
      id: message.id,
      username: message.username,
      content: message.content
    });
  };

  const handleCreatePoll = (pollData: {question: string; options: string[]; allowMultiple: boolean}) => {
    const poll = {
      ...pollData,
      votes: pollData.options.reduce((acc, option) => ({ ...acc, [option]: 0 }), {}),
      userVotes: []
    };
    sendMessage(pollData.question, 'poll', { pollData: poll });
  };

  const handlePollVote = (messageId: string, optionIndex: number) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.pollData) {
        const option = msg.pollData.options[optionIndex];
        const newVotes = { ...msg.pollData.votes };
        newVotes[option] = (newVotes[option] || 0) + 1;
        
        return {
          ...msg,
          pollData: {
            ...msg.pollData,
            votes: newVotes,
            userVotes: [...msg.pollData.userVotes, option]
          }
        };
      }
      return msg;
    }));
  };

  const handleScheduleCall = (callData: {type: 'voice' | 'video'; date: Date; time: string; title: string}) => {
    sendMessage(`Scheduled ${callData.type} call: ${callData.title}`, 'call-schedule', { callData });
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
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-500 to-blue-500">
          <UserProfile username={userId} isOnline={true} />
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
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Rooms
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCreateRoom(!showCreateRoom)}
                className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {showCreateRoom && (
              <div className="space-y-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Input
                  placeholder="Room name..."
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createRoom()}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={createRoom} className="bg-green-500 hover:bg-green-600">Create</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowCreateRoom(false)}>Cancel</Button>
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setCurrentRoom(room.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    currentRoom === room.id 
                      ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 border-l-4 border-green-500 shadow-sm' 
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium dark:text-gray-200"># {room.name}</span>
                    {room.unreadCount! > 0 && (
                      <Badge variant="secondary" className="bg-green-500 text-white text-xs animate-pulse">
                        {room.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{room.lastMessage}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
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
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                #
              </div>
              <div>
                <h1 className="text-lg font-bold dark:text-gray-100">
                  {currentRoomData?.name || 'General'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {currentRoomData?.userCount || 0} members online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CallScheduler onScheduleCall={handleScheduleCall} />
              <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-600">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Hash className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-medium mb-2">Welcome to #{currentRoomData?.name || 'general'}!</p>
              <p className="text-sm text-gray-500">Start the conversation with a message, voice note, or sticker.</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div key={message.id} className="group relative">
                {message.type === 'poll' && message.pollData ? (
                  <div className="mb-4 flex justify-end">
                    <PollDisplay
                      poll={message.pollData}
                      onVote={(optionIndex) => handlePollVote(message.id, optionIndex)}
                      totalVotes={Object.values(message.pollData.votes).reduce((a, b) => a + b, 0)}
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <MessageBubble 
                      message={message} 
                      currentUser={userId}
                    />
                    {message.username !== userId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReplyToMessage(message)}
                        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <MessageSquareReply className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg">
          <ReplySystem replyingTo={replyingTo} onCancelReply={() => setReplyingTo(null)} />
          <div className="flex items-center gap-2">
            <FileUpload onFileSelect={handleFileSelect} />
            <VoiceRecorder onVoiceNote={handleVoiceNote} />
            <StickerPicker onStickerSelect={handleStickerSelect} />
            <PollCreator onCreatePoll={handleCreatePoll} />
            <div className="flex-1 relative">
              <Input
                placeholder={`Message #${currentRoomData?.name || 'general'}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="pr-10 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </div>
            </div>
            <Button 
              onClick={() => sendMessage()} 
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-md"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use **bold**, *italic* for formatting. Upload files, record voice notes, send stickers, create polls, and reply to messages.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
