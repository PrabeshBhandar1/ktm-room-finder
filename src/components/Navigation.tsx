import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, LogIn, LogOut, UserCog, Search, Phone, Info, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-primary">
                KTM Rental
              </Link>
              <div className="flex space-x-6">
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
                  <Search size={16} />
                  <span>Find Rooms</span>
                </Link>
                <Link
                  to="/contact"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/contact") 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Phone size={16} />
                  <span>Contact</span>
                </Link>
                <Link
                  to="/about"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/about") 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Info size={16} />
                  <span>About</span>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {(user.user_metadata?.full_name || user.email)?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="secondary" size="sm" className="flex items-center space-x-2">
                        <UserCog size={16} />
                        <span>Admin</span>
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={signOut}
                    className="flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <LogIn size={16} />
                      <span>Login</span>
                    </Button>
                  </Link>
                  <Link to="/auth?type=admin">
                    <Button variant="secondary" size="sm" className="flex items-center space-x-2">
                      <UserCog size={16} />
                      <span>Admin</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-background border-b border-border sticky top-0 z-50">
        <div className="flex justify-between items-center h-14 px-4">
          <Link to="/" className="text-xl font-bold text-primary">
            KTM Rental
          </Link>
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {(user.user_metadata?.full_name || user.email)?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="secondary" size="sm">
                      <UserCog size={16} />
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut size={16} />
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    <LogIn size={16} />
                  </Button>
                </Link>
                <Link to="/auth?type=admin">
                  <Button variant="secondary" size="sm">
                    <UserCog size={16} />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="flex justify-around items-center h-16 px-2">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-colors ${
              isActive("/") 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home size={20} className="mb-1" />
            <span>Home</span>
          </Link>
          <Link
            to="/rooms"
            className={`flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-colors ${
              isActive("/rooms") 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search size={20} className="mb-1" />
            <span>Rooms</span>
          </Link>
          <Link
            to="/contact"
            className={`flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-colors ${
              isActive("/contact") 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Phone size={20} className="mb-1" />
            <span>Contact</span>
          </Link>
          <Link
            to="/about"
            className={`flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-colors ${
              isActive("/about") 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Info size={20} className="mb-1" />
            <span>About</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navigation;