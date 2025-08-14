import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useClerkAuth";
import { useToast } from "@/hooks/use-toast";
import { PropertyVerificationService } from "@/services/propertyVerificationService";
import { RoomService } from "@/services/roomService";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Eye,
  Loader2,
  TrendingUp,
  MapPin,
  DollarSign
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type ToVerify = Database['public']['Tables']['toverify']['Row'];
type Room = Database['public']['Tables']['rooms']['Row'];

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [userProperties, setUserProperties] = useState<ToVerify[]>([]);
  const [approvedRooms, setApprovedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // Fetch user's submitted properties
        const { data: propertiesData, error: propertiesError } = await PropertyVerificationService.getUserProperties(user.id);
        if (propertiesError) {
          toast({
            title: "Error",
            description: "Failed to load your properties. Please try again later.",
            variant: "destructive",
          });
        } else {
          setUserProperties(propertiesData || []);
        }

        // Fetch user's approved rooms
        const { data: roomsData, error: roomsError } = await RoomService.getRoomsByOwner(user.id);
        if (roomsError) {
          toast({
            title: "Error",
            description: "Failed to load your approved rooms. Please try again later.",
            variant: "destructive",
          });
        } else {
          setApprovedRooms(roomsData || []);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-600"><CheckCircle className="h-3 w-3" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusCount = (status: string) => {
    return userProperties.filter(p => p.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Navigation />
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-brand-light-blue" />
            <span className="text-lg text-muted-foreground">Loading your dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-lavender/5 via-background to-brand-light-blue/5 pb-16 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            My Dashboard
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Track your property submissions and manage your listings on KTM Rentals.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">Pending</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{getStatusCount('pending')}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">Approved</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{getStatusCount('approved')}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-muted-foreground">Rejected</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{getStatusCount('rejected')}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-muted-foreground">Active Listings</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{approvedRooms.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={() => navigate("/post-property")}
            className="bg-brand-light-blue hover:bg-brand-light-blue/90 text-lg px-8 py-3"
          >
            <Plus className="h-5 w-5 mr-2" />
            Submit New Property
          </Button>
        </div>

        {/* Property Submissions */}
        <Card className="bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-brand-light-blue" />
              <span>My Property Submissions</span>
            </CardTitle>
            <CardDescription>
              Track the status of your submitted properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userProperties.length === 0 ? (
              <div className="text-center py-12">
                <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">You haven't submitted any properties yet.</p>
                <Button 
                  onClick={() => navigate("/post-property")}
                  className="bg-brand-light-blue hover:bg-brand-light-blue/90"
                >
                  Submit Your First Property
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {property.location}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        Rs. {property.price.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(property.status)}</TableCell>
                      <TableCell>{new Date(property.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Approved Rooms */}
        {approvedRooms.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>My Active Listings</span>
              </CardTitle>
              <CardDescription>
                Your approved properties that are currently visible to tenants
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.title}</TableCell>
                      <TableCell>{room.location}</TableCell>
                      <TableCell>Rs. {room.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={room.available ? "default" : "secondary"}>
                          {room.available ? "Available" : "Booked"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
