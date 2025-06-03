// src/components/OtpVerificationPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import formBgImage from "./StartupPages/Login-bg.jpg";
import axios from "axios"; // For API calls

function OtpVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailForOtp = location.state?.email || ""; // Get email passed from ForgotPasswordPage

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(5); // Initial attempts
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!emailForOtp) {
      // If no email is passed, redirect to forgot password or show error
      navigate("/forgot-password");
    }
  }, [emailForOtp, navigate]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false; // Only allow numbers

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    setError(""); // Clear error on input

    // Focus next input
    if (element.value !== "" && element.nextSibling && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Focus previous input on backspace if current input is empty
    if (
      e.key === "Backspace" &&
      otp[index] === "" &&
      e.target.previousSibling &&
      index > 0
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/verify-otp", {
        email: emailForOtp,
        otp: enteredOtp,
      });
      setSuccessMessage(response.data.message);
      // If successful, navigate to a "Reset Password" page, passing the verified email and OTP (or a token)
      // For now, we'll assume successful verification allows password reset on a subsequent screen
      // navigate('/reset-password-confirmed', { state: { email: emailForOtp, otp: enteredOtp } });
      alert(
        "OTP Verified! (Simulated - Next step would be password reset form)"
      );
      // For simplicity, let's navigate to login after successful OTP for now
      // In a real app, you'd go to a page to enter the new password
      navigate("/login", {
        state: {
          message:
            "OTP verified. You can now set a new password (Feature to be implemented).",
        },
      });
    } catch (err) {
      const apiError = err.response?.data;
      setError(
        apiError?.message || "OTP verification failed. Please try again."
      );
      if (apiError && typeof apiError.attemptsLeft !== "undefined") {
        setAttemptsLeft(apiError.attemptsLeft);
        if (apiError.attemptsLeft <= 0) {
          // Handle max attempts reached, e.g., disable verify button or redirect
        }
      }
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccessMessage("");
    setResendDisabled(true);
    setResendTimer(60); // Disable resend for 60 seconds

    try {
      await axios.post("/api/auth/forgot-password", { email: emailForOtp });
      setSuccessMessage(`A new OTP has been sent to ${emailForOtp}.`);
      setAttemptsLeft(5); // Reset attempts on resend
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
      setResendDisabled(false); // Re-enable immediately on error
      setResendTimer(0);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch text-white">
      {/* Left Panel */}
      <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0 bg-black">
        <div
          className="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center"
          style={{ backgroundImage: `url(${formBgImage})` }}
        >
          <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        </div>

        <div className="w-full py-6 z-20">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gray-800 rounded-full border-2 border-custom-orange">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-custom-orange"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-custom-orange mb-2">
            Check your email
          </h1>
          <p className="text-base text-gray-300 mb-6">Please enter your OTP</p>

          <form
            onSubmit={handleSubmit}
            className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto"
          >
            <div className="flex justify-center space-x-2 sm:space-x-3 mb-4">
              {otp.map((data, index) => {
                return (
                  <div key={index} className="relative">
                    <input
                      type="text"
                      name="otp"
                      maxLength="1"
                      className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold bg-gray-800 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-custom-orange ${
                        error
                          ? "border-red-500 ring-red-500"
                          : "border-gray-700"
                      }`}
                      value={data}
                      onChange={(e) => handleChange(e.target, index)}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                    />
                    {/* Small 'x' icon for individual box error - optional for this design */}
                    {/* {error && otp[index] === '' && ( // Example if you wanted per-box error
                        <span className="absolute -top-1 -right-1 text-red-500 text-xs">x</span>
                     )} */}
                  </div>
                );
              })}
            </div>

            {error && (
              <p className="text-sm text-red-500 mb-4">
                {error}
                {typeof attemptsLeft === "number" &&
                  attemptsLeft > 0 &&
                  ` Attempts left: ${attemptsLeft} out of ${MAX_OTP_ATTEMPTS}`}
                {typeof attemptsLeft === "number" &&
                  attemptsLeft <= 0 &&
                  ` Max attempts reached.`}
              </p>
            )}
            {successMessage && (
              <p className="text-sm text-green-500 mb-4">{successMessage}</p>
            )}

            <div className="px-4 pb-2 pt-4">
              <button
                type="submit"
                className="uppercase block w-full p-3 text-lg rounded-md bg-custom-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-custom-orange focus:ring-opacity-50 text-black font-semibold"
                disabled={attemptsLeft <= 0}
              >
                Verify Email
              </button>
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              Didn't receive the email?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendDisabled || resendTimer > 0}
                className={`font-semibold text-custom-orange hover:underline focus:outline-none ${
                  resendDisabled || resendTimer > 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Click to resend {resendTimer > 0 && `(${resendTimer}s)`}
              </button>
            </div>
            <div className="mt-8 text-center text-sm text-gray-400">
              <Link
                to="/signup"
                className="font-semibold text-gray-300 hover:text-custom-orange hover:underline inline-flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
      {/* Right Panel */}
      <div
        className="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center"
        style={{ backgroundImage: `url(${formBgImage})` }}
      >
        <div className="absolute bg-black opacity-20 inset-0 z-0"></div>
      </div>
    </div>
  );
}

export default OtpVerificationPage;
