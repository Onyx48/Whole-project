// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import loginImage from './login-bg.jpg';

// Helper for email validation (can be moved to a utils file)
const validateEmail = (emailToValidate) => {
  if (!emailToValidate) return 'Email is required.';
  if (!/\S+@\S+\.\S+/.test(emailToValidate)) return 'Please use a valid email address.';
  return '';
};

const validatePassword = (passwordToValidate) => {
  if (!passwordToValidate) return 'Password is required.';
  // Add more password rules if needed (e.g., min length)
  return '';
};


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentEmailError = validateEmail(email);
    const currentPasswordError = validatePassword(password);

    setEmailError(currentEmailError);
    setPasswordError(currentPasswordError);

    if (!currentEmailError && !currentPasswordError) {
      console.log({ email, password, rememberMe });
      // Simulate API call
      if (email === "test@example.com" && password === "password") {
        alert("Login Successful (Simulated)");
      } else {
        // Simulate API error
        setEmailError("Incorrect email or password."); // General error after submit
        setPasswordError(" "); // To trigger red border on password field as well
      }
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(validateEmail(e.target.value)); // Clear/re-validate on change
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError(validatePassword(e.target.value)); // Clear/re-validate on change
  };

  const errorIcon = (
    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </div>
  );


  return (
    <div className="min-h-screen flex items-stretch text-white">
      {/* Left Panel */}
      <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0 bg-black">
        {/* ... mobile background ... */}
        <div className="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center"
          style={{ backgroundImage: `url(${loginImage})` }}>
          <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        </div>

        <div className="w-full py-6 z-20">
          {/* ... title and subtitle ... */}
          <h1 className="text-4xl font-bold text-custom-orange mb-2">Welcome Back</h1>
          <p className="text-base text-gray-300 mb-8">
            Welcome back! Please enter your details.
          </p>

          <form onSubmit={handleSubmit} className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
            {/* Email Input */}
            <div className="pb-2 pt-4">
              <label htmlFor="email-login" className="block text-sm font-medium text-gray-300 text-left mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email-login" // Unique ID
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => setEmailError(validateEmail(email))}
                  className={`block w-full p-3 text-lg rounded-md bg-gray-800 border placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-custom-orange focus:border-transparent ${
                    emailError ? 'border-red-500 ring-red-500' : 'border-gray-700'
                  }`}
                />
                {emailError && errorIcon}
              </div>
              {emailError && <p className="mt-2 text-sm text-red-500 text-left">{emailError}</p>}
            </div>

            {/* Password Input */}
            <div className="pb-2 pt-4">
              <label htmlFor="password-login" className="block text-sm font-medium text-gray-300 text-left mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  id="password-login" // Unique ID
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => setPasswordError(validatePassword(password))}
                  className={`block w-full p-3 text-lg rounded-md bg-gray-800 border placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-custom-orange focus:border-transparent ${
                    passwordError ? 'border-red-500 ring-red-500' : 'border-gray-700'
                  }`}
                />
                {passwordError && errorIcon}
              </div>
              {passwordError && passwordError.trim() && <p className="mt-2 text-sm text-red-500 text-left">{passwordError}</p>}
            </div>

            <div className="text-right text-gray-400 hover:underline hover:text-gray-100 mt-2 mb-6">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            {/* ... Remember Me ... */}
            <div className="flex items-center justify-start mb-6">
                <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-custom-orange bg-gray-800 border-gray-600 rounded focus:ring-custom-orange"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember For 30 Days
                </label>
            </div>
            {/* ... Sign In Button & Sign up link ... */}
            <div className="px-4 pb-2 pt-4">
              <button
                type="submit"
                className="uppercase block w-full p-3 text-lg rounded-md bg-custom-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-custom-orange focus:ring-opacity-50 text-black font-semibold"
              >
                Sign In
              </button>
            </div>
            <div className="mt-8 text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-custom-orange hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
      {/* Right Panel */}
      <div className="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center"
        style={{ backgroundImage: `url(${loginImage})` }}>
        <div className="absolute bg-black opacity-20 inset-0 z-0"></div>
      </div>
    </div>
  );
}

export default LoginPage;