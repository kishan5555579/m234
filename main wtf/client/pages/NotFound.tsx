import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F396c5c8a5717496c9b3846e1a2b79ba1?format=webp&width=800"
              alt="WTF - Win The Fitness"
              className="h-14 w-auto"
            />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page not found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="space-y-3">
          {user ? (
            <Link to="/dashboard">
              <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white">
                Go to Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
