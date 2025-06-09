
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, CheckCheck, Play, Pause, Download, Volume2, Clock } from 'lucide-react';

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
  const [currentTime, setCurrentTime] = React.useState(0);
  const [audioRef, setAudioRef] = React.useState<HTMLAudioElement | null>(null);

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline hover:text-blue-600">$1</a>');
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVoicePlayback = () => {
    if (!message.fileUrl) return;

    if (!audioRef) {
      const audio = new Audio(message.fileUrl);
      setAudioRef(audio);
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Audio playback failed:', error);
      });
    } else {
      if (isPlaying) {
        audioRef.pause();
        setIsPlaying(false);
      } else {
        audioRef.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error('Audio playback failed:', error);
        });
      }
    }
  };

  React.useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.removeEventListener('timeupdate', () => {});
        audioRef.removeEventListener('ended', () => {});
      }
    };
  }, [audioRef]);

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="space-y-2">
            <div className="relative group">
              <img 
                src={message.fileUrl} 
                alt="Shared image" 
                className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-md"
                onClick={() => window.open(message.fileUrl, '_blank')}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg" />
            </div>
            {message.content && (
              <p dangerouslySetInnerHTML={{ __html: formatText(message.content) }} />
            )}
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{message.fileName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{message.fileSize}</p>
            </div>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => window.open(message.fileUrl, '_blank')}
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        );
      
      case 'voice':
        const progress = message.voiceDuration && message.voiceDuration > 0 
          ? (currentTime / message.voiceDuration) * 100 
          : 0;
        
        return (
          <div className={`flex items-center gap-3 p-4 rounded-lg min-w-[280px] ${
            isOwn 
              ? 'bg-green-600 text-white' 
              : 'bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700'
          }`}>
            <Button
              size="sm"
              variant="ghost"
              className={`w-10 h-10 rounded-full flex-shrink-0 ${
                isOwn 
                  ? 'bg-green-700 hover:bg-green-800 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              onClick={handleVoicePlayback}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className={`w-4 h-4 ${isOwn ? 'text-green-200' : 'text-blue-600'}`} />
                <span className={`text-sm font-medium ${isOwn ? 'text-green-100' : 'text-blue-700 dark:text-blue-300'}`}>
                  Voice Message
                </span>
              </div>
              
              <div className={`h-2 rounded-full overflow-hidden ${
                isOwn ? 'bg-green-700' : 'bg-blue-200 dark:bg-blue-800'
              }`}>
                <div 
                  className={`h-full transition-all duration-100 ease-out ${
                    isOwn ? 'bg-green-300' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Clock className={`w-3 h-3 ${isOwn ? 'text-green-200' : 'text-blue-500'}`} />
                  <span className={`text-xs ${isOwn ? 'text-green-200' : 'text-blue-600 dark:text-blue-400'}`}>
                    {formatTime(currentTime)} / {formatTime(message.voiceDuration || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'sticker':
        return (
          <div className="text-7xl animate-bounce">
            {message.content}
          </div>
        );
      
      case 'call-schedule':
        return (
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 border border-green-200 dark:border-green-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">Scheduled Call</span>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{message.callData?.title}</h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                {message.callData?.type === 'video' ? '📹' : '📞'} 
                <span className="capitalize">{message.callData?.type} call</span>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                📅 {message.callData?.date.toLocaleDateString()} at {message.callData?.time}
              </p>
            </div>
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
          <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-800 border-l-4 border-blue-500 rounded text-xs">
            <p className="font-semibold text-blue-600 dark:text-blue-400">{message.replyTo.username}</p>
            <p className="text-gray-600 dark:text-gray-400 truncate">{message.replyTo.content}</p>
          </div>
        )}
        
        <Card className={`p-3 shadow-md hover:shadow-lg transition-shadow ${
          isOwn 
            ? 'bg-green-500 text-white ml-4 rounded-tr-sm' 
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mr-4 rounded-tl-sm'
        }`}>
          {!isOwn && (
            <p className="text-xs font-semibold mb-2 text-green-600 dark:text-green-400">
              {message.username}
            </p>
          )}
          
          <div className="break-words">
            {renderMessageContent()}
          </div>
          
          <div className={`flex items-center justify-between mt-2 ${
            isOwn ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
          }`}>
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
