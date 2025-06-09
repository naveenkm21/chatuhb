
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square, Play, Pause, Send, X } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  onVoiceNote: (audioBlob: Blob, duration: number) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onVoiceNote }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<number | null>(null);
  const playTimeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (playTimeIntervalRef.current) {
        clearInterval(playTimeIntervalRef.current);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      startTimeRef.current = Date.now();
      
      // Update duration while recording
      durationIntervalRef.current = window.setInterval(() => {
        const newDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(newDuration);
      }, 100);
      
      toast.success('Recording started');
    } catch (error) {
      console.error('Recording error:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      
      const finalDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setDuration(finalDuration);
      toast.success('Recording stopped');
    }
  };

  const playAudio = () => {
    if (!audioUrl) return;

    if (!isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(audioUrl);
      audioRef.current.currentTime = currentTime;
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        
        // Update current time while playing
        playTimeIntervalRef.current = window.setInterval(() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }, 100);
        
        audioRef.current!.onended = () => {
          setIsPlaying(false);
          setCurrentTime(0);
          if (playTimeIntervalRef.current) {
            clearInterval(playTimeIntervalRef.current);
            playTimeIntervalRef.current = null;
          }
        };
      }).catch(error => {
        console.error('Playback error:', error);
        toast.error('Could not play audio');
      });
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        if (playTimeIntervalRef.current) {
          clearInterval(playTimeIntervalRef.current);
          playTimeIntervalRef.current = null;
        }
      }
    }
  };

  const sendVoiceNote = () => {
    if (audioBlob && duration > 0) {
      onVoiceNote(audioBlob, duration);
      resetRecorder();
      toast.success('Voice note sent!');
    }
  };

  const resetRecorder = () => {
    setAudioBlob(null);
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    
    if (playTimeIntervalRef.current) {
      clearInterval(playTimeIntervalRef.current);
      playTimeIntervalRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (audioBlob && !isRecording) {
    return (
      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 min-w-[280px]">
        <Button
          variant="ghost"
          size="sm"
          onClick={playAudio}
          className="h-10 w-10 p-0 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
        
        <div className="flex-1 space-y-1">
          <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-100 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-blue-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <Button
          variant="default"
          size="sm"
          onClick={sendVoiceNote}
          className="bg-green-500 hover:bg-green-600 h-8"
        >
          <Send className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={resetRecorder}
          className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isRecording && (
        <div className="flex items-center gap-2 text-red-500 animate-pulse">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">{formatTime(duration)}</span>
        </div>
      )}
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 p-0 transition-all duration-200 ${
          isRecording 
            ? 'text-red-500 bg-red-50 hover:bg-red-100' 
            : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
        }`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default VoiceRecorder;
