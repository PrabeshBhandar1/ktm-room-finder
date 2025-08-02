import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, Shield } from "lucide-react";

// Mock room data for admin management
const mockRooms = [
  {
    id: 1,
    title: "Cozy Room in Thamel",
    location: "Thamel, Kathmandu",
    price: 15000,
    bedrooms: 1,
    bathrooms: 1,
    available: true,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    title: "Modern Apartment in Patan",
    location: "Patan, Lalitpur",
    price: 25000,
    bedrooms: 2,
    bathrooms: 2,
    available: true,
    createdAt: "2024-01-20"
  }
];

const Admin = () => {
  // Mock admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [rooms, setRooms] = useState(mockRooms);
  const [newRoom, setNewRoom] = useState({
    title: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    amenities: ""
  });
  const { toast } = useToast();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement admin authentication with Supabase
    if (adminEmail === "admin@ktmrental.com" && adminPassword === "admin123") {
      setIsAdminAuthenticated(true);
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid admin credentials",
        variant: "destructive"
      });
    }
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement room creation with Supabase
    const room = {
      id: rooms.length + 1,
      title: newRoom.title,
      location: newRoom.location,
      price: parseInt(newRoom.price),
      bedrooms: parseInt(newRoom.bedrooms),
      bathrooms: parseInt(newRoom.bathrooms),
      available: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setRooms([...rooms, room]);
    setNewRoom({
      title: "",
      location: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      description: "",
      amenities: ""
    });
    
    toast({
      title: "Room Added",
      description: "New room has been added successfully",
    });
  };

  const handleDeleteRoom = (roomId: number) => {
    // TODO: Implement room deletion with Supabase
    setRooms(rooms.filter(room => room.id !== roomId));
    toast({
      title: "Room Deleted",
      description: "Room has been removed successfully",
    });
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Navigation />
        
        <div className="flex items-center justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>
                  Enter admin credentials to access the dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@ktmrental.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter admin password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login as Admin
                  </Button>
                </form>
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Demo credentials: admin@ktmrental.com / admin123
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={() => setIsAdminAuthenticated(false)}
          >
            Logout
          </Button>
        </div>

        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rooms">Manage Rooms</TabsTrigger>
            <TabsTrigger value="add-room">Add New Room</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms">
            <Card>
              <CardHeader>
                <CardTitle>Room Management</CardTitle>
                <CardDescription>
                  View and manage all available rooms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.title}</TableCell>
                        <TableCell>{room.location}</TableCell>
                        <TableCell>Rs. {room.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={room.available ? "default" : "secondary"}>
                            {room.available ? "Available" : "Booked"}
                          </Badge>
                        </TableCell>
                        <TableCell>{room.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteRoom(room.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-room">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add New Room</span>
                </CardTitle>
                <CardDescription>
                  Create a new room listing for the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddRoom} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Room Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Cozy Room in Thamel"
                        value={newRoom.title}
                        onChange={(e) => setNewRoom({...newRoom, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Thamel, Kathmandu"
                        value={newRoom.location}
                        onChange={(e) => setNewRoom({...newRoom, location: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Monthly Rent (Rs.)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="15000"
                        value={newRoom.price}
                        onChange={(e) => setNewRoom({...newRoom, price: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        placeholder="1"
                        value={newRoom.bedrooms}
                        onChange={(e) => setNewRoom({...newRoom, bedrooms: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        placeholder="1"
                        value={newRoom.bathrooms}
                        onChange={(e) => setNewRoom({...newRoom, bathrooms: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the room, neighborhood, and any special features..."
                      value={newRoom.description}
                      onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amenities">Amenities</Label>
                    <Input
                      id="amenities"
                      placeholder="WiFi, Parking, Garden (comma separated)"
                      value={newRoom.amenities}
                      onChange={(e) => setNewRoom({...newRoom, amenities: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Add Room
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;