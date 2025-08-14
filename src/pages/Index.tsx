import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Shield, Users } from "lucide-react";
import TypewriterText from "@/components/TypewriterText";
import { useAuth } from "@/hooks/useClerkAuth";

const Index = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-lavender/5 via-background to-brand-light-blue/5 flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-brand-light-blue/10 via-background to-brand-lavender/10 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Find Your Perfect{" "}
              <TypewriterText 
                words={["Room", "Job", "Stay"]} 
                speed={150}
                delay={3000}
                className="text-brand-light-blue"
              />{" "}
              in
              <span className="text-brand-light-blue block">Kathmandu Valley</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover comfortable, affordable rooms across Kathmandu, Lalitpur, and Bhaktapur. 
              Your ideal home is just a click away.
            </p>
            <div className="flex flex-row gap-4 justify-center">
              <Link to="/rooms">
                <Button size="lg" className="flex items-center space-x-2 bg-brand-light-blue hover:bg-brand-light-blue/90 shadow-lg shadow-brand-light-blue/25">
                  <Search size={20} />
                  <span>Find Rooms</span>
                </Button>
              </Link>
              <Link to="/post-property">
                <Button variant="outline" size="lg" className="border-2 border-brand-lavender hover:border-brand-lavender/70 hover:bg-brand-lavender/10">
                  Post Your Property For Free!
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why Choose KTM Rentals?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We make finding and booking rooms in Kathmandu Valley simple, safe, and reliable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-brand-light-gray/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-brand-light-blue/10">
                  <Search className="h-12 w-12 text-brand-light-blue" />
                </div>
              </div>
              <CardTitle className="text-brand-light-blue">Easy Search</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find rooms by location, price range, and amenities. Filter results to match your exact needs.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-brand-light-gray/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-brand-lavender/10">
                  <MapPin className="h-12 w-12 text-brand-lavender" />
                </div>
              </div>
              <CardTitle className="text-brand-lavender">Prime Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Rooms available in all major areas of Kathmandu Valley including Kathmandu, Lalitpur, and Bhaktapur.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-brand-light-gray/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-brand-light-blue/10">
                  <Shield className="h-12 w-12 text-brand-light-blue" />
                </div>
              </div>
              <CardTitle className="text-brand-light-blue">Secure Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All properties are verified and secure. Book with confidence knowing your safety is our priority.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-brand-lavender/20 to-brand-light-blue/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Find Your Perfect Room?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their ideal accommodation through KTM Rentals.
          </p>
          <Link to="/rooms">
            <Button size="lg" className="bg-brand-light-blue hover:bg-brand-light-blue/90 shadow-lg shadow-brand-light-blue/25">
              Start Searching Now
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
