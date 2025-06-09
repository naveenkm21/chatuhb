
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Phone, Video, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

interface CallSchedulerProps {
  onScheduleCall: (callData: {
    type: 'voice' | 'video';
    date: Date;
    time: string;
    title: string;
  }) => void;
}

const CallScheduler: React.FC<CallSchedulerProps> = ({ onScheduleCall }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');

  const handleSchedule = () => {
    if (!selectedDate || !time || !title) {
      toast.error('Please fill in all fields');
      return;
    }

    onScheduleCall({
      type: callType,
      date: selectedDate,
      time,
      title
    });

    setIsOpen(false);
    setSelectedDate(undefined);
    setTime('');
    setTitle('');
    toast.success('Call scheduled successfully!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <CalendarIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Call</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={callType === 'voice' ? 'default' : 'outline'}
              onClick={() => setCallType('voice')}
              className="flex-1"
            >
              <Phone className="w-4 h-4 mr-2" />
              Voice Call
            </Button>
            <Button
              variant={callType === 'video' ? 'default' : 'outline'}
              onClick={() => setCallType('video')}
              className="flex-1"
            >
              <Video className="w-4 h-4 mr-2" />
              Video Call
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Call Title</Label>
            <Input
              id="title"
              placeholder="Meeting title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          
          <Button onClick={handleSchedule} className="w-full">
            Schedule Call
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallScheduler;
