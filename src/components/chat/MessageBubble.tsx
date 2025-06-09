
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, CheckCheck, Play, Pause, Download } from 'lucide-react';

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

interface MessageBubbleProps {
  message: Message;
  currentUser: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUser }) => {
  const isOwn = message.username === currentUser;
  const [isPlaying, setIsPlaying] = React.useState(false);

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">$1</a>');
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <div className="w-3 h-3 rounded-full bg-gray-400 animate-pulse" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="space-y-2">
            <img 
              src={message.fileUrl} 
              alt="Shared image" 
              className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.fileUrl, '_blank')}
            />
            {message.content && (
              <p dangerouslySetInnerHTML={{ __html: formatText(message.content) }} />
            )}
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{message.fileName}</p>
              <p className="text-xs text-gray-500">{message.fileSize}</p>
            </div>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => window.open(message.fileUrl, '_blank')}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        );
      
      case 'voice':
        return (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg min-w-[200px]">
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <div className="flex-1">
              <div className="h-1 bg-gray-200 rounded-full">
                <div className="h-1 bg-blue-500 rounded-full w-1/3"></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{message.voiceDuration}s</p>
            </div>
          </div>
        );
      
      case 'sticker':
        return (
          <div className="text-6xl">
            {message.content}
          </div>
        );
      
      case 'call-schedule':
        return (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">Scheduled Call</span>
            </div>
            <p className="font-medium">{message.callData?.title}</p>
            <p className="text-sm text-gray-600">
              {message.callData?.type === 'video' ? '📹' : '📞'} {message.callData?.type} call
            </p>
            <p className="text-xs text-gray-500">
              {message.callData?.date.toLocaleDateString()} at {message.callData?.time}
            </p>
          </div>
        );
      
      default:
        return <p dangerouslySetInnerHTML={{ __html: formatText(message.content) }} />;
    }
  };

  return (
    <div className={`mb-4 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {message.replyTo && (
          <div className="mb-2 p-2 bg-gray-100 border-l-4 border-blue-500 rounded text-xs">
            <p className="font-semibold text-blue-600">{message.replyTo.username}</p>
            <p className="text-gray-600 truncate">{message.replyTo.content}</p>
          </div>
        )}
        
        <Card className={`p-3 ${
          isOwn 
            ? 'bg-green-500 text-white ml-4' 
            : 'bg-white text-gray-900 mr-4'
        }`}>
          {!isOwn && (
            <p className="text-xs font-semibold mb-1 text-green-600">
              {message.username}
            </p>
          )}
          
          {renderMessageContent()}
          
          <div className={`flex items-center justify-between mt-2 ${isOwn ? 'text-green-100' : 'text-gray-500'}`}>
            <span className="text-xs">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isOwn && (
              <div className="ml-2">
                {getStatusIcon()}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MessageBubble;
