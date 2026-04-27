import { useEffect, useRef, useState, useCallback } from "react";
import { Point, Direction } from "../types";

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  gameColor: string;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

export default function SnakeGame({ onScoreChange, gameColor }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const nextDirection = useRef<Direction>("RIGHT");

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection("RIGHT");
    nextDirection.current = "RIGHT";
    setIsGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    onScoreChange(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp": if (direction !== "DOWN") nextDirection.current = "UP"; break;
        case "ArrowDown": if (direction !== "UP") nextDirection.current = "DOWN"; break;
        case "ArrowLeft": if (direction !== "RIGHT") nextDirection.current = "LEFT"; break;
        case "ArrowRight": if (direction !== "LEFT") nextDirection.current = "RIGHT"; break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };
        const currentDir = nextDirection.current;
        setDirection(currentDir);

        if (currentDir === "UP") newHead.y -= 1;
        if (currentDir === "DOWN") newHead.y += 1;
        if (currentDir === "LEFT") newHead.x -= 1;
        if (currentDir === "RIGHT") newHead.x += 1;

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
          setSpeed(prev => Math.max(50, prev - SPEED_INCREMENT));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [food, isGameOver, score, speed, generateFood, onScoreChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Snake
    snake.forEach((p, index) => {
      ctx.fillStyle = gameColor;
      ctx.shadowBlur = 15;
      ctx.shadowColor = gameColor;
      
      const padding = 2;
      ctx.beginPath();
      ctx.roundRect(
        p.x * cellSize + padding,
        p.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2,
        index === 0 ? 6 : 4
      );
      ctx.fill();
      
      // Reset shadow for next draw
      ctx.shadowBlur = 0;
    });

    // Draw Food
    ctx.fillStyle = "#fff";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#fff";
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [snake, food, gameColor]);

  return (
    <div className="relative group overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="block max-w-full aspect-square cursor-none"
      />
      
      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
          <h2 className="text-4xl font-bold mb-4 text-neon-pink text-neon-shadow-pink tracking-tight uppercase">Game Over</h2>
          <p className="text-xl mb-8 font-mono">Final Score: {score}</p>
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-neon-green/20 border border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-all duration-300 font-bold uppercase tracking-widest rounded-full"
          >
            Replay
          </button>
        </div>
      )}
      
      {!isGameOver && score === 0 && snake.length === 1 && (
        <div className="absolute inset-x-0 bottom-10 flex flex-col items-center pointer-events-none animate-pulse">
          <p className="text-white/40 text-sm font-mono uppercase tracking-[0.2em]">Press Arrows to Start</p>
        </div>
      )}
    </div>
  );
}
