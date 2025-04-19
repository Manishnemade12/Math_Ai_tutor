
import { createWorker } from 'tesseract.js';

export interface GroqAPIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    logprobs: null;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Helper to clean AI responses
function cleanResponse(text: string): string {
  // Remove markdown special characters
  return text
    .replace(/##/g, '')
    .replace(/\*\*/g, '')
    .replace(/```[a-z]*\n|```/g, '')
    .trim();
}

export async function processQuery(
  query: string,
  apiKey: string,
  imageData?: string
): Promise<string> {
  try {
    // For now, we'll handle API key missing scenario
    if (!apiKey) {
      console.error("GROQ API key is missing");
      return "I'm having trouble connecting to my math knowledge. Please check the API key.";
    }

    const messages = [
      {
        role: "system",
        content: `You are a helpful AI math tutor specializing in explaining math concepts, solving math problems, and providing step-by-step solutions. 
        If an image is provided, analyze it carefully to identify any math problems, equations, or concepts, and then provide a thorough explanation.
        If responding to a voice query, carefully understand the mathematical question and provide a clear, step-by-step solution.
        Always format your responses in a way that's easy to read, using line breaks between steps.
        Always start by identifying what type of math problem it is.
        Present your solutions in a clear, structured way that a student can follow.
        DO NOT use special formatting like ##, **, or code blocks in your responses.`
      },
      {
        role: "user",
        content: imageData
          ? `This is a math problem from an image: ${query}. The image data is: ${imageData}`
          : query
      }
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages,
        temperature: 0.5,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("GROQ API error:", errorData);
      throw new Error(`GROQ API error: ${response.status}`);
    }

    const data: GroqAPIResponse = await response.json();
    return cleanResponse(data.choices[0].message.content);
  } catch (error) {
    console.error("Error processing query with GROQ API:", error);
    return "I encountered an error while processing your math question. Please try again.";
  }
}

export async function processImageWithOCR(
  imageData: string,
  apiKey: string
): Promise<string> {
  try {
    // Initialize Tesseract.js worker with proper options
    const worker = await createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    // Process image with OCR
    const { data: { text } } = await worker.recognize(imageData);
    
    // Terminate worker to free resources
    await worker.terminate();
    
    console.log("OCR Result:", text);
    
    if (!text || text.trim() === '') {
      return "I couldn't extract any text from the image. Could you please describe the problem?";
    }
    
    return text;
  } catch (error) {
    console.error("Error processing image with Tesseract:", error);
    return "I encountered an error while analyzing your image. Please try again or describe the problem verbally.";
  }
}
