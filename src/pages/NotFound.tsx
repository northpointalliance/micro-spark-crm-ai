
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center space-y-6">
        <div className="text-crm-blue">
          <h1 className="text-9xl font-bold">404</h1>
          <div className="h-1 w-20 bg-crm-blue mx-auto my-6"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Page not found</h2>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-6 bg-crm-blue hover:bg-crm-blue-dark">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
