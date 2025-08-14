import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useClerkAuth";
import { useToast } from "@/hooks/use-toast";
import { PropertyVerificationService } from "@/services/propertyVerificationService";
import { 
  Home, 
  Upload, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  TreePine, 
  ChefHat, 
  Snowflake, 
  Flame, 
  Shield, 
  CheckCircle,
  Loader2,
  Clock,
  X
} from "lucide-react";

const PostProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "1",
    bathrooms: "1",
    contact_phone: "",
    contact_email: "",
    amenities: [] as string[],
    propertyType: "room"
  });

  const availableAmenities = [
    { id: "WiFi", label: "WiFi", icon: Wifi },
    { id: "Parking", label: "Parking", icon: Car },
    { id: "Garden", label: "Garden", icon: TreePine },
    { id: "Kitchen", label: "Kitchen", icon: ChefHat },
    { id: "AC", label: "Air Conditioning", icon: Snowflake },
    { id: "Heating", label: "Heating", icon: Flame },
    { id: "Security", label: "Security", icon: Shield }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenityId]
        : prev.amenities.filter(id => id !== amenityId)
    }));
  };

  // Handle image selection
  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const totalImages = selectedImages.length + newFiles.length;

    if (totalImages > 10) {
      toast({
        title: "Too Many Images",
        description: "You can only upload up to 10 images per property.",
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
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleImageSelect(e.dataTransfer.files);
  };

  // Remove image
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Upload images to Supabase storage (simulated for now)
  const uploadImages = async (): Promise<string[]> => {
    if (selectedImages.length === 0) return [];

    const uploadedUrls: string[] = [];

    try {
      // For now, we'll simulate image upload
      // In a real implementation, you would upload to Supabase Storage
      for (let i = 0; i < selectedImages.length; i++) {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
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
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to post your property.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images first
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        try {
          imageUrls = await uploadImages();
        } catch (error) {
          return; // Stop if image upload fails
        }
      }

      const propertyData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        amenities: formData.amenities.length > 0 ? formData.amenities : undefined,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        contact_phone: formData.contact_phone || undefined,
        contact_email: formData.contact_email || undefined,
      };

      const { data, error } = await PropertyVerificationService.submitProperty(propertyData, user.id);
      
      if (error) {
        toast({
          title: "Error",
          description: `Failed to post property: ${error}`,
          variant: "destructive",
        });
      } else {
        setIsSubmitted(true);
        toast({
          title: "Property Submitted for Review!",
          description: "Your property has been submitted and is pending admin approval.",
        });

        // Reset form
        setFormData({
          title: "",
          description: "",
          location: "",
          price: "",
          bedrooms: "1",
          bathrooms: "1",
          contact_phone: "",
          contact_email: "",
          amenities: [],
          propertyType: "room"
        });

        // Reset images
        setSelectedImages([]);
        setImagePreviewUrls([]);

        // Reset submitted state after 3 seconds
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-lavender/5 via-background to-brand-light-blue/5 flex flex-col">
      <Navigation />
      
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Post Your Property
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            List your room or property on KTM Rentals and connect with potential tenants in Kathmandu Valley.
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-brand-light-gray/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="h-5 w-5 text-brand-light-blue" />
              <span>Property Details</span>
            </CardTitle>
            <CardDescription>
              Fill out the form below to list your property. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Property Submitted for Review!</h3>
                <p className="text-muted-foreground mb-6">
                  Your property has been submitted and is now under admin review. You'll be notified once it's approved.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => navigate("/dashboard")}
                    className="bg-brand-light-blue hover:bg-brand-light-blue/90"
                  >
                    View My Dashboard
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Post Another Property
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Property Type */}
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select 
                    value={formData.propertyType} 
                    onValueChange={(value) => handleSelectChange("propertyType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room">Single Room</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Title and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Cozy Room in Thamel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Thamel, Kathmandu"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your property, neighborhood, and any special features..."
                    rows={4}
                  />
                </div>

                {/* Price and Rooms */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Monthly Rent (Rs.) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        placeholder="15000"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <div className="relative">
                      <Bed className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Select 
                        value={formData.bedrooms} 
                        onValueChange={(value) => handleSelectChange("bedrooms", value)}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                    <div className="relative">
                      <Bath className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Select 
                        value={formData.bathrooms} 
                        onValueChange={(value) => handleSelectChange("bathrooms", value)}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-3">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableAmenities.map((amenity) => {
                      const Icon = amenity.icon;
                      return (
                        <div key={amenity.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity.id}
                            checked={formData.amenities.includes(amenity.id)}
                            onCheckedChange={(checked) => 
                              handleAmenityChange(amenity.id, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={amenity.id} 
                            className="flex items-center space-x-2 text-sm cursor-pointer"
                          >
                            <Icon className="h-4 w-4" />
                            <span>{amenity.label}</span>
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                  {formData.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">Phone Number</Label>
                      <Input
                        id="contact_phone"
                        name="contact_phone"
                        type="tel"
                        value={formData.contact_phone}
                        onChange={handleInputChange}
                        placeholder="+977 98XXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Email</Label>
                      <Input
                        id="contact_email"
                        name="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={handleInputChange}
                        placeholder="contact@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Property Images (Max 10)</h3>
                  <div 
                    className="border-2 border-dashed border-brand-light-gray/50 rounded-lg p-6 text-center cursor-pointer hover:border-brand-light-blue/50 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("image-upload-input")?.click()}
                  >
                    <input
                      type="file"
                      id="image-upload-input"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e.target.files)}
                      className="hidden"
                    />
                    <Upload className="h-10 w-10 text-brand-light-blue mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Drag and drop images here, or click to select files.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: JPG, PNG, GIF (max 5MB each)
                    </p>
                  </div>
                  {imagePreviewUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden">
                          <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            title="Remove image"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-brand-light-blue hover:bg-brand-light-blue/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Posting Property...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Post Property
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate("/rooms")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default PostProperty;
