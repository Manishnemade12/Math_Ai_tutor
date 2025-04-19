
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizTimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
  isPaused?: boolean;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ duration, onTimeUp, isPaused = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert to seconds
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    // Reset timer if duration changes
    setTimeLeft(duration * 60);
    setIsWarning(false);
  }, [duration]);

  useEffect(() => {
    if (isPaused) return;

    // Set warning state when less than 20% of time remains
    if (timeLeft <= duration * 60 * 0.2 && !isWarning) {
      setIsWarning(true);
    }

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, duration, onTimeUp, isPaused, isWarning]);

  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercent = (timeLeft / (duration * 60)) * 100;

  return (
    <div className="w-full max-w-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-math-primary" />
          <span className="text-sm font-medium">Time Remaining</span>
        </div>
        <span className={cn(
          "text-sm font-medium",
          isWarning && "text-red-500 animate-pulse-light"
        )}>
          {formatTime()}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-1000 ease-linear",
            isWarning ? "bg-red-500" : "bg-math-primary"
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default QuizTimer;
