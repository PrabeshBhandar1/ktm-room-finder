import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Bed, Bath, Wifi, Car, Search, Eye } from "lucide-react";

// Mock data for rooms - this will be replaced with Supabase data later
const mockRooms = [
  {
    id: 1,
    title: "Cozy Room in Thamel",
    location: "Thamel, Kathmandu",
    price: 15000,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Parking"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop",
    available: true
  },
  {
    id: 2,
    title: "Modern Apartment in Patan",
    location: "Patan, Lalitpur",
    price: 25000,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["WiFi", "Parking", "Garden"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop",
    available: true
  },
  {
    id: 3,
    title: "Single Room in Bhaktapur",
    location: "Bhaktapur",
    price: 12000,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi"],
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop",
    available: true
  }
];

const Rooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRooms, setFilteredRooms] = useState(mockRooms);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Real-time search filtering
  useEffect(() => {
    const filtered = mockRooms.filter(room =>
      room.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRooms(filtered);
  }, [searchTerm]);

  const handleBookNow = (roomId: number) => {
    if (user) {
      navigate("/contact");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Find Your Perfect Room in Kathmandu Valley
          </h1>
          
          <div className="flex gap-4 max-w-md">
            <Input
              placeholder="Search by location or room type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{room.title}</CardTitle>
                  <Badge variant={room.available ? "default" : "secondary"}>
                    {room.available ? "Available" : "Booked"}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin size={14} className="mr-1" />
                  {room.location}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-primary">
                    Rs. {room.price.toLocaleString()}/month
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Bed size={14} className="mr-1" />
                    {room.bedrooms} bed
                  </div>
                  <div className="flex items-center">
                    <Bath size={14} className="mr-1" />
                    {room.bathrooms} bath
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                      {amenity === "WiFi" && <Wifi size={12} className="mr-1" />}
                      {amenity === "Parking" && <Car size={12} className="mr-1" />}
                      {amenity}
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <Eye size={16} className="mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{room.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="aspect-video overflow-hidden rounded-md">
                          <img
                            src={room.image}
                            alt={room.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold mb-2">Location</h3>
                            <div className="flex items-center text-muted-foreground">
                              <MapPin size={16} className="mr-2" />
                              {room.location}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold mb-2">Price</h3>
                            <div className="text-2xl font-bold text-primary">
                              Rs. {room.price.toLocaleString()}/month
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold mb-2">Room Details</h3>
                            <div className="flex gap-4 text-muted-foreground">
                              <div className="flex items-center">
                                <Bed size={16} className="mr-1" />
                                {room.bedrooms} bedroom{room.bedrooms > 1 ? 's' : ''}
                              </div>
                              <div className="flex items-center">
                                <Bath size={16} className="mr-1" />
                                {room.bathrooms} bathroom{room.bathrooms > 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold mb-2">Availability</h3>
                            <Badge variant={room.available ? "default" : "secondary"}>
                              {room.available ? "Available" : "Booked"}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-2">Amenities</h3>
                          <div className="flex flex-wrap gap-2">
                            {room.amenities.map((amenity, index) => (
                              <div key={index} className="flex items-center text-xs bg-accent text-accent-foreground px-3 py-1 rounded-full">
                                {amenity === "WiFi" && <Wifi size={12} className="mr-1" />}
                                {amenity === "Parking" && <Car size={12} className="mr-1" />}
                                {amenity}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button 
                            className="flex-1" 
                            disabled={!room.available}
                            onClick={() => handleBookNow(room.id)}
                          >
                            {room.available ? "Book Now" : "Not Available"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    className="flex-1" 
                    disabled={!room.available}
                    onClick={() => handleBookNow(room.id)}
                  >
                    {room.available ? "Book Now" : "Not Available"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rooms;