
import React, { useState } from 'react';
import { Question } from '@/services/groqServicequizz';
import { Button } from '@/components/componentsQ/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/componentsQ/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/componentsQ/ui/radio-group';
import { Label } from '@/components/componentsQ/ui/label';
import { cn } from '@/lib/utils';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (questionId: string, selectedAnswer: string) => void;
  userAnswer?: string;
  showFeedback: boolean;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  userAnswer,
  showFeedback,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(userAnswer);

  const handleOptionSelect = (value: string) => {
    if (!showFeedback) {
      setSelectedOption(value);
      onAnswer(question.id, value);
    }
  };

  const getOptionStyle = (option: string) => {
    if (!showFeedback) return '';
    
    if (option === question.correctAnswer) {
      return 'bg-green-100 dark:bg-green-900/30 border-green-500';
    }
    
    if (option === selectedOption && option !== question.correctAnswer) {
      return 'bg-red-100 dark:bg-red-900/30 border-red-500';
    }
    
    return '';
  };

  return (
    <Card className="w-full max-w-lg math-card animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-math-accent font-medium">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-math-primary/20 text-math-primary">
            {Math.ceil(questionNumber / totalQuestions * 100)}% Complete
          </div>
        </div>
        <CardTitle className="text-xl">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOption}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center space-x-2 rounded-md border p-3 cursor-pointer transition-all hover:bg-math-primary/5",
                getOptionStyle(option)
              )}
              onClick={() => handleOptionSelect(option)}
            >
              <RadioGroupItem
                value={option}
                id={`option-${question.id}-${index}`}
                disabled={showFeedback}
              />
              <Label
                htmlFor={`option-${question.id}-${index}`}
                className="w-full cursor-pointer"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {showFeedback && question.explanation && (
          <div className="mt-6 p-3 bg-math-primary/10 rounded-lg text-sm">
            <p className="font-medium text-math-primary mb-1">Explanation:</p>
            <p>{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={isFirst}
          className="border-math-tertiary text-math-tertiary hover:bg-math-tertiary/10"
        >
          Previous
        </Button>
        <Button 
          onClick={onNext}
          disabled={!selectedOption}
          className="bg-math-primary hover:bg-math-secondary"
        >
          {isLast ? "Finish Quiz" : "Next Question"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizQuestion;
