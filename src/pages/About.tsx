import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Users, MapPin, Shield, Clock, Star, Award, ChevronDown, HelpCircle, Home, CreditCard, FileText, Phone } from "lucide-react";

const About = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const faqData = [
    {
      id: "general",
      title: "General Questions",
      icon: HelpCircle,
      questions: [
        {
          id: "what-is-ktm-rentals",
          question: "What is KTM Rentals?",
          answer: "KTM Rentals is a trusted online platform that connects property owners with tenants seeking quality accommodation in Kathmandu Valley. We provide verified, affordable rental properties with transparent pricing and reliable service."
        },
        {
          id: "areas-covered",
          question: "Which areas do you cover?",
          answer: "We currently serve Kathmandu, Lalitpur (Patan), and Bhaktapur, including popular areas like Thamel, Baneshwor, Lalitpur, and surrounding neighborhoods. We're continuously expanding our coverage."
        },
        {
          id: "property-types",
          question: "What types of properties do you offer?",
          answer: "We offer a wide range of properties including single rooms, studio apartments, 1-2-3+ bedroom apartments, and houses. All properties are verified and come with detailed descriptions and photos."
        }
      ]
    },
    {
      id: "renting",
      title: "Renting Process",
      icon: Home,
      questions: [
        {
          id: "how-to-rent",
          question: "How do I rent a room through KTM Rentals?",
          answer: "Browse our listings, contact the property owner through our platform, schedule a viewing, and once you're satisfied, complete the rental agreement. Our team can assist you throughout the process."
        },
        {
          id: "viewing-properties",
          question: "Can I view properties before renting?",
          answer: "Yes, absolutely! We encourage all tenants to view properties before making a decision. You can schedule viewings through our platform, and our team can arrange guided tours if needed."
        },
        {
          id: "rental-agreement",
          question: "What documents do I need for rental agreement?",
          answer: "You'll typically need: Valid ID proof (citizenship certificate, passport, or driving license), proof of income/employment, and advance rent payment. We can help you prepare all necessary documents."
        },
        {
          id: "rent-payment",
          question: "How do I pay rent?",
          answer: "Rent can be paid through various methods including bank transfer, digital wallets, or cash. We recommend digital payments for security and convenience. Payment schedules are clearly outlined in your rental agreement."
        }
      ]
    },
    {
      id: "pricing",
      title: "Pricing & Fees",
      icon: CreditCard,
      questions: [
        {
          id: "service-fees",
          question: "Are there any service fees?",
          answer: "We charge a small service fee only when you successfully rent a property through our platform. This fee covers property verification, documentation assistance, and ongoing support. No hidden charges!"
        },
        {
          id: "advance-payment",
          question: "How much advance payment is required?",
          answer: "Typically, landlords require 1-3 months' rent as advance payment, plus a security deposit. The exact amount varies by property and landlord. We'll clearly communicate all costs before you commit."
        },
        {
          id: "utilities-included",
          question: "Are utilities included in the rent?",
          answer: "This varies by property. Some include basic utilities (water, electricity), while others charge separately. All details are clearly listed in each property's description. We can clarify any specific arrangements."
        },
        {
          id: "rent-increase",
          question: "Can landlords increase rent during the lease?",
          answer: "Rent increases are typically only allowed at lease renewal time, not during the active lease period. Any changes must be communicated in advance as per Nepali rental laws. We ensure transparency in all dealings."
        }
      ]
    },
    {
      id: "support",
      title: "Support & Services",
      icon: Phone,
      questions: [
        {
          id: "contact-support",
          question: "How can I contact customer support?",
          answer: "You can reach us 24/7 through multiple channels: Phone (+977 976-322-3104), Email (ktmrentals54@gmail.com), or through our website's contact form. We typically respond within 2 hours."
        },
        {
          id: "emergency-support",
          question: "What if I have an emergency with my rental?",
          answer: "For emergencies, call our 24/7 hotline immediately. We'll connect you with the property owner or arrange emergency services. We also maintain a network of trusted repair services for urgent issues."
        },
        {
          id: "dispute-resolution",
          question: "How do you handle disputes between tenants and landlords?",
          answer: "We act as a neutral mediator in any disputes. Our team will listen to both parties, review the rental agreement, and help find a fair resolution. We're committed to maintaining positive relationships between tenants and landlords."
        },
        {
          id: "property-issues",
          question: "What if there are issues with the property after moving in?",
          answer: "Contact us immediately for any property-related issues. We'll coordinate with the landlord to resolve maintenance problems, repairs, or other concerns. Your comfort and safety are our priority."
        }
      ]
    },
    {
      id: "legal",
      title: "Legal & Documentation",
      icon: FileText,
      questions: [
        {
          id: "rental-agreement-legal",
          question: "Are your rental agreements legally binding?",
          answer: "Yes, all our rental agreements are legally binding and comply with Nepali rental laws. We ensure all terms are clearly stated and both parties understand their rights and responsibilities."
        },
        {
          id: "security-deposit",
          question: "How is the security deposit handled?",
          answer: "Security deposits are held by the landlord and returned at the end of the lease, minus any damages beyond normal wear and tear. We ensure proper documentation and transparency in this process."
        },
        {
          id: "lease-termination",
          question: "What are the terms for terminating a lease early?",
          answer: "Early termination terms are clearly outlined in your rental agreement. Typically, you need to provide 1-2 months' notice and may be responsible for rent until a new tenant is found. We can help negotiate fair terms."
        },
        {
          id: "tenant-rights",
          question: "What are my rights as a tenant?",
          answer: "As a tenant, you have rights to privacy, habitable living conditions, and protection from unfair practices. We ensure all properties meet basic standards and landlords respect tenant rights as per Nepali law."
        }
      ]
    }
  ];

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
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
        <Card className="mb-16">
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

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our rental services, processes, and policies.
            </p>
          </div>

          <div className="space-y-6">
            {faqData.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="bg-white/80 backdrop-blur-sm border-brand-light-gray/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-brand-light-blue" />
                      <span>{category.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.questions.map((faq) => (
                        <Collapsible
                          key={faq.id}
                          open={openFaq === faq.id}
                          onOpenChange={() => toggleFaq(faq.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-between p-4 h-auto text-left hover:bg-brand-lavender/10"
                            >
                              <span className="font-medium text-foreground">{faq.question}</span>
                              <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${
                                  openFaq === faq.id ? "rotate-180" : ""
                                }`}
                              />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-4 pb-4">
                            <div className="text-muted-foreground leading-relaxed border-l-2 border-brand-light-blue/30 pl-4">
                              {faq.answer}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact CTA */}
          <Card className="mt-8 bg-gradient-to-r from-brand-light-blue/10 to-brand-lavender/10 border-brand-light-blue/20">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Still Have Questions?
              </h3>
              <p className="text-muted-foreground mb-4">
                Can't find the answer you're looking for? Our support team is here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-brand-light-blue hover:bg-brand-light-blue/90">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="border-brand-light-gray/50">
                  <FileText className="h-4 w-4 mr-2" />
                  View Rental Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;