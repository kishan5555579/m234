import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const result = await forgotPassword(email);
    if (result.success) {
      setEmailSent(true);
      setMessage(result.message);
      if (result.resetLink) {
        setResetLink(result.resetLink);
      }
    } else {
      setError(result.message);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Success Message */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F396c5c8a5717496c9b3846e1a2b79ba1?format=webp&width=800"
                  alt="WTF - Win The Fitness"
                  className="h-16 w-auto"
                />
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                Check your email
              </h1>

              <p className="text-gray-600 mb-4">
                We've sent password reset instructions to{" "}
                <strong>{email}</strong>
              </p>

              {resetLink && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Demo Mode:</strong> Click the link below to reset
                    your password:
                  </p>
                  <a
                    href={resetLink}
                    className="text-blue-600 hover:text-blue-800 underline break-all text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resetLink}
                  </a>
                </div>
              )}

              <div className="space-y-4">
                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="w-full h-12"
                >
                  Try another email
                </Button>

                <Link to="/login">
                  <Button className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-white">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Image placeholder */}
        <div className="flex-1 bg-gray-200 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-300 rounded-2xl flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              The perfect analytics tool for your business
            </h2>
            <p className="text-gray-600">
              Commit to your workout and watch your goals take shape
            </p>
            <div className="flex justify-center space-x-2 mt-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F396c5c8a5717496c9b3846e1a2b79ba1?format=webp&width=800"
                alt="WTF - Win The Fitness"
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* Back Button */}
          <Link
            to="/login"
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Login
          </Link>

          {/* Forgot Password Form */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Forgot your password?
            </h1>

            <p className="text-gray-600 mb-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              {message && (
                <div className="text-green-500 text-sm text-center">
                  {message}
                </div>
              )}

              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-gray-50 border-gray-200"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-white"
              >
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Remember your password?{" "}
              </span>
              <Link
                to="/login"
                className="text-sm text-blue-500 hover:text-blue-600 font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image placeholder */}
      <div className="flex-1 bg-gray-200 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 mx-auto mb-8 bg-gray-300 rounded-2xl flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            The perfect analytics tool for your business
          </h2>
          <p className="text-gray-600">
            Commit to your workout and watch your goals take shape
          </p>
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
