
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

// Define user type
export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_STORAGE_KEY = 'math-tutor-user';

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function (would connect to a real backend in production)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // In a real app, this would verify credentials with a backend
      // For this demo, we'll create a mock user
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0], // Use part of email as name
      };
      
      setUser(mockUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
      toast({
        title: "Login successful",
        description: `Welcome back, ${mockUser.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation
      if (!email || !password || !name) {
        throw new Error('Email, password, and name are required');
      }
      
      // In a real app, this would create a user in a backend
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
      };
      
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      toast({
        title: "Account created",
        description: `Welcome, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock logout function
  // In a real app, this would also invalidate the session on the backend
  // Logout function to clear user data and remove from local storage
  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    // Clear all conversations for this user
    localStorage.removeItem('math-tutor-conversation');
    localStorage.removeItem('math-tutor-conversations');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  // Update user profile
  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
