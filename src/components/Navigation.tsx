import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LogIn, Search, Phone, Info, Upload, User } from "lucide-react";
import { useAuth } from "@/hooks/useClerkAuth";
import { UserButton, SignInButton, SignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserLogin } from "@/hooks/useUserLogin";

const Navigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  
  // Use the custom hook to handle user login storage
  useUserLogin();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white/90 backdrop-blur-xl border-b border-brand-light-gray/50 sticky top-0 z-50 shadow-lg shadow-brand-lavender/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/955766e5-a15d-452b-972e-f8792adb1f39.png" 
                    alt="KTM Rentals" 
                    className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-brand-light-blue/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
              
              {/* Navigation Links */}
              <div className="flex space-x-1">
                <Link
                  to="/"
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive("/") 
                      ? "bg-brand-light-blue text-white shadow-lg shadow-brand-light-blue/30" 
                      : "text-foreground hover:bg-brand-lavender/20 hover:text-brand-light-blue hover:shadow-md"
                  }`}
                >
                  <Home size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  <span>Home</span>
                  {isActive("/") && (
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-light-blue/20 to-brand-light-blue/10 rounded-xl"></div>
                  )}
                </Link>
                <Link
                  to="/rooms"
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive("/rooms") 
                      ? "bg-brand-light-blue text-white shadow-lg shadow-brand-light-blue/30" 
                      : "text-foreground hover:bg-brand-lavender/20 hover:text-brand-light-blue hover:shadow-md"
                  }`}
                >
                  <Search size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  <span>Find Rooms</span>
                  {isActive("/rooms") && (
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-light-blue/20 to-brand-light-blue/10 rounded-xl"></div>
                  )}
                </Link>
                <Link
                  to="/contact"
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive("/contact") 
                      ? "bg-brand-light-blue text-white shadow-lg shadow-brand-light-blue/30" 
                      : "text-foreground hover:bg-brand-lavender/20 hover:text-brand-light-blue hover:shadow-md"
                  }`}
                >
                  <Phone size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  <span>Contact</span>
                  {isActive("/contact") && (
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-light-blue/20 to-brand-light-blue/10 rounded-xl"></div>
                  )}
                </Link>
                <Link
                  to="/about"
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive("/about") 
                      ? "bg-brand-light-blue text-white shadow-lg shadow-brand-light-blue/30" 
                      : "text-foreground hover:bg-brand-lavender/20 hover:text-brand-light-blue hover:shadow-md"
                  }`}
                >
                  <Info size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  <span>About</span>
                  {isActive("/about") && (
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-light-blue/20 to-brand-light-blue/10 rounded-xl"></div>
                  )}
                </Link>
                <Link
                  to="/post-property"
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive("/post-property") 
                      ? "bg-brand-light-blue text-white shadow-lg shadow-brand-light-blue/30" 
                      : "text-foreground hover:bg-brand-lavender/20 hover:text-brand-light-blue hover:shadow-md"
                  }`}
                >
                  <Upload size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  <span>Post Property</span>
                  {isActive("/post-property") && (
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-light-blue/20 to-brand-light-blue/10 rounded-xl"></div>
                  )}
                </Link>
              </div>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground font-medium">
                      Welcome, {user.firstName} {user.lastName}!
                    </span>
                    <Link
                      to="/dashboard"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive("/dashboard") 
                          ? "bg-brand-light-blue text-white shadow-lg shadow-brand-light-blue/30" 
                          : "text-foreground hover:bg-brand-lavender/20 hover:text-brand-light-blue hover:shadow-md"
                      }`}
                    >
                      <User size={16} />
                      <span>Dashboard</span>
                    </Link>
                  </div>
                  <div className="relative">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center space-x-2 border-2 border-brand-light-blue hover:border-brand-light-blue/70 hover:bg-brand-light-blue/10 transition-all duration-300 shadow-sm"
                    onClick={() => setIsSignInOpen(true)}
                  >
                    <LogIn size={16} />
                    <span>Login</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white/90 backdrop-blur-xl border-b border-brand-light-gray/50 sticky top-0 z-50 shadow-lg shadow-brand-lavender/10">
        <div className="flex justify-between items-center h-16 px-4">
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <img 
                src="/lovable-uploads/955766e5-a15d-452b-972e-f8792adb1f39.png" 
                alt="KTM Rentals" 
                className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
          </Link>
          
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-2 border-brand-light-blue hover:border-brand-light-blue/70 hover:bg-brand-light-blue/10"
                  onClick={() => setIsSignInOpen(true)}
                >
                  <LogIn size={16} />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-brand-light-gray/50 z-50 shadow-lg shadow-brand-lavender/10">
        <div className="flex justify-around items-center h-16 px-2">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-all duration-300 rounded-lg ${
              isActive("/") 
                ? "text-brand-light-blue bg-brand-light-blue/10" 
                : "text-muted-foreground hover:text-brand-light-blue hover:bg-brand-lavender/20"
            }`}
          >
            <Home size={20} className="mb-1 transition-transform duration-300 group-hover:scale-110" />
            <span>Home</span>
          </Link>
          <Link
            to="/rooms"
            className={`flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-all duration-300 rounded-lg ${
              isActive("/rooms") 
                ? "text-brand-light-blue bg-brand-light-blue/10" 
                : "text-muted-foreground hover:text-brand-light-blue hover:bg-brand-lavender/20"
            }`}
          >
            <Search size={20} className="mb-1 transition-transform duration-300 group-hover:scale-110" />
            <span>Rooms</span>
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className={`flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-all duration-300 rounded-lg ${
                isActive("/dashboard") 
                  ? "text-brand-light-blue bg-brand-light-blue/10" 
                  : "text-muted-foreground hover:text-brand-light-blue hover:bg-brand-lavender/20"
              }`}
            >
              <User size={20} className="mb-1 transition-transform duration-300 group-hover:scale-110" />
              <span>Dashboard</span>
            </Link>
          )}
          <Link
            to="/contact"
            className={`flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-all duration-300 rounded-lg ${
              isActive("/contact") 
                ? "text-brand-light-blue bg-brand-light-blue/10" 
                : "text-muted-foreground hover:text-brand-light-blue hover:bg-brand-lavender/20"
            }`}
          >
            <Phone size={20} className="mb-1 transition-transform duration-300 group-hover:scale-110" />
            <span>Contact</span>
          </Link>
          <Link
            to="/about"
            className={`flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-all duration-300 rounded-lg ${
              isActive("/about") 
                ? "text-brand-light-blue bg-brand-light-blue/10" 
                : "text-muted-foreground hover:text-brand-light-blue hover:bg-brand-lavender/20"
            }`}
          >
            <Info size={20} className="mb-1 transition-transform duration-300 group-hover:scale-110" />
            <span>About</span>
          </Link>
          <Link
            to="/post-property"
            className={`flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-all duration-300 rounded-lg ${
              isActive("/post-property") 
                ? "text-brand-light-blue bg-brand-light-blue/10" 
                : "text-muted-foreground hover:text-brand-light-blue hover:bg-brand-lavender/20"
            }`}
          >
            <Upload size={20} className="mb-1 transition-transform duration-300 group-hover:scale-110" />
            <span>Post</span>
          </Link>
        </div>
      </nav>

      {/* Sign In Modal */}
      <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogContent className="max-w-md bg-white/95 backdrop-blur-xl border-brand-light-gray/50">
          <DialogHeader>
            <DialogTitle className="text-center text-brand-light-blue">Sign In to KTM Rentals</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none bg-transparent",
                }
              }}
              redirectUrl={window.location.href}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navigation;