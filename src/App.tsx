import { useState, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import SnakeGame from "./components/SnakeGame";
import MusicPlayer from "./components/MusicPlayer";
import Visualizer from "./components/Visualizer";
import { Track } from "./types";
import { Gamepad2, Trophy, Disc3 } from "lucide-react";

const TRACKS: Track[] = [
  {
    id: "1",
    title: "Electric Pulse",
    artist: "Aether AI",
    cover: "https://picsum.photos/seed/pulse/800/800",
    url: "#",
    color: "#39FF14" // Neon Green
  },
  {
    id: "2",
    title: "Cyber Serenade",
    artist: "Synth Mind",
    cover: "https://picsum.photos/seed/serenade/800/800",
    url: "#",
    color: "#FF007F" // Neon Pink
  },
  {
    id: "3",
    title: "Shadow Rhythm",
    artist: "Deep Core",
    cover: "https://picsum.photos/seed/shadow/800/800",
    url: "#",
    color: "#00F3FF" // Neon Blue
  }
];

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTrack = useMemo(() => TRACKS[currentTrackIndex], [currentTrackIndex]);

  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) setHighScore(newScore);
  }, [highScore]);

  const nextTrack = () => setCurrentTrackIndex(prev => (prev + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrackIndex(prev => (prev - 1 + TRACKS.length) % TRACKS.length);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-neon-green selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <motion.div 
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px]"
          style={{ backgroundColor: currentTrack.color }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[120px]"
          style={{ backgroundColor: currentTrack.color === "#39FF14" ? "#FF007F" : "#39FF14" }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Main Grid Layout */}
      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 p-4 lg:p-12 items-center max-w-[1600px] mx-auto min-h-screen">
        
        {/* Left Section: Stats & Visuals */}
        <section className="flex flex-col gap-12 order-2 lg:order-1">
          <div className="space-y-2">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-white/40"
            >
              <Disc3 size={14} className="animate-spin-slow" />
              Live Visualizer
            </motion.div>
            <Visualizer isPlaying={isPlaying} color={currentTrack.color} />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
                  <Gamepad2 size={12} />
                  Current Score
                </div>
                <div className="text-4xl font-bold font-mono tracking-tighter" style={{ color: currentTrack.color }}>
                  {score.toString().padStart(4, '0')}
                </div>
             </div>
             <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
                  <Trophy size={12} />
                  Peak Record
                </div>
                <div className="text-4xl font-bold font-mono tracking-tighter text-white">
                  {highScore.toString().padStart(4, '0')}
                </div>
             </div>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] mb-4 text-white/40">How to Play</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-4">
                <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-neon-green">ARROW KEYS</kbd> 
                <span>to navigate the grid</span>
              </li>
              <li className="flex items-center gap-4">
                <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-white">WALLS/SELF</kbd> 
                <span>ends the sequence</span>
              </li>
              <li className="flex items-center gap-4">
                <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-white">MUSIC</kbd> 
                <span>syncs with your flow</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Center Section: Game Canvas */}
        <section className="flex flex-col items-center gap-8 order-1 lg:order-2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className="absolute -inset-4 blur-3xl opacity-20 rounded-full" style={{ backgroundColor: currentTrack.color }} />
            <SnakeGame onScoreChange={handleScoreChange} gameColor={currentTrack.color} />
          </motion.div>
          
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter uppercase italic leading-none">
              Neon<span className="text-transparent" style={{ WebkitTextStroke: '1px white', opacity: 0.5 }}>Rhythm</span>
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/40">Cyber-Physical Interface v2.0</p>
          </div>
        </section>

        {/* Right Section: Music Player */}
        <section className="flex justify-center lg:justify-end order-3">
          <MusicPlayer 
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onNext={nextTrack}
            onPrev={prevTrack}
          />
        </section>

      </main>

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 p-6 z-50 flex justify-between items-center bg-gradient-to-b from-[#050505] to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-neon-green flex items-center justify-center">
            <Disc3 className="text-neon-green animate-spin-slow" size={20} />
          </div>
          <span className="font-bold tracking-tight text-xl">NR_OS</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-white/40">SYSTEM STATUS</span>
            <span className="text-xs font-mono text-neon-green flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse shadow-[0_0_5px_#39FF14]" />
              ENCRYPTED
            </span>
          </div>
        </div>
      </header>
    </div>
  );
}

