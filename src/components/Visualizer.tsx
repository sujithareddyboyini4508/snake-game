import { motion } from "motion/react";

interface VisualizerProps {
  isPlaying: boolean;
  color: string;
}

export default function Visualizer({ isPlaying, color }: VisualizerProps) {
  const bars = Array.from({ length: 40 });

  return (
    <div className="flex items-end justify-center gap-1 h-32 w-full px-4 overflow-hidden">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-t-full"
          style={{ backgroundColor: color }}
          animate={{
            height: isPlaying 
              ? [
                  `${Math.random() * 20 + 10}%`,
                  `${Math.random() * 80 + 20}%`,
                  `${Math.random() * 40 + 10}%`
                ] 
              : "10%"
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
