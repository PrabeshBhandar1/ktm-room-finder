import { SignIn, SignUp } from "@clerk/clerk-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const ClerkAuth = () => {
  const [searchParams] = useSearchParams();
  const isAdminFlow = searchParams.get('admin') === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold">
                {isAdminFlow ? "Admin Access" : "Welcome"}
              </CardTitle>
              <CardDescription>
                {isAdminFlow 
                  ? "Please sign in with your admin credentials" 
                  : "Sign in to your account or create a new one"
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isAdminFlow ? (
                <div className="space-y-4">
                  <SignIn 
                    fallbackRedirectUrl="/admin"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 bg-transparent",
                      }
                    }}
                  />
                </div>
              ) : (
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-4">
                    <SignIn 
                      fallbackRedirectUrl="/"
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "shadow-none border-0 bg-transparent",
                        }
                      }}
                    />
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <SignUp 
                      fallbackRedirectUrl="/"
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "shadow-none border-0 bg-transparent",
                        }
                      }}
                    />
                  </TabsContent>
                </Tabs>
              )}
              
              <div className="mt-6 text-center">
                <Link 
                  to="/" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Back to Home
                </Link>
                {!isAdminFlow && (
                  <>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <Link 
                      to="/auth?admin=true" 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Admin Login
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClerkAuth;