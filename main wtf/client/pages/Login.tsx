import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login, selectedRole, setSelectedRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = await login(email, password, selectedRole);
    if (success) {
      if (selectedRole === "pt") {
        navigate("/pt/client-details");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError("Invalid email or password");
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccessMessage(message);
      // Clear the message from URL after showing it
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center justify-start">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F396c5c8a5717496c9b3846e1a2b79ba1?format=webp&width=800"
                alt="WTF - Win The Fitness"
                className="h-20 w-auto"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <div className="flex justify-center space-x-8">
              <div
                onClick={() => handleRoleSelect("admin")}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedRole === "admin"
                    ? "bg-black border-black"
                    : "border-gray-300 hover:border-gray-400"
                }`}>
                  {selectedRole === "admin" && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <span className={`mt-2 text-sm font-medium ${
                  selectedRole === "admin" ? "text-black" : "text-gray-500"
                }`}>
                  ADMIN
                </span>
              </div>
              <div
                onClick={() => handleRoleSelect("pt")}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedRole === "pt"
                    ? "bg-black border-black"
                    : "border-gray-300 hover:border-gray-400"
                }`}>
                  {selectedRole === "pt" && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <span className={`mt-2 text-sm font-medium ${
                  selectedRole === "pt" ? "text-black" : "text-gray-500"
                }`}>
                  PT
                </span>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Login to your account
            </h1>



            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              {successMessage && (
                <div className="text-green-500 text-sm text-center">
                  {successMessage}
                </div>
              )}

              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-gray-50 border-gray-200"
                />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-gray-50 border-gray-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-600 hover:text-blue-500"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-white"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="text-center text-sm text-gray-500 mb-4">
                Or login with
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 border-gray-200">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="h-12 border-gray-200">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.286-.744 2.840-.269 1.026-1.009 2.319-1.503 3.105C9.445 23.735 10.69 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"
                    />
                  </svg>
                  Apple
                </Button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
              </span>
              <Link
                to="/signup"
                className="text-sm text-blue-500 hover:text-blue-600 font-medium"
              >
                Get Started
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
