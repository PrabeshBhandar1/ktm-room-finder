import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useClerkAuth";
import { Plus, Edit, Trash2, Shield, Loader2, Upload, X, Image as ImageIcon, CheckCircle, XCircle, Clock } from "lucide-react";
import { RoomService } from "@/services/roomService";
import { PropertyVerificationService } from "@/services/propertyVerificationService";
import type { Database } from "@/integrations/supabase/types";

type Room = Database['public']['Tables']['rooms']['Row'];
type ToVerify = Database['public']['Tables']['toverify']['Row'];

// Default amenities options
const defaultAmenities = ["WiFi", "Parking", "Garden", "Kitchen", "AC", "Heating", "Balcony", "Security"];

const Admin = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pendingProperties, setPendingProperties] = useState<ToVerify[]>([]);
  const [loading, setLoading] = useState(true);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [newRoom, setNewRoom] = useState({
    title: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    amenities: "",
    contact_phone: "",
    contact_email: ""
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch rooms and pending properties on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      // Fetch rooms
      const { data: roomsData, error: roomsError } = await RoomService.getRoomsByOwner(user.id);
      if (roomsError) {
        toast({
          title: "Error",
          description: "Failed to load rooms. Please try again later.",
          variant: "destructive",
        });
        console.error("Error fetching rooms:", roomsError);
      } else {
        setRooms(roomsData || []);
      }

      // Fetch pending properties only if user is admin
      if (isAdmin) {
        const { data: pendingData, error: pendingError } = await PropertyVerificationService.getPendingProperties();
        if (pendingError) {
          toast({
            title: "Error",
            description: "Failed to load pending properties. Please try again later.",
            variant: "destructive",
          });
          console.error("Error fetching pending properties:", pendingError);
        } else {
          setPendingProperties(pendingData || []);
        }
      }
      
      setLoading(false);
    };

    fetchData();
  }, [user, isAdmin, toast]);

  // Handle image selection
  const handleImageSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const totalImages = selectedImages.length + newFiles.length;

    if (totalImages > 10) {
      toast({
        title: "Too Many Images",
        description: "You can only upload up to 10 images per room.",
        variant: "destructive",
      });
      return;
    }

    // Validate file types
    const validFiles = newFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [selectedImages, toast]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleImageSelect(e.dataTransfer.files);
  }, [handleImageSelect]);

  // Remove image
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Upload images to Supabase storage
  const uploadImages = async (): Promise<string[]> => {
    if (selectedImages.length === 0) return [];

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      // For now, we'll simulate image upload
      // In a real implementation, you would upload to Supabase Storage
      for (let i = 0; i < selectedImages.length; i++) {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For demo purposes, we'll use placeholder URLs
        // In production, you would upload to Supabase Storage and get real URLs
        const fakeUrl = `https://picsum.photos/800/600?random=${Date.now() + i}`;
        uploadedUrls.push(fakeUrl);
      }

      toast({
        title: "Images Uploaded",
        description: `${selectedImages.length} images uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploadingImages(false);
    }

    return uploadedUrls;
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a room.",
        variant: "destructive",
      });
      return;
    }

    // Upload images first
    let imageUrls: string[] = [];
    if (selectedImages.length > 0) {
      try {
        imageUrls = await uploadImages();
      } catch (error) {
        return; // Stop if image upload fails
      }
    }

    // Parse amenities
    const amenitiesArray = newRoom.amenities
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const roomData = {
      title: newRoom.title,
      location: newRoom.location,
      price: parseFloat(newRoom.price),
      bedrooms: parseInt(newRoom.bedrooms),
      bathrooms: parseInt(newRoom.bathrooms),
      description: newRoom.description || undefined,
      amenities: amenitiesArray.length > 0 ? amenitiesArray : undefined,
      contact_phone: newRoom.contact_phone || undefined,
      contact_email: newRoom.contact_email || undefined,
      images: imageUrls.length > 0 ? imageUrls : undefined,
    };

    const { data, error } = await RoomService.createRoom(roomData, user.id);
    
    if (error) {
      toast({
        title: "Error",
        description: `Failed to add room: ${error}`,
        variant: "destructive",
      });
    } else {
      setRooms([...(data ? [data] : []), ...rooms]);
      setNewRoom({
        title: "",
        location: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        description: "",
        amenities: "",
        contact_phone: "",
        contact_email: ""
      });
      setSelectedImages([]);
      setImagePreviewUrls([]);
      
      toast({
        title: "Room Added",
        description: "New room has been added successfully",
      });
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    const { success, error } = await RoomService.deleteRoom(roomId);
    
    if (error) {
      toast({
        title: "Error",
        description: `Failed to delete room: ${error}`,
        variant: "destructive",
      });
    } else {
      setRooms(rooms.filter(room => room.id !== roomId));
      toast({
        title: "Room Deleted",
        description: "Room has been removed successfully",
      });
    }
  };

  const handleToggleAvailability = async (room: Room) => {
    const { data, error } = await RoomService.updateRoom(room.id, {
      available: !room.available
    });
    
    if (error) {
      toast({
        title: "Error",
        description: `Failed to update room: ${error}`,
        variant: "destructive",
      });
    } else {
      setRooms(rooms.map(r => r.id === room.id ? { ...r, available: !r.available } : r));
      toast({
        title: "Room Updated",
        description: `Room is now ${!room.available ? 'available' : 'unavailable'}`,
      });
    }
  };

  // Handle property approval/rejection
  const handlePropertyAction = async (propertyId: string, action: 'approve' | 'reject') => {
    if (!isAdmin) {
      toast({
        title: "Unauthorized",
        description: "Only admins can approve or reject properties.",
        variant: "destructive",
      });
      return;
    }

    setVerificationLoading(true);
    
    try {
      const status = action === 'approve' ? 'approved' : 'rejected';
      const { success, error } = await PropertyVerificationService.updatePropertyStatus(propertyId, status);
      
      if (error) {
        toast({
          title: "Error",
          description: `Failed to ${action} property: ${error}`,
          variant: "destructive",
        });
      } else {
        // Remove the property from the pending list
        setPendingProperties(prev => prev.filter(p => p.id !== propertyId));
        
        toast({
          title: `Property ${action === 'approve' ? 'Approved' : 'Rejected'}`,
          description: `Property has been ${action === 'approve' ? 'approved and moved to rooms' : 'rejected'}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `An unexpected error occurred while ${action}ing the property.`,
        variant: "destructive",
      });
    } finally {
      setVerificationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Navigation />
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-brand-light-blue" />
            <span className="text-lg text-muted-foreground">Loading rooms...</span>
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
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome, {user?.firstName} {user?.lastName}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={signOut}
          >
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue={isAdmin ? "verification" : "rooms"} className="space-y-6">
          <TabsList>
            {isAdmin && (
              <TabsTrigger value="verification">Property Verification</TabsTrigger>
            )}
            <TabsTrigger value="rooms">Manage Rooms</TabsTrigger>
            <TabsTrigger value="add-room">Add New Room</TabsTrigger>
          </TabsList>

          {isAdmin && (
            <TabsContent value="verification">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Property Verification</span>
                  </CardTitle>
                  <CardDescription>
                    Review and approve/reject property submissions from users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {verificationLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-brand-light-blue" />
                      <span className="ml-2">Processing...</span>
                    </div>
                  ) : pendingProperties.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">No properties pending verification.</p>
                      <p className="text-sm text-muted-foreground">All submitted properties have been reviewed.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingProperties.map((property) => (
                          <TableRow key={property.id}>
                            <TableCell className="font-medium">{property.title}</TableCell>
                            <TableCell>{property.location}</TableCell>
                            <TableCell>Rs. {property.price.toLocaleString()}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {property.owner_id}
                            </TableCell>
                            <TableCell>{new Date(property.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => handlePropertyAction(property.id, 'approve')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handlePropertyAction(property.id, 'reject')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="rooms">
            <Card>
              <CardHeader>
                <CardTitle>Room Management</CardTitle>
                <CardDescription>
                  View and manage all your listed rooms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rooms.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No rooms found. Add your first room to get started!</p>
                    <Button onClick={() => document.querySelector('[data-value="add-room"]')?.click()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Room
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
                            <Badge 
                              variant={room.available ? "default" : "secondary"}
                              className="cursor-pointer"
                              onClick={() => handleToggleAvailability(room)}
                            >
                              {room.available ? "Available" : "Booked"}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(room.created_at).toLocaleDateString()}</TableCell>
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
                )}
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
                <form onSubmit={handleAddRoom} className="space-y-6">
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
                    <p className="text-xs text-muted-foreground">
                      Available options: {defaultAmenities.join(', ')}
                    </p>
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <Label>Room Images (Up to 10 images)</Label>
                    
                    {/* Drag & Drop Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        selectedImages.length >= 10 
                          ? 'border-gray-300 bg-gray-50' 
                          : 'border-brand-light-blue/50 hover:border-brand-light-blue bg-brand-light-blue/5'
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop images here, or click to select
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        {selectedImages.length}/10 images selected
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageSelect(e.target.files)}
                        className="hidden"
                        id="image-upload"
                        disabled={selectedImages.length >= 10}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
                          selectedImages.length >= 10
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-brand-light-blue text-white hover:bg-brand-light-blue/90'
                        }`}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Select Images
                      </label>
                    </div>

                    {/* Image Previews */}
                    {imagePreviewUrls.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">Contact Phone</Label>
                      <Input
                        id="contact_phone"
                        type="tel"
                        placeholder="+977 98XXXXXXXX"
                        value={newRoom.contact_phone}
                        onChange={(e) => setNewRoom({...newRoom, contact_phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Contact Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        placeholder="contact@example.com"
                        value={newRoom.contact_email}
                        onChange={(e) => setNewRoom({...newRoom, contact_email: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={uploadingImages}
                  >
                    {uploadingImages ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Uploading Images...
                      </>
                    ) : (
                      'Add Room'
                    )}
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