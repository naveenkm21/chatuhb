
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ReplySystemProps {
  replyingTo: {
    id: string;
    username: string;
    content: string;
  } | null;
  onCancelReply: () => void;
}

const ReplySystem: React.FC<ReplySystemProps> = ({ replyingTo, onCancelReply }) => {
  if (!replyingTo) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-2 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-xs text-blue-600 font-semibold mb-1">
          Replying to {replyingTo.username}
        </p>
        <p className="text-sm text-gray-600 truncate">
          {replyingTo.content}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancelReply}
        className="h-6 w-6 p-0"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ReplySystem;
