
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-studio-bg">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-studio-accent">404</h1>
        <p className="text-xl text-white mb-8">Oops! Page not found</p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-studio-accent text-white rounded-md hover:bg-opacity-90 transition-all"
        >
          <Home className="h-4 w-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
