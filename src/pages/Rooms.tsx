import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useAuth } from "@/hooks/useClerkAuth";
import { MapPin, Bed, Bath, Wifi, Car, Search, Eye, EyeOff, Loader2, Filter, SortAsc, SortDesc } from "lucide-react";
import { RoomService } from "@/services/roomService";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Room = Database['public']['Tables']['rooms']['Row'];

// Default images for rooms without images
const defaultImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop"
];

// Room categories based on bedrooms
const roomCategories = [
  { id: "all", label: "All Rooms", icon: "🏠" },
  { id: "studio", label: "Studio", icon: "🏢", bedrooms: 0 },
  { id: "1-bedroom", label: "1 Bedroom", icon: "🛏️", bedrooms: 1 },
  { id: "2-bedroom", label: "2 Bedrooms", icon: "🛏️🛏️", bedrooms: 2 },
  { id: "3-bedroom", label: "3+ Bedrooms", icon: "🛏️🛏️🛏️", bedrooms: 3 },
];

// Sorting options
const sortOptions = [
  { id: "newest", label: "Newest First", icon: SortDesc },
  { id: "oldest", label: "Oldest First", icon: SortAsc },
  { id: "price-low", label: "Price: Low to High", icon: SortAsc },
  { id: "price-high", label: "Price: High to Low", icon: SortDesc },
  { id: "bedrooms", label: "Bedrooms", icon: SortDesc },
];

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showPrices, setShowPrices] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch rooms from database
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const { data, error } = await RoomService.getRooms();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load rooms. Please try again later.",
          variant: "destructive",
        });
        console.error("Error fetching rooms:", error);
      } else {
        setRooms(data || []);
        setFilteredRooms(data || []);
      }
      setLoading(false);
    };

    fetchRooms();
  }, [toast]);

  // Filter and sort rooms
  useEffect(() => {
    let filtered = [...rooms];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(room =>
        room.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (room.description && room.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      const category = roomCategories.find(cat => cat.id === selectedCategory);
      if (category && category.bedrooms !== undefined) {
        if (category.bedrooms === 0) {
          // Studio (0 bedrooms)
          filtered = filtered.filter(room => room.bedrooms === 0);
        } else if (category.bedrooms === 3) {
          // 3+ bedrooms
          filtered = filtered.filter(room => room.bedrooms >= 3);
        } else {
          // Exact bedroom count
          filtered = filtered.filter(room => room.bedrooms === category.bedrooms);
        }
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "bedrooms":
          return b.bedrooms - a.bedrooms;
        default:
          return 0;
      }
    });

    setFilteredRooms(filtered);
  }, [searchTerm, selectedCategory, sortBy, rooms]);

  const handleBookNow = (roomId: string) => {
    if (user) {
      navigate("/contact");
    } else {
      navigate("/auth");
    }
  };

  const togglePriceVisibility = (roomId: string) => {
    setShowPrices(prev => ({
      ...prev,
      [roomId]: !prev[roomId]
    }));
  };

  const getRoomImages = (room: Room) => {
    return room.images && room.images.length > 0 ? room.images : defaultImages;
  };

  const getCategoryStats = () => {
    const stats = roomCategories.map(category => {
      if (category.id === "all") {
        return { ...category, count: rooms.length };
      }
      
      let count = 0;
      if (category.bedrooms === 0) {
        count = rooms.filter(room => room.bedrooms === 0).length;
      } else if (category.bedrooms === 3) {
        count = rooms.filter(room => room.bedrooms >= 3).length;
      } else {
        count = rooms.filter(room => room.bedrooms === category.bedrooms).length;
      }
      
      return { ...category, count };
    });
    
    return stats;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-lavender/5 via-background to-brand-light-blue/5 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-brand-light-blue" />
            <span className="text-lg text-muted-foreground">Loading rooms...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryStats = getCategoryStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-lavender/5 via-background to-brand-light-blue/5 flex flex-col">
      <Navigation />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Find Your Perfect Room in Kathmandu Valley
          </h1>
          
          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4 max-w-md">
              <Input
                placeholder="Search by location, room type, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-white/80 backdrop-blur-sm border-brand-light-gray/50"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categoryStats.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 ${
                    selectedCategory === category.id 
                      ? "bg-brand-light-blue hover:bg-brand-light-blue/90" 
                      : "bg-white/80 backdrop-blur-sm border-brand-light-gray/50 hover:bg-brand-lavender/20"
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Sort and Clear Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-brand-light-gray/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.id} value={option.id}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {(searchTerm || selectedCategory !== "all" || sortBy !== "newest") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="bg-white/80 backdrop-blur-sm border-brand-light-gray/50"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Results Summary */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredRooms.length} of {rooms.length} rooms
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedCategory !== "all" && ` in ${roomCategories.find(cat => cat.id === selectedCategory)?.label}`}
            </div>
          </div>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">
              {searchTerm || selectedCategory !== "all" 
                ? "No rooms found matching your filters." 
                : "No rooms available at the moment."
              }
            </div>
            {(searchTerm || selectedCategory !== "all") && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="bg-brand-light-blue hover:bg-brand-light-blue/90 text-white"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-brand-light-gray/50">
                <div className="aspect-video overflow-hidden">
                  <Carousel className="w-full h-full">
                    <CarouselContent>
                      {getRoomImages(room).map((image, index) => (
                        <CarouselItem key={index}>
                          <img
                            src={image}
                            alt={`${room.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
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
                  {/* Category Badge */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {room.bedrooms === 0 ? "Studio" : `${room.bedrooms} Bedroom${room.bedrooms > 1 ? 's' : ''}`}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {user ? (
                        // For logged-in users: show price only if explicitly requested
                        <>
                          <div className="text-2xl font-bold text-brand-light-blue">
                            {showPrices[room.id] ? `Rs. ${room.price.toLocaleString()}/month` : "Rs. XXXX/month"}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePriceVisibility(room.id)}
                            className="p-1 h-8 w-8 hover:bg-brand-lavender/20"
                            title={showPrices[room.id] ? "Hide price" : "Show price"}
                          >
                            {showPrices[room.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </Button>
                        </>
                      ) : (
                        // For non-logged-in users: always hide price
                        <div className="text-2xl font-bold text-brand-light-blue">
                          Rs. XXXX/month
                        </div>
                      )}
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
                  
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center text-xs bg-brand-lavender/20 text-brand-lavender px-2 py-1 rounded">
                          {amenity === "WiFi" && <Wifi size={12} className="mr-1" />}
                          {amenity === "Parking" && <Car size={12} className="mr-1" />}
                          {amenity}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 border-brand-light-gray/50 bg-white/80 backdrop-blur-sm text-sm sm:text-base">
                          <Eye size={16} className="mr-2 flex-shrink-0" />
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">Details</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-4 bg-white/95 backdrop-blur-xl border-brand-light-gray/50 max-h-[90vh] overflow-y-auto sm:mx-auto">
                        <DialogHeader className="pb-4">
                          <DialogTitle className="text-lg sm:text-xl md:text-2xl pr-8">{room.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="aspect-video overflow-hidden rounded-md">
                            <Carousel className="w-full h-full">
                              <CarouselContent>
                                {getRoomImages(room).map((image, index) => (
                                  <CarouselItem key={index}>
                                    <img
                                      src={image}
                                      alt={`${room.title} - Image ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              <CarouselPrevious className="left-2 h-8 w-8 sm:h-10 sm:w-10" />
                              <CarouselNext className="right-2 h-8 w-8 sm:h-10 sm:w-10" />
                            </Carousel>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-semibold mb-2 text-sm sm:text-base">Location</h3>
                              <div className="flex items-center text-muted-foreground text-sm sm:text-base">
                                <MapPin size={16} className="mr-2 flex-shrink-0" />
                                {room.location}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-semibold mb-2 text-sm sm:text-base">Price</h3>
                              <div className="flex items-center space-x-2">
                                {user ? (
                                  // For logged-in users: show price only if explicitly requested
                                  <>
                                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-brand-light-blue">
                                      {showPrices[room.id] ? `Rs. ${room.price.toLocaleString()}/month` : "Rs. XXXX/month"}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => togglePriceVisibility(room.id)}
                                      className="p-1 h-8 w-8 hover:bg-brand-lavender/20"
                                      title={showPrices[room.id] ? "Hide price" : "Show price"}
                                    >
                                      {showPrices[room.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </Button>
                                  </>
                                ) : (
                                  // For non-logged-in users: always hide price
                                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-brand-light-blue">
                                    Rs. XXXX/month
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-semibold mb-2 text-sm sm:text-base">Room Details</h3>
                              <div className="flex gap-4 text-muted-foreground text-sm sm:text-base">
                                <div className="flex items-center">
                                  <Bed size={16} className="mr-1 flex-shrink-0" />
                                  {room.bedrooms} bedroom{room.bedrooms > 1 ? 's' : ''}
                                </div>
                                <div className="flex items-center">
                                  <Bath size={16} className="mr-1 flex-shrink-0" />
                                  {room.bathrooms} bathroom{room.bathrooms > 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-semibold mb-2 text-sm sm:text-base">Availability</h3>
                              <Badge variant={room.available ? "default" : "secondary"}>
                                {room.available ? "Available" : "Booked"}
                              </Badge>
                            </div>
                          </div>
                          
                          {room.description && (
                            <div>
                              <h3 className="font-semibold mb-2 text-sm sm:text-base">Description</h3>
                              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                {room.description}
                              </p>
                            </div>
                          )}
                          
                          {room.amenities && room.amenities.length > 0 && (
                            <div>
                              <h3 className="font-semibold mb-2 text-sm sm:text-base">Amenities</h3>
                              <div className="flex flex-wrap gap-2">
                                {room.amenities.map((amenity, index) => (
                                  <div key={index} className="flex items-center text-xs bg-brand-lavender/20 text-brand-lavender px-3 py-1 rounded-full">
                                    {amenity === "WiFi" && <Wifi size={12} className="mr-1 flex-shrink-0" />}
                                    {amenity === "Parking" && <Car size={12} className="mr-1 flex-shrink-0" />}
                                    {amenity}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex gap-2 pt-4">
                            <Button 
                              className="flex-1 bg-brand-light-blue hover:bg-brand-light-blue/90 shadow-lg shadow-brand-light-blue/25 text-sm sm:text-base" 
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
                      className="flex-1 bg-brand-light-blue hover:bg-brand-light-blue/90 shadow-lg shadow-brand-light-blue/25" 
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
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Rooms;