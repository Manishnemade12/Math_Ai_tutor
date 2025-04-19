
import { Message } from '../components/Conversation';

const CONVERSATION_KEY = 'math-tutor-conversation';
const CONVERSATIONS_KEY = 'math-tutor-conversations';

// Interface for saved conversations
export interface SavedConversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  userId: string;
}

// Get active conversation ID
export const getActiveConversationId = (): string | null => {
  try {
    return localStorage.getItem('active-conversation-id');
  } catch (error) {
    console.error('Failed to get active conversation ID:', error);
    return null;
  }
};

// Set active conversation ID
export const setActiveConversationId = (id: string): void => {
  try {
    localStorage.setItem('active-conversation-id', id);
  } catch (error) {
    console.error('Failed to set active conversation ID:', error);
  }
};

// Get all conversations for a user
export const getConversations = (userId: string): SavedConversation[] => {
  try {
    const conversationsJson = localStorage.getItem(CONVERSATIONS_KEY);
    const conversations: SavedConversation[] = conversationsJson ? JSON.parse(conversationsJson) : [];
    return conversations.filter(conv => conv.userId === userId);
  } catch (error) {
    console.error('Failed to get conversations:', error);
    return [];
  }
};

// Create a new conversation
export const createConversation = (userId: string, title = 'New Conversation'): SavedConversation => {
  try {
    const conversationsJson = localStorage.getItem(CONVERSATIONS_KEY);
    const conversations: SavedConversation[] = conversationsJson ? JSON.parse(conversationsJson) : [];
    
    const now = Date.now();
    const newConversation: SavedConversation = {
      id: `conv_${now}`,
      title,
      messages: [],
      createdAt: now,
      updatedAt: now,
      userId,
    };
    
    const updatedConversations = [...conversations, newConversation];
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConversations));
    setActiveConversationId(newConversation.id);
    
    return newConversation;
  } catch (error) {
    console.error('Failed to create conversation:', error);
    throw new Error('Failed to create new conversation');
  }
};

// Save conversation
export const saveConversation = (conversationId: string, messages: Message[], userId: string): void => {
  try {
    const conversationsJson = localStorage.getItem(CONVERSATIONS_KEY);
    const conversations: SavedConversation[] = conversationsJson ? JSON.parse(conversationsJson) : [];
    
    const existingIndex = conversations.findIndex(c => c.id === conversationId);
    const now = Date.now();
    
    if (existingIndex >= 0) {
      // Update existing conversation
      conversations[existingIndex] = {
        ...conversations[existingIndex],
        messages,
        updatedAt: now,
      };
    } else {
      // Create new conversation
      conversations.push({
        id: conversationId,
        title: messages.length > 0 ? messages[0].content.slice(0, 30) + '...' : 'New Conversation',
        messages,
        createdAt: now,
        updatedAt: now,
        userId,
      });
    }
    
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    
    // For backward compatibility
    localStorage.setItem(CONVERSATION_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save conversation:', error);
  }
};

// Load conversation
export const loadConversation = (conversationId?: string): Message[] => {
  try {
    const id = conversationId || getActiveConversationId();
    
    if (id) {
      const conversationsJson = localStorage.getItem(CONVERSATIONS_KEY);
      const conversations: SavedConversation[] = conversationsJson ? JSON.parse(conversationsJson) : [];
      const conversation = conversations.find(c => c.id === id);
      
      if (conversation) {
        return conversation.messages;
      }
    }
    
    // For backward compatibility or if no conversation found
    const savedData = localStorage.getItem(CONVERSATION_KEY);
    return savedData ? JSON.parse(savedData) : [];
  } catch (error) {
    console.error('Failed to load conversation:', error);
    return [];
  }
};

// Delete conversation
export const deleteConversation = (conversationId: string): void => {
  try {
    const conversationsJson = localStorage.getItem(CONVERSATIONS_KEY);
    if (!conversationsJson) return;
    
    const conversations: SavedConversation[] = JSON.parse(conversationsJson);
    const updatedConversations = conversations.filter(c => c.id !== conversationId);
    
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConversations));
    
    // If the active conversation was deleted, clear it
    const activeId = getActiveConversationId();
    if (activeId === conversationId) {
      localStorage.removeItem('active-conversation-id');
    }
  } catch (error) {
    console.error('Failed to delete conversation:', error);
  }
};

// Clear conversation
export const clearConversation = (): void => {
  try {
    localStorage.removeItem(CONVERSATION_KEY);
    
    // Also clear from conversations list if active
    const activeId = getActiveConversationId();
    if (activeId) {
      const conversationsJson = localStorage.getItem(CONVERSATIONS_KEY);
      if (conversationsJson) {
        const conversations: SavedConversation[] = JSON.parse(conversationsJson);
        const conversationIndex = conversations.findIndex(c => c.id === activeId);
        
        if (conversationIndex >= 0) {
          conversations[conversationIndex].messages = [];
          localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
        }
      }
    }
  } catch (error) {
    console.error('Failed to clear conversation:', error);
  }
};
