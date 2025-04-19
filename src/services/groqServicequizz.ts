// API key - in a real production app, this should be stored securely server-side
const GROQ_API_KEY = "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";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  title: string;
  description: string;
  questions: Question[];
}

export interface QuizParams {
  subject: string;
  difficulty: string;
  duration: number;
}

/**
 * Generates a math quiz using the Groq API
 */
export const generateMathQuiz = async (params: QuizParams): Promise<Quiz> => {
  try {
    const { subject, difficulty, duration } = params;
    
    // Calculate approximate number of questions based on duration
    // Assuming average time per question is 1-2 minutes
    const questionCount = Math.max(3, Math.min(15, Math.floor(duration / 2)));
    
    // Add randomness to get different questions each time
    const randomSeed = Math.floor(Math.random() * 10000);
    const randomTopics = getRandomTopics(subject);
    
    const prompt = `Create a math quiz about ${subject} focusing on these specific topics: ${randomTopics.join(", ")} with ${questionCount} multiple-choice questions at ${difficulty} difficulty level. 
    
    Format your response as a JSON object with the following structure exactly:
    {
      "title": "Quiz title related to the subject",
      "description": "A brief description of the quiz",
      "questions": [
        {
          "id": "1",
          "question": "The question text with any necessary math notation",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "The correct option exactly as written in the options array",
          "explanation": "Brief explanation of why this is the correct answer"
        }
      ]
    }
    
    Use quiz seed #${randomSeed} to generate unique questions.
    
    Ensure all questions are related to ${subject}, are at ${difficulty} level, and each has exactly 4 options with only one correct answer.
    
    VERY IMPORTANT: Return ONLY the valid JSON object without any additional text or formatting. Do not include any markdown formatting, code blocks, or explanations outside the JSON.`;

    console.log("Sending request to Groq API with params:", params);
    console.log("Using random seed:", randomSeed);
    console.log("Random topics:", randomTopics);
    console.log("Requested question count:", questionCount);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a mathematics quiz generator. Generate high-quality math quizzes with multiple-choice questions and answers. Your response must be ONLY a valid JSON object with no additional text, no markdown code blocks, and no explanations. Return only pure valid JSON that can be directly parsed."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7, // Increased temperature for more randomness
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      throw new Error(`Groq API returned an error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Groq API response received");
    
    try {
      const rawContent = data.choices[0].message.content;
      console.log("Raw response content:", rawContent);
      
      // Enhanced JSON extraction and parsing
      const cleanedContent = cleanJsonContent(rawContent);
      console.log("Cleaned content:", cleanedContent);
      
      let jsonContent;
      try {
        jsonContent = JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error("Initial parse failed, trying alternative methods:", parseError);
        jsonContent = extractJsonFromText(rawContent);
      }
      
      if (!jsonContent) {
        console.error("All parsing methods failed");
        throw new Error("Could not extract valid JSON from the response");
      }
      
      console.log("Extracted quiz content:", jsonContent);
      
      // Validate and fix the quiz content structure
      const validatedQuiz = validateAndFixQuizStructure(jsonContent);
      
      return validatedQuiz;
    } catch (parseError) {
      console.error("Failed to parse quiz content:", parseError);
      console.log("Raw content:", data.choices[0].message.content);
      throw new Error("Failed to parse quiz content from API response");
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

/**
 * Get random topics for a given subject to ensure variety
 */
function getRandomTopics(subject: string): string[] {
  const subjectTopics: Record<string, string[]> = {
    algebra: [
      "linear equations", "quadratic equations", "inequalities", 
      "polynomials", "factoring", "rational expressions", 
      "exponents", "radicals", "functions", "systems of equations"
    ],
    geometry: [
      "angles", "triangles", "quadrilaterals", "circles", 
      "area and perimeter", "volume", "coordinate geometry", 
      "transformations", "similarity", "congruence"
    ],
    calculus: [
      "limits", "derivatives", "integrals", "applications of derivatives", 
      "applications of integrals", "differential equations", 
      "sequences and series", "vector calculus", "optimization"
    ],
    statistics: [
      "data analysis", "probability", "random variables", "distributions", 
      "hypothesis testing", "confidence intervals", "regression", 
      "correlation", "sampling", "experimental design"
    ],
    trigonometry: [
      "trigonometric functions", "right triangles", "unit circle", 
      "identities", "equations", "law of sines", "law of cosines", 
      "polar coordinates", "vectors", "complex numbers"
    ],
    "number theory": [
      "divisibility", "prime numbers", "greatest common divisor", 
      "least common multiple", "modular arithmetic", "Diophantine equations", 
      "number sequences", "Fibonacci numbers", "cryptography"
    ]
  };

  // Default topics if subject not found
  const topics = subjectTopics[subject.toLowerCase()] || 
    ["equations", "expressions", "word problems", "basic operations"];
  
  // Select 3-5 random topics from the list
  const numTopics = Math.floor(Math.random() * 3) + 3; // 3 to 5 topics
  const selectedTopics: string[] = [];
  
  // Create a copy of the topics array to avoid modifying the original
  const availableTopics = [...topics];
  
  for (let i = 0; i < numTopics && availableTopics.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableTopics.length);
    selectedTopics.push(availableTopics[randomIndex]);
    // Remove the selected topic to avoid duplicates
    availableTopics.splice(randomIndex, 1);
  }
  
  return selectedTopics;
}

/**
 * Cleans the content to prepare for JSON parsing
 */
function cleanJsonContent(text: string): string {
  // Remove any markdown code block indicators
  let cleaned = text.replace(/```json|```/g, '').trim();
  
  // Remove any non-JSON text before the first { and after the last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  return cleaned;
}

/**
 * Extracts a JSON object from text which might contain additional content
 */
function extractJsonFromText(text: string): any {
  console.log("Attempting to extract JSON from text");
  
  // Try multiple approaches to extract valid JSON
  const approaches = [
    // Approach 1: Direct JSON parsing
    () => JSON.parse(text),
    
    // Approach 2: Extract with regex
    () => {
      const jsonRegex = /{[\s\S]*}/;
      const match = text.match(jsonRegex);
      if (match && match[0]) {
        return JSON.parse(match[0]);
      }
      throw new Error("Regex extraction failed");
    },
    
    // Approach 3: Look for the beginning and end of a JSON object
    () => {
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonSubstring = text.substring(firstBrace, lastBrace + 1);
        return JSON.parse(jsonSubstring);
      }
      throw new Error("Substring extraction failed");
    },
    
    // Approach 4: Try to repair common JSON syntax issues
    () => {
      let attempt = text.replace(/(\w+):/g, '"$1":')  // Replace unquoted keys
                       .replace(/'/g, '"');           // Replace single quotes with double quotes
      return JSON.parse(attempt);
    },
    
    // Approach 5: Create a minimal valid quiz if all else fails
    () => {
      console.log("All parsing methods failed, creating fallback quiz");
      return {
        title: "Math Quiz",
        description: "A quiz on mathematics concepts",
        questions: [
          {
            id: "1",
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            correctAnswer: "4",
            explanation: "Basic addition: 2 + 2 = 4"
          }
        ]
      };
    }
  ];
  
  for (let i = 0; i < approaches.length; i++) {
    try {
      console.log(`Trying approach ${i + 1}`);
      const result = approaches[i]();
      console.log(`Approach ${i + 1} succeeded`);
      return result;
    } catch (error) {
      console.error(`Approach ${i + 1} failed:`, error);
      // Continue to next approach
    }
  }
  
  return null;
}

/**
 * Validates and fixes the quiz structure if needed
 */
function validateAndFixQuizStructure(quiz: any): Quiz {
  console.log("Validating quiz structure");
  
  // Ensure quiz has a title
  if (!quiz.title || typeof quiz.title !== 'string') {
    console.log("Adding missing title");
    quiz.title = "Math Quiz";
  }
  
  // Ensure quiz has a description
  if (!quiz.description || typeof quiz.description !== 'string') {
    console.log("Adding missing description");
    quiz.description = "A quiz on mathematics concepts";
  }
  
  // Ensure quiz has questions array
  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    console.error("Quiz is missing valid questions array");
    throw new Error("Quiz is missing valid questions array");
  }
  
  // Validate and fix each question
  quiz.questions.forEach((question: any, index: number) => {
    // Add missing ID
    if (!question.id) {
      console.log(`Adding missing ID for question ${index + 1}`);
      question.id = (index + 1).toString();
    }
    
    // Validate question text
    if (!question.question || typeof question.question !== 'string') {
      console.error(`Question ${index + 1} is missing valid question text`);
      throw new Error(`Question ${index + 1} is missing valid question text`);
    }
    
    // Validate options - must have exactly 4
    if (!Array.isArray(question.options)) {
      console.error(`Question ${index + 1} has invalid options`);
      throw new Error(`Question ${index + 1} has invalid options`);
    }
    
    // Ensure there are exactly 4 options
    if (question.options.length !== 4) {
      console.log(`Fixing options count for question ${index + 1}`);
      
      if (question.options.length < 4) {
        // Add dummy options if needed
        while (question.options.length < 4) {
          question.options.push(`Option ${question.options.length + 1}`);
        }
      } else if (question.options.length > 4) {
        // Truncate extra options
        question.options = question.options.slice(0, 4);
      }
    }
    
    // Validate correct answer
    if (!question.correctAnswer || typeof question.correctAnswer !== 'string') {
      console.error(`Question ${index + 1} has invalid correctAnswer`);
      throw new Error(`Question ${index + 1} has invalid correctAnswer`);
    }
    
    // Ensure the correctAnswer is among the options
    if (!question.options.includes(question.correctAnswer)) {
      console.log(`Fixing correctAnswer for question ${index + 1}`);
      // Use the first option as the correct answer
      question.correctAnswer = question.options[0];
    }
    
    // Add explanation if missing
    if (!question.explanation) {
      console.log(`Adding missing explanation for question ${index + 1}`);
      question.explanation = `The correct answer is ${question.correctAnswer}`;
    }
  });
  
  console.log("Quiz structure validated and fixed");
  return quiz as Quiz;
}
