import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { performanceMetrics } from "../utils/performance";

const NotFound = () => {
  const startTime = performance.now();
  const location = useLocation();

  // Performance tracking
  useEffect(() => {
    performanceMetrics.componentRender('NotFound', startTime);
  }, [startTime]);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" role="main" aria-labelledby="not-found-heading">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4" id="not-found-heading">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
