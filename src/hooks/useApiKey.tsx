
import { useState } from 'react';

const GROQ_API_KEY = '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';

export function useApiKey() {
  const [apiKey] = useState<string>(GROQ_API_KEY);
  const [isKeySet] = useState<boolean>(true);
  
  return { 
    apiKey, 
    isKeySet,
    saveApiKey: () => {}, 
    clearApiKey: () => {} 
  };
}
