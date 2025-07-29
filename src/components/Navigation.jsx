import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LogIn, UserCog } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-primary">
              KTM Rental
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/") 
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Home size={16} />
                <span>Home</span>
              </Link>
              <Link
                to="/rooms"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/rooms") 
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <span>Find Rooms</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <LogIn size={16} />
                <span>Login</span>
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="secondary" size="sm" className="flex items-center space-x-2">
                <UserCog size={16} />
                <span>Admin</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;