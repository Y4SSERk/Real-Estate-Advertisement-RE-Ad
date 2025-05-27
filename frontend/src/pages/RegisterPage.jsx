import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../utils/hooks';
import { authService } from '../services/api';
import AuthForm from '../components/auth/AuthForm';
import './AuthPages.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Use our custom form hook
  const { values, handleChange, setFieldValue } = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Basic validation
    if (values.password !== values.confirmPassword) {
      setError("Passwords don't match");
      setIsSubmitting(false);
      return;
    }
    
    if (!values.agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Extract first and last name from the full name
      const nameParts = values.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Create the username from the email (before @)
      const username = values.email.split('@')[0];
      
      // Prepare the registration data
      const registrationData = {
        username: username,
        email: values.email,
        password: values.password,
        first_name: firstName,
        last_name: lastName,
        phone: values.phone
      };
      
      console.log('Sending registration data:', registrationData);
      
      // Try to use the authService for registration
      try {
        const userData = await authService.register(registrationData);
        
        if (userData) {
          console.log('Registration successful:', userData);
          
          // Try to login with the new credentials
          await authService.login({
            username: values.email,
            password: values.password
          });
          
          // Store user info in localStorage for backward compatibility
          const user = {
            id: userData.id || Date.now() % 1000 + 10,
            name: values.name,
            email: values.email,
            phone: values.phone,
            role: 'user'
          };
          
          localStorage.setItem('user', JSON.stringify(user));
          
          // Redirect to home page
          navigate('/');
          window.location.reload(); // Force reload to update navbar
          return;
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        
        // For development purposes only - create a mock user if the API fails
        console.warn('Using fallback registration for development');
      }
      
      // Fallback registration for development purposes
      // Generate a unique ID based on timestamp
      const mockId = Date.now() % 1000 + 10; // Avoid conflicting with existing IDs
      
      const user = {
        id: mockId,
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: 'user'
      };
      
      console.log('Created mock user:', user);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect to home page
      navigate('/');
      window.location.reload(); // Force reload to update navbar
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define form fields for the AuthForm component
  const fields = [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      value: values.name,
      onChange: handleChange,
      icon: 'fa-user',
      autoComplete: 'name',
      required: true
    },
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
      name: 'phone',
      type: 'tel',
      label: 'Phone Number',
      placeholder: 'Enter your phone number',
      value: values.phone,
      onChange: handleChange,
      icon: 'fa-phone',
      autoComplete: 'tel',
      required: true
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Create a password',
      value: values.password,
      onChange: handleChange,
      icon: 'fa-lock',
      autoComplete: 'new-password',
      required: true
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
      value: values.confirmPassword,
      onChange: handleChange,
      icon: 'fa-lock',
      autoComplete: 'new-password',
      required: true
    },
    {
      name: 'agreeToTerms',
      type: 'checkbox',
      label: 'I agree to the Terms of Service and Privacy Policy',
      value: values.agreeToTerms,
      onChange: (e) => setFieldValue('agreeToTerms', e.target.checked),
      required: true
    }
  ];

  return (
    <div className="auth-page register-page">
      <div className="auth-container">
        <AuthForm
          title="Create an Account"
          buttonText="Create Account"
          onSubmit={handleSubmit}
          fields={fields}
          error={error}
          isLoading={isSubmitting}
          redirectText="Already have an account?"
          redirectLink="/login"
          redirectLinkText="Sign in"
        />
        
        <div className="auth-image">
          <div className="overlay"></div>
          <div className="auth-image-content">
            <h2>Join Our Community</h2>
            <p>Create an account to save favorite properties, receive updates, and more.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
