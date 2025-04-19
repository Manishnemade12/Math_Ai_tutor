
import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

interface ConversationProps {
  messages: Message[];
  isProcessing: boolean;
}

const Conversation: React.FC<ConversationProps> = ({ messages, isProcessing }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (messages.length === 0 && !isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Welcome to Math AI Tutor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-border/50">
            <h3 className="font-semibold text-lg mb-3">Voice Questions</h3>
            <p className="text-muted-foreground">
              Click the microphone button and ask your math question verbally for instant help.
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-border/50">
            <h3 className="font-semibold text-lg mb-3">Image Upload</h3>
            <p className="text-muted-foreground">
              Upload a picture of your math problem and get step-by-step solutions.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.type === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[85%] rounded-lg p-4 shadow-md ${
              message.type === 'user'
                ? 'bg-primary/90 text-primary-foreground ml-12'
                : 'bg-card/90 mr-12'
            }`}
          >
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt="Uploaded math problem"
                className="max-w-full rounded-md mb-3 border border-border/50"
              />
            )}
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>
        </div>
      ))}
      
      {isProcessing && (
        <div className="flex justify-start">
          <div className="bg-card/90 rounded-lg p-4 flex items-center gap-3 shadow-md">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Thinking...</p>
          </div>
        </div>
      )}
      
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default Conversation;
