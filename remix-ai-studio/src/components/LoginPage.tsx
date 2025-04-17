import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'sonner';
import prismLogo from '../assets/prism-logo.png';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    // In a real app, you would authenticate with a server here
    // For now, we'll just simulate a successful login
    toast.success('Login successful!');
    
    // Navigate to the main app
    navigate('/remix');
  };

  const handleGoogleSignIn = () => {
    // In a real app, you would implement Google OAuth here
    toast.info('Google Sign In would be implemented here');
    navigate('/remix');
  };

  return (
    <div className="min-h-screen flex bg-[#0e0b16] text-white">
      <div className="w-full flex">
        {/* Left side - Login form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center">
              <img src={prismLogo} alt="Prism Logo" className="h-24" />
            </div>
            
            <h1 className="text-4xl font-bold mb-2 text-center">Get Started</h1>
            <p className="text-gray-400 mb-8 text-center">Log in to create and remix music with AI-powered tools.</p>
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">Email address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-studio-accent"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full p-3 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-studio-accent"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="mr-2 h-4 w-4 accent-studio-accent"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="text-red-400 text-sm hover:underline">Forgot Password?</a>
              </div>
              
              <button
                type="submit"
                className="w-full bg-studio-accent text-white py-3 rounded-md font-medium hover:bg-opacity-90 transition-all mb-4"
              >
                Log in
              </button>
              
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex justify-center items-center gap-2 border border-gray-700 py-3 rounded-md font-medium hover:bg-gray-800 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                Sign up with Google
              </button>
            </form>
            
            <p className="text-center mt-8">
              Don't have an account? <a href="#" className="text-studio-accent hover:underline" onClick={() => navigate('/signup')}>Sign Up</a>
            </p>
          </div>
        </div>
        
        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2 bg-[#0e0b16] p-4">
          <div className="h-full w-full rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src="https://i.imgur.com/8eYCZJP.png" 
              alt="AI Music Robot" 
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
