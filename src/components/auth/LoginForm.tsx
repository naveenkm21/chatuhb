
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';

interface LoginFormProps {
  onLogin: (userId: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [accounts, setAccounts] = useState<{[key: string]: string}>({
    'demo': 'password123'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      if (accounts[userId]) {
        toast.error('Username already exists. Please choose a different one.');
        return;
      }

      setIsLoading(true);
      
      // Simulate account creation
      setTimeout(() => {
        setAccounts(prev => ({...prev, [userId]: password}));
        toast.success('Account created successfully! You are now logged in.');
        onLogin(userId, password);
        setIsLoading(false);
      }, 1000);
    } else {
      // Login
      if (!accounts[userId] || accounts[userId] !== password) {
        toast.error('Invalid username or password');
        return;
      }

      setIsLoading(true);
      
      // Simulate authentication
      setTimeout(() => {
        onLogin(userId, password);
        setIsLoading(false);
      }, 1000);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            ChatHub
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">Username</Label>
            <Input
              id="userId"
              type="text"
              placeholder="Enter your username"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
          )}
          
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              isSignUp ? 'Creating Account...' : 'Signing in...'
            ) : (
              <>
                {isSignUp ? (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </>
            )}
          </Button>
        </form>
        
        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={toggleMode}
            disabled={isLoading}
            className="text-sm"
          >
            {isSignUp 
              ? 'Already have an account? Sign in'
              : "Don't have an account? Create one"
            }
          </Button>
        </div>
        
        {!isSignUp && (
          <div className="text-center text-sm text-muted-foreground">
            Demo account: username "demo" with password "password123"
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginForm;
