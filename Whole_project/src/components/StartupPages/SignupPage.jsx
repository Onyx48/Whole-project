// src/components/SignupPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import signupImage from './login-bg.jpg';

// Validation helpers (can be in a utils file)
const validateName = (name) => {
  if (!name.trim()) return 'Name is required.';
  return '';
};
const validateEmail = (email) => {
  if (!email) return 'Email is required.';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Please use a valid email address.';
  return '';
};
const validatePasswordSignup = (password) => {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return '';
};

const errorIcon = ( // Reusable error icon
    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </div>
  );

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleToCreate, setRoleToCreate] = useState('student');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentNameError = validateName(name);
    const currentEmailError = validateEmail(email);
    const currentPasswordError = validatePasswordSignup(password);

    setNameError(currentNameError);
    setEmailError(currentEmailError);
    setPasswordError(currentPasswordError);

    if (!currentNameError && !currentEmailError && !currentPasswordError) {
      console.log({ name, email, password, roleToCreate });
      alert("Signup Submitted (Simulated)");
      // Potentially clear forms or redirect
    }
  };

  // onChange handlers for each field to clear errors as user types
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (nameError) setNameError(validateName(e.target.value));
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(validateEmail(e.target.value));
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError(validatePasswordSignup(e.target.value));
  };

  return (
    <div className="min-h-screen flex items-stretch text-white">
      {/* Left Panel */}
      <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0 bg-black">
        {/* ... mobile background ... */}
         <div className="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center"
          style={{ backgroundImage: `url(${signupImage})` }}>
          <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        </div>

        <div className="w-full py-6 z-20">
          {/* ... title and subtitle ... */}
          <h1 className="text-4xl font-bold text-custom-orange mb-2">Sign Up</h1>
          <p className="text-base text-gray-300 mb-8">
            Sign up to SIT with few simple steps.
          </p>

          <form onSubmit={handleSubmit} className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
            {/* Name Input */}
            <div className="pb-2 pt-4">
              <label htmlFor="name-signup" className="block text-sm font-medium text-gray-300 text-left mb-1">Name<span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="text" name="name" id="name-signup" placeholder="Full Name" value={name} onChange={handleNameChange} onBlur={() => setNameError(validateName(name))}
                  className={`block w-full p-3 text-lg rounded-md bg-gray-800 border placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-custom-orange focus:border-transparent ${ nameError ? 'border-red-500 ring-red-500' : 'border-gray-700' }`}
                />
                {nameError && errorIcon}
              </div>
              {nameError && <p className="mt-2 text-sm text-red-500 text-left">{nameError}</p>}
            </div>

            {/* Email Input */}
            <div className="pb-2 pt-4">
              <label htmlFor="email-signup" className="block text-sm font-medium text-gray-300 text-left mb-1">Email<span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="email" name="email" id="email-signup" placeholder="your.email@example.com" value={email} onChange={handleEmailChange} onBlur={() => setEmailError(validateEmail(email))}
                  className={`block w-full p-3 text-lg rounded-md bg-gray-800 border placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-custom-orange focus:border-transparent ${ emailError ? 'border-red-500 ring-red-500' : 'border-gray-700' }`}
                />
                {emailError && errorIcon}
              </div>
              {emailError && <p className="mt-2 text-sm text-red-500 text-left">{emailError}</p>}
            </div>

            {/* Password Input */}
            <div className="pb-2 pt-4">
              <label htmlFor="password-signup" className="block text-sm font-medium text-gray-300 text-left mb-1">Password<span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="password" name="password" id="password-signup" placeholder="Enter your password" value={password} onChange={handlePasswordChange} onBlur={() => setPasswordError(validatePasswordSignup(password))}
                  className={`block w-full p-3 text-lg rounded-md bg-gray-800 border placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-custom-orange focus:border-transparent ${ passwordError ? 'border-red-500 ring-red-500' : 'border-gray-700' }`}
                  minLength={8}
                />
                {passwordError && errorIcon}
              </div>
              {passwordError ? (
                <p className="mt-2 text-sm text-red-500 text-left">{passwordError}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1 text-left">Must be at least 8 characters.</p>
              )}
            </div>

            {/* ... Get Started Button & Sign in link ... */}
            <div className="px-4 pb-2 pt-6">
              <button type="submit" className="uppercase block w-full p-3 text-lg rounded-md bg-custom-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-custom-orange focus:ring-opacity-50 text-black font-semibold">
                Get Started
              </button>
            </div>
            <div className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-custom-orange hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
      {/* Right Panel */}
      <div className="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center"
        style={{ backgroundImage: `url(${signupImage})` }}>
        <div className="absolute bg-black opacity-20 inset-0 z-0"></div>
      </div>
    </div>
  );
}

export default SignupPage;