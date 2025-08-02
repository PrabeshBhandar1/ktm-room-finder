import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Wifi, Car, Search } from "lucide-react";

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

  const handleSearch = () => {
    const filtered = mockRooms.filter(room =>
      room.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRooms(filtered);
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Find Your Perfect Room in Kathmandu Valley
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            <Input
              placeholder="Search by location or room type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="flex items-center space-x-2 w-full sm:w-auto">
              <Search size={16} />
              <span>Search</span>
            </Button>
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
                
                <Button 
                  className="w-full" 
                  disabled={!room.available}
                >
                  {room.available ? "Book Now" : "Not Available"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rooms;