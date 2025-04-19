
import React from 'react';
import { Button } from '@/components/componentsQ/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/componentsQ/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { Quiz } from '@/services/groqServicequizz';
import { cn } from '@/lib/utils';

interface QuizResultsProps {
  quiz: Quiz;
  userAnswers: Record<string, string>;
  onRetry: () => void;
  onNewQuiz: () => void;
  timeTaken: number; // in seconds
}

const QuizResults: React.FC<QuizResultsProps> = ({
  quiz,
  userAnswers,
  onRetry,
  onNewQuiz,
  timeTaken,
}) => {
  // Calculate results
  const totalQuestions = quiz.questions.length;
  const answeredQuestions = Object.keys(userAnswers).length;
  
  const correctAnswers = quiz.questions.reduce((total, question) => {
    const userAnswer = userAnswers[question.id];
    return userAnswer === question.correctAnswer ? total + 1 : total;
  }, 0);
  
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Format time taken
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  // Get performance message
  const getPerformanceMessage = () => {
    if (score >= 90) return "Excellent work! You've mastered this topic!";
    if (score >= 70) return "Good job! You have a solid understanding.";
    if (score >= 50) return "Not bad. With a bit more practice, you'll improve.";
    return "Keep practicing. Math takes time to master.";
  };

  return (
    <Card className="w-full max-w-lg math-card animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-math-primary to-math-secondary rounded-t-lg text-white">
        <CardTitle className="text-center text-2xl">Quiz Results</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-math-primary/10 border-4 border-math-primary mb-2">
            <span className="text-3xl font-bold text-math-primary">{score}%</span>
          </div>
          <p className="text-lg font-medium mt-2">{getPerformanceMessage()}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-math-primary/10 p-4 rounded-lg text-center">
            <p className="text-xs font-medium text-math-tertiary mb-1">CORRECT ANSWERS</p>
            <p className="text-2xl font-bold text-math-primary">
              {correctAnswers} <span className="text-sm font-normal text-math-tertiary">/ {totalQuestions}</span>
            </p>
          </div>
          <div className="bg-math-primary/10 p-4 rounded-lg text-center">
            <p className="text-xs font-medium text-math-tertiary mb-1">TIME TAKEN</p>
            <p className="text-2xl font-bold text-math-primary">
              {formatTime(timeTaken)}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-medium mb-2">Question Summary</h3>
          {quiz.questions.map((question) => {
            const userAnswer = userAnswers[question.id] || "Not answered";
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div 
                key={question.id}
                className={cn(
                  "p-3 rounded-lg border flex items-start gap-3",
                  isCorrect 
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900" 
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900"
                )}
              >
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium">{question.question}</p>
                  <p className="text-xs mt-1">
                    Your answer: <span className={!isCorrect ? "text-red-500 font-medium" : ""}>{userAnswer}</span>
                  </p>
                  {!isCorrect && (
                    <p className="text-xs mt-0.5">
                      Correct answer: <span className="text-green-500 font-medium">{question.correctAnswer}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex gap-4 justify-center py-6">
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="border-math-tertiary text-math-tertiary hover:bg-math-tertiary/10"
        >
          Retry Quiz
        </Button>
        <Button 
          onClick={onNewQuiz}
          className="bg-math-primary hover:bg-math-secondary"
        >
          New Quiz
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizResults;
