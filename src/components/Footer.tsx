import { Link } from "react-router-dom";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  Home,
  Search,
  Info,
  MessageCircle
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://facebook.com/ktmrentals",
      icon: Facebook,
      color: "hover:text-blue-600"
    },
    {
      name: "Instagram",
      url: "https://instagram.com/ktmrentals",
      icon: Instagram,
      color: "hover:text-pink-600"
    },
    {
      name: "Twitter",
      url: "https://twitter.com/ktmrentals",
      icon: Twitter,
      color: "hover:text-blue-400"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/ktmrentals",
      icon: Linkedin,
      color: "hover:text-blue-700"
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@ktmrentals",
      icon: Youtube,
      color: "hover:text-red-600"
    }
  ];

  const quickLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Find Rooms", path: "/rooms", icon: Search },
    { name: "About Us", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: MessageCircle }
  ];

  const contactInfo = [
    {
      icon: Mail,
      text: "ktmrentals54@gmail.com",
      href: "mailto:ktmrentals54@gmail.com"
    },
    {
      icon: Phone,
      text: "+977 976-322-3104",
      href: "tel:+9779763223104"
    },
    {
      icon: MapPin,
      text: "Gatthaghar, Nepal (Opposite to German Homes)",
      href: "https://maps.google.com/?q=Gatthaghar,Nepal"
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-brand-lavender/10 via-white to-brand-light-blue/10 border-t border-brand-light-gray/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src="/lovable-uploads/955766e5-a15d-452b-972e-f8792adb1f39.png" 
                  alt="KTM RENTALS" 
                  className="h-12 w-12 object-contain" 
                />
                <div className="absolute inset-0 bg-brand-light-blue/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">KTM RENTALS</h3>
                <p className="text-sm text-muted-foreground">Where Home Begins</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover comfortable, affordable rooms in Kathmandu, Lalitpur, and Bhaktapur. 
              Your ideal home is just a click away.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full bg-white/80 backdrop-blur-sm border border-brand-light-gray/50 text-muted-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color}`}
                    title={social.name}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-brand-light-blue transition-colors duration-300 group"
                    >
                      <IconComponent size={16} className="group-hover:scale-110 transition-transform duration-300" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact Info</h3>
            <ul className="space-y-3">
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <li key={index}>
                    <a
                      href={contact.href}
                      target={contact.href.startsWith('http') ? '_blank' : undefined}
                      rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-start space-x-2 text-sm text-muted-foreground hover:text-brand-light-blue transition-colors duration-300 group"
                    >
                      <IconComponent size={16} className="mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                      <span className="leading-relaxed">{contact.text}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest room listings and updates.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm bg-white/80 backdrop-blur-sm border border-brand-light-gray/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light-blue/50 focus:border-brand-light-blue"
              />
              <button className="w-full px-4 py-2 bg-brand-light-blue text-white text-sm font-medium rounded-lg hover:bg-brand-light-blue/90 transition-colors duration-300 shadow-lg shadow-brand-light-blue/25">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-brand-light-gray/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© {currentYear} KTM RENTALS. All rights reserved.</span>
              <Heart size={14} className="text-red-500 animate-pulse" />
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-brand-light-blue transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-brand-light-blue transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="/contact" className="hover:text-brand-light-blue transition-colors duration-300">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
