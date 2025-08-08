import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Shield, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Find Your Perfect Room in
              <span className="text-primary block">Kathmandu Valley</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover comfortable, affordable rooms across Kathmandu, Patan, and Bhaktapur. 
              Your ideal home is just a click away.
            </p>
            <div className="flex flex-row gap-4 justify-center">
              <Link to="/rooms">
                <Button size="lg" className="flex items-center space-x-2">
                  <Search size={20} />
                  <span>Find Rooms</span>
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg">
                  Get Started
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
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Search className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>Easy Search</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find rooms by location, price range, and amenities. Filter results to match your exact needs.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <MapPin className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>Prime Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Rooms available in all major areas of Kathmandu Valley including Thamel, Patan, and Bhaktapur.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>Secure Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Safe and secure booking process with verified listings and trusted property owners.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Find Your Next Home?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of satisfied tenants who found their perfect room through KTM Rentals.
            </p>
            <Link to="/rooms">
              <Button size="lg" className="flex items-center space-x-2 mx-auto">
                <Users size={20} />
                <span>Browse Available Rooms</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 KTM Rentals. Making room finding easier in Kathmandu Valley.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
