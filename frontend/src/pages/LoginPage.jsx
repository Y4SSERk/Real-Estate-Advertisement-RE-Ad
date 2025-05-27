import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../utils/hooks';
import { authService } from '../services/api';
import AuthForm from '../components/auth/AuthForm';
import './AuthPages.css';

function LoginPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Use our custom form hook
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Try to use the authService for login
      try {
        const userData = await authService.login({
          username: values.email, // Using email as username
          password: values.password
        });
        
        // If we successfully get a token from the backend, proceed
        if (userData) {
          // Get user profile data
          const userProfile = await authService.getCurrentUser();
          
          // Store user info in localStorage (for backward compatibility)
          const user = {
            id: userProfile.id,
            name: userProfile.name || values.email.split('@')[0],
            email: values.email,
            phone: userProfile.phone || '',
            role: userProfile.role || 'user'
          };
          
          console.log('Logged in as:', user);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Redirect to home page
          navigate('/');
          window.location.reload(); // Force reload to update navbar
          return;
        }
      } catch (err) {
        console.log('Backend login API not available, using fallback login');
      }
      
      // Fallback login for development purposes
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // For demo purposes, if backend login is not implemented yet
      let userId = 1; // Default user ID
      
      // If using Zineb's account
      if (values.email.toLowerCase().includes('zineb')) {
        userId = 7; // Zineb's user ID
      } else if (values.email.toLowerCase().includes('admin')) {
        userId = 1; // Admin's user ID
      }
      
      // Store user info in localStorage
      const user = {
        id: userId,
        name: values.email.split('@')[0],
        email: values.email,
        phone: '',
        role: 'user'
      };
      
      console.log('Logged in as (fallback):', user);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect to home page
      navigate('/');
      window.location.reload(); // Force reload to update navbar
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define form fields for the AuthForm component
  const fields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      value: values.email,
      onChange: handleChange,
      icon: 'fa-envelope',
      autoComplete: 'email',
      required: true
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      value: values.password,
      onChange: handleChange,
      icon: 'fa-lock',
      autoComplete: 'current-password',
      required: true
    }
  ];

  return (
    <div className="auth-page login-page">
      <div className="auth-container">
        <AuthForm
          title="Welcome Back"
          buttonText="Sign In"
          onSubmit={handleSubmit}
          fields={fields}
          error={error}
          isLoading={isSubmitting}
          redirectText="Don't have an account?"
          redirectLink="/register"
          redirectLinkText="Sign up"
        />
        
        <div className="auth-image">
          <div className="overlay"></div>
          <div className="auth-image-content">
            <h2>Find Your Dream Property</h2>
            <p>Browse thousands of properties and find your perfect home.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
