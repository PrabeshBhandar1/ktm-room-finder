import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Shield, Clock, Star, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            About KTM Rentals
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in finding quality accommodation across Kathmandu Valley. 
            We connect students, professionals, and families with verified, affordable rental properties.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-6 w-6 text-primary" />
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To simplify the room rental process in Kathmandu Valley by providing a 
                reliable, transparent, and user-friendly platform that connects property 
                owners with tenants seeking quality accommodation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-primary" />
                <span>Our Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To become the leading rental platform in Nepal, making quality housing 
                accessible to everyone while fostering trust and community among property 
                owners and tenants.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Company Story */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
            <CardDescription>How KTM Rentals came to be</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Founded in 2020, KTM Rentals was born out of the frustration many people face 
              when searching for accommodation in Kathmandu Valley. Our founders, having 
              experienced the challenges of finding reliable, affordable housing firsthand, 
              decided to create a solution that would benefit both tenants and landlords.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Starting with just a handful of properties in Kathmandu, we've grown to serve 
              thousands of users across the valley, including Patan, Bhaktapur, and surrounding 
              areas. Our commitment to verification, transparency, and customer service has made 
              us a trusted name in the rental market.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we continue to innovate and improve our platform, always keeping our users' 
              needs at the center of everything we do.
            </p>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Why Choose KTM Rentals?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Verified Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All properties are personally verified by our team to ensure quality and accuracy.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Trusted Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Join thousands of satisfied tenants and property owners in our trusted community.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Clock className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our dedicated support team is available round the clock to assist you.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Our Impact</CardTitle>
            <CardDescription className="text-center">
              Numbers that showcase our growth and success
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">2000+</div>
                <div className="text-sm text-muted-foreground">Properties Listed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">5000+</div>
                <div className="text-sm text-muted-foreground">Happy Tenants</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">3</div>
                <div className="text-sm text-muted-foreground">Cities Covered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">4.8★</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;