
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TextInputProps {
  onSubmit: (text: string) => void;
  isProcessing: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ onSubmit, isProcessing }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isProcessing) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 items-end bg-card/50 rounded-lg p-2 backdrop-blur-sm">
        <Textarea
          placeholder="Type your math question here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[50px] max-h-[200px] resize-none flex-1 bg-background/50"
          disabled={isProcessing}
        />
        <Button 
          type="submit" 
          size="icon"
          variant="default"
          disabled={!text.trim() || isProcessing}
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default TextInput;
