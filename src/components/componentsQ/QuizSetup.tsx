
import React, { useState } from 'react';
import { Button } from "@/components/componentsQ/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/componentsQ/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/componentsQ/ui/select";
import { Slider } from "@/components/componentsQ/ui/slider";
import { QuizParams } from '@/services/groqServicequizz';
import { AlertTriangle, Info, Loader, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/componentsQ/ui/alert";

interface QuizSetupProps {
  onStartQuiz: (params: QuizParams) => void;
  isLoading: boolean;
  error?: string | null;
}

const subjects = [
  { label: "Algebra", value: "algebra" },
  { label: "Geometry", value: "geometry" },
  { label: "Calculus", value: "calculus" },
  { label: "Statistics", value: "statistics" },
  { label: "Trigonometry", value: "trigonometry" },
  { label: "Number Theory", value: "number theory" },
];

const difficulties = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
  { label: "Expert", value: "expert" },
];

const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz, isLoading, error }) => {
  const [subject, setSubject] = useState<string>("algebra");
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [duration, setDuration] = useState<number>(10);
  const [retrying, setRetrying] = useState<boolean>(false);
  const [randomSeed, setRandomSeed] = useState<number>(Math.floor(Math.random() * 10000));

  const handleStartQuiz = () => {
    setRetrying(false);
    // Update random seed to ensure we get different questions
    setRandomSeed(Math.floor(Math.random() * 10000));
    onStartQuiz({ subject, difficulty, duration });
  };

  const handleRetry = () => {
    setRetrying(true);
    // Small delay to ensure UI updates before retrying
    setTimeout(() => {
      handleStartQuiz();
    }, 100);
  };

  const refreshRandomSeed = () => {
    setRandomSeed(Math.floor(Math.random() * 10000));
  };

  return (
    <Card className="w-full max-w-lg math-card animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-math-primary to-math-secondary rounded-t-lg">
        <CardTitle className="text-white text-2xl">MathMind Quiz</CardTitle>
        <CardDescription className="text-white/90">Customize your math quiz experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900">
          <Info className="h-5 w-5 text-blue-500" />
          <AlertTitle className="text-blue-700 dark:text-blue-300 font-medium">New questions every time!</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            Each quiz generates unique questions using AI. Click the Start Quiz button anytime to get a completely new set of questions.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <AlertTitle className="text-red-700 dark:text-red-300 font-medium">Error generating quiz</AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-300">
              <p>{error}</p>
              <div className="mt-3 flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  className="border-red-300 text-red-700 hover:bg-red-100 mt-1"
                  disabled={isLoading || retrying}
                >
                  {(isLoading || retrying) ? (
                    <span className="flex items-center">
                      <Loader className="w-3 h-3 mr-1 animate-spin" />
                      Retrying...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Try Again
                    </span>
                  )}
                </Button>
                <span className="text-xs text-red-600">Or try different parameters below.</span>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Subject</label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subj) => (
                <SelectItem key={subj.value} value={subj.value}>
                  {subj.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty</label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((diff) => (
                <SelectItem key={diff.value} value={diff.value}>
                  {diff.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Duration (minutes)</label>
            <span className="bg-math-primary/10 text-math-primary px-2 py-1 rounded-md font-medium">
              {duration} min
            </span>
          </div>
          <Slider
            defaultValue={[10]}
            min={5}
            max={30}
            step={5}
            onValueChange={(value) => setDuration(value[0])}
            className="py-4"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pt-2 pb-6">
        <Button 
          onClick={handleStartQuiz} 
          className="w-2/3 bg-math-primary hover:bg-math-secondary text-white"
          disabled={isLoading || retrying}
        >
          {isLoading || retrying ? (
            <span className="flex items-center">
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Generating Quiz...
            </span>
          ) : (
            <span className="flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Start Quiz
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizSetup;
