import { Play, Pause, SkipBack, SkipForward, Music2, Volume2 } from "lucide-react";
import { Track } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface MusicPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function MusicPlayer({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev
}: MusicPlayerProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-sm p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
      {/* Artwork */}
      <div className="relative aspect-square w-full group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover rounded-2xl shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        
        <div 
          className="absolute inset-0 rounded-2xl opacity-40 mix-blend-overlay pointer-events-none"
          style={{ backgroundColor: currentTrack.color }}
        />
        
        {isPlaying && (
          <motion.div 
            className="absolute -inset-2 rounded-3xl blur-2xl opacity-20 transition-all duration-500"
            style={{ backgroundColor: currentTrack.color }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <motion.h3 
          key={`title-${currentTrack.id}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold tracking-tight truncate"
        >
          {currentTrack.title}
        </motion.h3>
        <motion.p 
          key={`artist-${currentTrack.id}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 0.6 }}
          className="text-sm font-medium text-white/60 flex items-center gap-2"
        >
          <Music2 size={14} />
          {currentTrack.artist}
        </motion.p>
      </div>

      {/* Progress Bar (Dummy) */}
      <div className="space-y-2">
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full rounded-full"
            style={{ backgroundColor: currentTrack.color }}
            animate={{ width: isPlaying ? "100%" : "30%" }}
            transition={{ duration: isPlaying ? 180 : 0.5, ease: "linear" }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-wider">
          <span>00:42</span>
          <span>03:15</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4">
        <button 
          onClick={onPrev}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <SkipBack size={24} />
        </button>

        <button 
          onClick={onTogglePlay}
          className="w-16 h-16 flex items-center justify-center rounded-full text-black transition-all hover:scale-105 active:scale-95 shadow-lg"
          style={{ 
            backgroundColor: currentTrack.color,
            boxShadow: `0 0 20px ${currentTrack.color}66`
          }}
        >
          {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="ml-1" />}
        </button>

        <button 
          onClick={onNext}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-4 text-white/20">
         <Volume2 size={16} />
         <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-white/40 w-2/3" />
         </div>
      </div>
    </div>
  );
}
