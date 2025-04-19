
import React, { useEffect } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';

interface TextToSpeechProps {
  text: string;
  onStartSpeaking?: () => void;
  onStopSpeaking?: () => void;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ 
  text, 
  onStartSpeaking, 
  onStopSpeaking 
}) => {
  const [selectedVoice, setSelectedVoice] = React.useState<SpeechSynthesisVoice | null>(null);
  
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
    onEnd: () => {
      if (onStopSpeaking) onStopSpeaking();
    }
  });
  
  // Select a voice with a neutral accent when voices are loaded
  useEffect(() => {
    if (voices.length > 0 && !selectedVoice) {
      const englishVoices = voices.filter(voice => 
        voice.lang.includes('en') && voice.name.includes('Google') || voice.name.includes('Microsoft')
      );
      setSelectedVoice(englishVoices.length > 0 ? englishVoices[0] : voices[0]);
    }
  }, [voices, selectedVoice]);
  
  // Auto-speak when new text is received
  useEffect(() => {
    if (text && supported && selectedVoice) {
      if (speaking) cancel();
      
      if (onStartSpeaking) onStartSpeaking();
      
      speak({ 
        text,
        voice: selectedVoice,
        volume: 0.8,
        rate: 1,
        pitch: 1
      });
    }
  }, [text, selectedVoice]);

  // Don't render any UI elements
  return null;
};

export default TextToSpeech;
