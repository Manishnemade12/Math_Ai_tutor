import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import QuizSetup from '@/components/componentsQ/QuizSetup';
import QuizQuestion from '@/components/componentsQ/QuizQuestion';
import QuizTimer from '@/components/componentsQ/QuizTimer';
import QuizResults from '@/components/componentsQ/QuizResults';
import { generateMathQuiz, Quiz, QuizParams } from '@/services/groqServicequizz';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

type QuizState = 'setup' | 'quiz' | 'results';

const Quizz = () => {
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizParams, setQuizParams] = useState<QuizParams | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [retryCount, setRetryCount] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleStartQuiz = async (params: QuizParams) => {
    setIsLoading(true);
    setGenerationError(null);
    setQuizParams(params);

    try {
      console.log("Starting quiz generation with params:", params);
      const generatedQuiz = await generateMathQuiz(params);

      if (!generatedQuiz || !generatedQuiz.questions || generatedQuiz.questions.length === 0) {
        throw new Error("Generated quiz is missing questions");
      }

      setQuiz(generatedQuiz);
      setQuizState('quiz');
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setShowFeedback(false);
      setStartTime(Date.now());
      toast.success('Quiz generated successfully!');
    } catch (error: any) {
      console.error('Failed to generate quiz:', error);
      setGenerationError(error.message || 'Unknown error');
      toast.error('Failed to generate quiz. Please try again.');
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!quiz) return;

    if (currentQuestionIndex === quiz.questions.length - 1) {
      setTimeTaken(Math.floor((Date.now() - startTime) / 1000));
      setQuizState('results');
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowFeedback(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleTimeUp = () => {
    toast.warning('Time is up!');
    setTimeTaken(quizParams?.duration ? quizParams.duration * 60 : 0);
    setQuizState('results');
  };

  const handleRetryQuiz = () => {
    if (!quiz) return;

    setQuizState('quiz');
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowFeedback(false);
    setStartTime(Date.now());
  };

  const handleNewQuiz = () => {
    setQuizState('setup');
    setQuiz(null);
    setUserAnswers({});
  };

  useEffect(() => {
    if (retryCount > 0) {
      console.log(`Quiz generation retry attempt: ${retryCount}`);
    }
  }, [retryCount]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <Link to="/" className="absolute top-4 left-4">
        <Button variant="outline" size="sm">
          ⬅ Back
        </Button>
      </Link>
      <div className="w-full max-w-4xl flex flex-col items-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-math-primary to-math-accent bg-clip-text text-transparent mb-2">
          MathMind Quiz
        </h1>
        <p className="text-math-secondary mb-8 text-center max-w-md">
          Challenge yourself with Groq AI-generated math quizzes tailored to your preferences
        </p>

        {quizState === 'setup' && (
          <QuizSetup 
            onStartQuiz={handleStartQuiz} 
            isLoading={isLoading}
            error={generationError}
          />
        )}

        {quizState === 'quiz' && quiz && quizParams && (
          <div className="w-full max-w-lg flex flex-col items-center gap-6">
            <QuizTimer 
              duration={quizParams.duration} 
              onTimeUp={handleTimeUp} 
            />

            <QuizQuestion 
              question={quiz.questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quiz.questions.length}
              onAnswer={handleAnswer}
              userAnswer={userAnswers[quiz.questions[currentQuestionIndex].id]}
              showFeedback={showFeedback}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isFirst={currentQuestionIndex === 0}
              isLast={currentQuestionIndex === quiz.questions.length - 1}
            />
          </div>
        )}

        {quizState === 'results' && quiz && (
          <QuizResults 
            quiz={quiz}
            userAnswers={userAnswers}
            onRetry={handleRetryQuiz}
            onNewQuiz={handleNewQuiz}
            timeTaken={timeTaken}
            
          />
        )}
      </div>
    </div>
  );
};

export default Quizz;
