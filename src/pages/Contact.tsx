import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get in touch with KTM Rentals. We're here to help you find the perfect room in Kathmandu Valley.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>Email</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href="mailto:ktmrentals54@gmail.com" 
                  className="text-primary hover:underline text-lg"
                >
                  ktmrentals54@gmail.com
                </a>
                <CardDescription className="mt-2">
                  Send us an email for any inquiries or support
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>Phone Numbers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <a href="tel:+9779763223104" className="text-primary hover:underline text-lg block">
                      +977 976-322-3104
                    </a>
                    <a href="tel:+9779745307478" className="text-primary hover:underline text-lg block">
                      +977 974-530-7478
                    </a>
                    <a href="tel:+9779701323704" className="text-primary hover:underline text-lg block">
                      +977 970-132-3704
                    </a>
                  </div>
                  <CardDescription>
                    Mobile numbers - Available 24/7
                  </CardDescription>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>Telephone</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href="tel:016636443" 
                  className="text-primary hover:underline text-lg"
                >
                  01-663-6443
                </a>
                <CardDescription className="mt-2">
                  Landline - Business hours (9 AM - 6 PM)
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Office Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic text-foreground">
                  Gatthaghar, Nepal<br />
                  (Opposite to German Homes)
                </address>
                <CardDescription className="mt-2">
                  Visit our office for in-person assistance
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Our Location</CardTitle>
                <CardDescription>
                  Find us in the heart of Kathmandu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d220.83874754349335!2d85.37555441019863!3d27.673412239331363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1a12b52a4e7f%3A0x5de7e689af13e9f3!2sM9FG%2B96X%2C%20Madhyapur%20Thimi%2044800!5e0!3m2!1sen!2snp!4v1754670779131!5m2!1sen!2snp"
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: "8px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="KTM Rentals Office Location"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;