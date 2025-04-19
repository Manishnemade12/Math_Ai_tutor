
import React, { useState, useRef, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { toast } from '../components/ui/use-toast';
import { Button } from './ui/button';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  isProcessing: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const startListening = useCallback(() => {
    if (isProcessing) {
      toast({
        title: "Please wait",
        description: "I'm still processing your last request",
        variant: "default"
      });
      return;
    }
    
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser doesn't support speech recognition. Please try Chrome, Edge, or Safari.",
          variant: "destructive"
        });
        return;
      }
      
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      let finalTranscript = '';
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript.trim()) {
          onTranscript(finalTranscript.trim());
          finalTranscript = '';
          stopListening();
        }
      };
      
      recognition.start();
      
      toast({
        title: "Listening...",
        description: "Please speak your math question",
        variant: "default"
      });
    } catch (error) {
      console.error('Speech recognition error:', error);
      toast({
        title: "Error",
        description: "Failed to start speech recognition",
        variant: "destructive"
      });
    }
  }, [onTranscript, isProcessing]);
  
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);
  
  return (
    <Button
      onClick={isListening ? stopListening : startListening}
      disabled={isProcessing}
      variant="outline"
      size="icon"
      className={`relative transition-all duration-200 ${
        isListening 
          ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
          : 'hover:bg-accent'
      }`}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      {isListening && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
      )}
    </Button>
  );
};

export default VoiceInput;
