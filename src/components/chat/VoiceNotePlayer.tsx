import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  audioUrl: string;
  isOwn: boolean;
}

const VoiceNotePlayer: React.FC<Props> = ({ audioUrl, isOwn }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : seconds}`;
  };

  return (
    <div className={cn(
      "flex items-center gap-3 min-w-[200px] max-w-[300px] p-2 rounded-lg",
      isOwn ? "bg-whatsapp-dark-bubbleOut" : "bg-whatsapp-dark-bubbleIn"
    )}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />
      
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          "h-8 w-8 rounded-full flex-shrink-0",
          isOwn ? "text-white bg-white/10 hover:bg-white/20" : "text-white bg-whatsapp-teal hover:bg-whatsapp-teal/90"
        )}
        onClick={togglePlayPause}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
          </svg>
        )}
      </Button>

      <div className="flex-1 flex flex-col">
        <div className="relative h-4 flex items-center">
          {/* Waveform Placeholder / Progress Bar */}
          <div className="w-full h-1 bg-gray-500/30 rounded-full overflow-hidden">
             <div 
               className="h-full bg-white/50 rounded-full"
               style={{ width: `${(progress / duration) * 100}%` }}
             ></div>
          </div>
        </div>
        <span className="text-[10px] text-white/60 mt-1 self-end">
          {formatTime(progress)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default VoiceNotePlayer;
