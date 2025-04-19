
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm, SignupForm } from '@/components/AuthForms';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import GeometricBackground from '@/components/GeometricBackground';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, isLoading } = useAuth();

  // Redirect if already logged in
  if (user && !isLoading) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <GeometricBackground />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-background/70 backdrop-blur-md p-8 rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-300 text-transparent bg-clip-text">
              Math AI Tutor
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </p>
          </div>
          
          {isLogin ? <LoginForm /> : <SignupForm />}
          
          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
