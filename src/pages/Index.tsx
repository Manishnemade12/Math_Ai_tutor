
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import VoiceInput from '@/components/VoiceInput';
import ImageUpload from '@/components/ImageUpload';
import TextInput from '@/components/TextInput';
import Conversation, { Message } from '@/components/Conversation';
import ThreeJSModel from '@/components/ThreeJSModel';
import GeometricBackground from '@/components/GeometricBackground';
import ApiKeyModal from '@/components/ApiKeyModal';
import TextToSpeech from '@/components/TextToSpeech';
import { useApiKey } from '@/hooks/useApiKey';
import { processQuery, processImageWithOCR } from '@/services/groqService';
import {
  saveConversation,
  loadConversation,
  clearConversation,
  createConversation,
  getActiveConversationId,
  setActiveConversationId,
} from '@/services/storageService';
import { Trash2, Settings, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from '@/components/UserProfile';
import ConversationSidebar from '@/components/ConversationSidebar';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastAIResponse, setLastAIResponse] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const { apiKey, isKeySet, saveApiKey, clearApiKey } = useApiKey();
  const { user } = useAuth();
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      // Get active conversation or create a new one
      const activeId = getActiveConversationId();
      if (activeId) {
        setActiveConversationId(activeId);
        const savedMessages = loadConversation(activeId);
        if (savedMessages.length > 0) {
          setMessages(savedMessages);
        }
      } else {
        // Create a new conversation if none exists
        try {
          const newConversation = createConversation(user.id);
          setActiveConversationId(newConversation.id);
        } catch (error) {
          console.error('Failed to create initial conversation:', error);
        }
      }
    }

    if (!isKeySet) {
      setIsApiKeyModalOpen(true);
    }
  }, [isKeySet, user]);

  useEffect(() => {
    if (messages.length > 0 && activeConversationId && user) {
      saveConversation(activeConversationId, messages, user.id);
    }
  }, [messages, activeConversationId, user]);

  const handleApiKeySave = (key: string) => {
    saveApiKey(key);
    toast({
      title: "API Key Saved",
      description: "Your GROQ API key has been saved",
    });
  };

  const handleConversationChange = (conversationId: string) => {
    setActiveConversationId(conversationId);
    const conversationMessages = loadConversation(conversationId);
    setMessages(conversationMessages);
  };

  const handleNewConversation = () => {
    if (!user) return;

    try {
      const newConversation = createConversation(user.id);
      setActiveConversationId(newConversation.id);
      setMessages([]);
      toast({
        title: "New conversation created",
      });
    } catch (error) {
      console.error('Failed to create new conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create new conversation",
        variant: "destructive",
      });
    }
  };

  const handleTextInput = async (text: string) => {
    if (!isKeySet) {
      setIsApiKeyModalOpen(true);
      return;
    }

    if (!activeConversationId && user) {
      const newConversation = createConversation(user.id);
      setActiveConversationId(newConversation.id);
    }

    const userMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content: text,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const response = await processQuery(text, apiKey);

      const assistantMessage: Message = {
        id: uuidv4(),
        type: 'assistant',
        content: response,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLastAIResponse(response);
    } catch (error) {
      console.error('Error processing text input:', error);
      toast({
        title: "Error",
        description: "Failed to process your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    if (!isKeySet) {
      setIsApiKeyModalOpen(true);
      return;
    }

    if (!activeConversationId && user) {
      const newConversation = createConversation(user.id);
      setActiveConversationId(newConversation.id);
    }

    const userMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content: transcript,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const response = await processQuery(transcript, apiKey);

      const assistantMessage: Message = {
        id: uuidv4(),
        type: 'assistant',
        content: response,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLastAIResponse(response);
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast({
        title: "Error",
        description: "Failed to process your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (imageData: string, file: File) => {
    if (!isKeySet) {
      setIsApiKeyModalOpen(true);
      return;
    }

    if (!activeConversationId && user) {
      const newConversation = createConversation(user.id);
      setActiveConversationId(newConversation.id);
    }

    const userMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content: "I've uploaded an image with a math problem.",
      imageUrl: imageData,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const ocrResult = await processImageWithOCR(imageData, apiKey);
      console.log("OCR result received:", ocrResult);

      const response = await processQuery(ocrResult, apiKey, imageData);

      const assistantMessage: Message = {
        id: uuidv4(),
        type: 'assistant',
        content: response,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLastAIResponse(response);
    } catch (error) {
      console.error('Error processing image upload:', error);
      toast({
        title: "Error",
        description: "Failed to process your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    clearConversation();
    toast({
      title: "Conversation Cleared",
      description: "All messages have been cleared",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <GeometricBackground />

      <header className="sticky top-0 z-50 border-b border-border p-4 flex justify-between items-center bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <ConversationSidebar onConversationChange={handleConversationChange} />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-300 text-transparent bg-clip-text">
            Math AI Tutor
          </h1>
        </div>

        <div className="flex gap-2 items-center">
          {/* <Button
            variant="outline"
            size="icon"
            onClick={handleNewConversation}
            title="New Conversation"
          >
            <Plus className="h-4 w-4" />
          </Button> */}

          <Link to="/quizz">
            <Button
              variant="outline"
              size="icon"
              title="Generate Quiz"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="icon"
            onClick={handleClearConversation}
            disabled={messages.length === 0}
            title="Clear Conversation"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <UserProfile />
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="ai-model-container h-64 bg-gradient-to-b from-accent/20 to-transparent">
          <ThreeJSModel isSpeaking={isSpeaking} />
        </div>

        <div className="conversation-container flex-1 overflow-auto">
          <Conversation messages={messages} isProcessing={isProcessing} />
        </div>

        {lastAIResponse && (
          <TextToSpeech
            text={lastAIResponse}
            onStartSpeaking={() => setIsSpeaking(true)}
            onStopSpeaking={() => setIsSpeaking(false)}
          />
        )}

        <div ref={controlsRef} className="p-4 border-t border-border sticky bottom-0 bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <TextInput onSubmit={handleTextInput} isProcessing={isProcessing} />
              </div>
              <div className="flex gap-2 items-end">
                <VoiceInput onTranscript={handleVoiceInput} isProcessing={isProcessing} />
                <ImageUpload onImageUploaded={handleImageUpload} isProcessing={isProcessing} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleApiKeySave}
      />
    </div>
  );
};

export default Index;
