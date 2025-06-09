
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sticker } from 'lucide-react';

interface StickerPickerProps {
  onStickerSelect: (sticker: string) => void;
}

const StickerPicker: React.FC<StickerPickerProps> = ({ onStickerSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const stickers = [
    '👍', '👎', '❤️', '😂', '😮', '😢', '😡', '👏',
    '🎉', '🔥', '💯', '⭐', '🚀', '💡', '🎯', '✨',
    '🌟', '💝', '🎈', '🌈', '☀️', '🌙', '⚡', '💫',
    '🦄', '🐱', '🐶', '🐼', '🦊', '🐯', '🦁', '🐸'
  ];

  const handleStickerClick = (sticker: string) => {
    onStickerSelect(sticker);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Sticker className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2">
        <div className="grid grid-cols-8 gap-1">
          {stickers.map((sticker, index) => (
            <Button
              key={index}
              variant="ghost"
              className="h-8 w-8 p-0 text-lg hover:bg-gray-100"
              onClick={() => handleStickerClick(sticker)}
            >
              {sticker}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default StickerPicker;
