
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, MapPin, Upload, X } from 'lucide-react';
import { useRoutes, useCreateRoute, useUpdateRoute, useDeleteRoute, Route } from '@/hooks/useRoutes';

// Define ImageUploadSection as a separate component outside the main component
const ImageUploadSection = ({ 
  imagePreview, 
  onImageSelect, 
  onRemoveImage 
}: {
  imagePreview: string;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}) => (
  <div>
    <Label htmlFor="profile_image">Route Image</Label>
    <div className="mt-2">
      {imagePreview ? (
        <div className="relative inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-32 h-24 object-cover rounded-lg border-2 border-golden-accent/30"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 border-red-300 text-red-600 hover:bg-red-50"
            onClick={onRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-golden-accent/30 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto mb-2 text-golden-dark/50" />
          <Label
            htmlFor="image-upload"
            className="cursor-pointer text-golden-dark hover:text-golden-primary"
          >
            Click to upload image
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageSelect}
          />
        </div>
      )}
    </div>
  </div>
);

// Define RouteForm as a separate component outside the main component
const RouteForm = ({ 
  formData, 
  onInputChange, 
  onSubmit, 
  submitText, 
  imagePreview, 
  onImageSelect, 
  onRemoveImage 
}: {
  formData: {
    from_destination: string;
    to_destination: string;
    price: string;
    trip_type: 'one-way' | 'round-trip' | 'airport';
    distance_km: string;
    profile_image: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
  imagePreview: string;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="from_destination">From Destination</Label>
        <Input
          id="from_destination"
          value={formData.from_destination}
          onChange={(e) => onInputChange('from_destination', e.target.value)}
          placeholder="e.g., Chennai"
          required
        />
      </div>
      <div>
        <Label htmlFor="to_destination">To Destination</Label>
        <Input
          id="to_destination"
          value={formData.to_destination}
          onChange={(e) => onInputChange('to_destination', e.target.value)}
          placeholder="e.g., Bangalore"
          required
        />
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="price">Price (₹)</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => onInputChange('price', e.target.value)}
          placeholder="5000"
          required
        />
      </div>
      <div>
        <Label htmlFor="trip_type">Trip Type</Label>
        <Select value={formData.trip_type} onValueChange={(value: 'one-way' | 'round-trip' | 'airport') => onInputChange('trip_type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one-way">One Way</SelectItem>
            <SelectItem value="round-trip">Round Trip</SelectItem>
            <SelectItem value="airport">Airport Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    
    <div>
      <Label htmlFor="distance_km">Distance (KM) - Optional</Label>
      <Input
        id="distance_km"
        type="number"
        value={formData.distance_km}
        onChange={(e) => onInputChange('distance_km', e.target.value)}
        placeholder="350"
      />
    </div>
    
    <ImageUploadSection 
      imagePreview={imagePreview}
      onImageSelect={onImageSelect}
      onRemoveImage={onRemoveImage}
    />
    
    <Button type="submit" className="w-full bg-golden-primary hover:bg-golden-primary/80 text-golden-dark">
      {submitText}
    </Button>
  </form>
);

const RoutesManager = () => {
  const { data: routes = [], isLoading } = useRoutes();
  const createRoute = useCreateRoute();
  const updateRoute = useUpdateRoute();
  const deleteRoute = useDeleteRoute();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    from_destination: '',
    to_destination: '',
    price: '',
    trip_type: 'one-way' as 'one-way' | 'round-trip' | 'airport',
    distance_km: '',
    profile_image: ''
  });

  const resetForm = useCallback(() => {
    setFormData({
      from_destination: '',
      to_destination: '',
      price: '',
      trip_type: 'one-way',
      distance_km: '',
      profile_image: ''
    });
    setSelectedImage(null);
    setImagePreview('');
  }, []);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, profile_image: result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, profile_image: '' }));
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleCreate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.from_destination || !formData.to_destination || !formData.price) return;

    try {
      await createRoute.mutateAsync({
        from_destination: formData.from_destination,
        to_destination: formData.to_destination,
        price: parseFloat(formData.price),
        trip_type: formData.trip_type,
        distance_km: formData.distance_km ? parseFloat(formData.distance_km) : undefined,
        profile_image: formData.profile_image || undefined,
      });

      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating route:', error);
    }
  }, [formData, createRoute, resetForm]);

  const handleEdit = useCallback((route: Route) => {
    setEditingRoute(route);
    setFormData({
      from_destination: route.from_destination,
      to_destination: route.to_destination,
      price: route.price.toString(),
      trip_type: route.trip_type,
      distance_km: route.distance_km?.toString() || '',
      profile_image: route.profile_image || ''
    });
    if (route.profile_image) {
      setImagePreview(route.profile_image);
    }
    setIsEditDialogOpen(true);
  }, []);

  const handleUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoute || !formData.from_destination || !formData.to_destination || !formData.price) return;

    try {
      await updateRoute.mutateAsync({
        id: editingRoute.id,
        from_destination: formData.from_destination,
        to_destination: formData.to_destination,
        price: parseFloat(formData.price),
        trip_type: formData.trip_type,
        distance_km: formData.distance_km ? parseFloat(formData.distance_km) : undefined,
        profile_image: formData.profile_image || undefined,
      });

      resetForm();
      setIsEditDialogOpen(false);
      setEditingRoute(null);
    } catch (error) {
      console.error('Error updating route:', error);
    }
  }, [formData, editingRoute, updateRoute, resetForm]);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      await deleteRoute.mutateAsync(id);
    }
  }, [deleteRoute]);

  const handleDialogClose = useCallback((isOpen: boolean, isEdit: boolean = false) => {
    if (!isOpen) {
      resetForm();
      if (isEdit) {
        setEditingRoute(null);
      }
    }
    if (isEdit) {
      setIsEditDialogOpen(isOpen);
    } else {
      setIsCreateDialogOpen(isOpen);
    }
  }, [resetForm]);

  const getTripTypeDisplay = (tripType: string) => {
    switch (tripType) {
      case 'one-way':
        return 'One Way';
      case 'round-trip':
        return 'Round Trip';
      case 'airport':
        return 'Airport Transfer';
      default:
        return tripType;
    }
  };

  const getTripTypeBadgeColor = (tripType: string) => {
    switch (tripType) {
      case 'one-way':
        return 'bg-blue-100 text-blue-800';
      case 'round-trip':
        return 'bg-green-100 text-green-800';
      case 'airport':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-golden bg-warm-gradient border-golden-accent/40">
        <CardHeader className="border-b border-golden-accent/30">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-golden-dark">Routes Management</CardTitle>
              <CardDescription className="text-golden-dark/70">
                Manage popular routes displayed on the website
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={(isOpen) => handleDialogClose(isOpen, false)}>
              <DialogTrigger asChild>
                <Button className="bg-golden-primary hover:bg-golden-primary/80 text-golden-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Route
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Route</DialogTitle>
                  <DialogDescription>
                    Create a new popular route for customers to book
                  </DialogDescription>
                </DialogHeader>
                <RouteForm 
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSubmit={handleCreate} 
                  submitText="Create Route"
                  imagePreview={imagePreview}
                  onImageSelect={handleImageSelect}
                  onRemoveImage={removeImage}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center text-golden-dark">Loading routes...</div>
          ) : routes.length === 0 ? (
            <div className="p-6 text-center text-golden-dark">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-golden-primary" />
              <p>No routes created yet. Add your first route to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-golden-accent/30">
                    <TableHead className="text-golden-dark font-semibold">Image</TableHead>
                    <TableHead className="text-golden-dark font-semibold">Route</TableHead>
                    <TableHead className="text-golden-dark font-semibold">Price</TableHead>
                    <TableHead className="text-golden-dark font-semibold">Type</TableHead>
                    <TableHead className="text-golden-dark font-semibold">Distance</TableHead>
                    <TableHead className="text-golden-dark font-semibold">Rating</TableHead>
                    <TableHead className="text-golden-dark font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.map((route) => (
                    <TableRow key={route.id} className="border-golden-accent/30 hover:bg-golden-accent/10">
                      <TableCell>
                        {route.profile_image ? (
                          <img
                            src={route.profile_image}
                            alt={`${route.from_destination} to ${route.to_destination}`}
                            className="w-16 h-12 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-golden-accent/20 rounded flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-golden-dark/50" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-golden-dark">
                        <div className="font-medium">
                          {route.from_destination} → {route.to_destination}
                        </div>
                      </TableCell>
                      <TableCell className="text-golden-dark font-semibold">
                        ₹{route.price.toFixed(0)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getTripTypeBadgeColor(route.trip_type)}>
                          {getTripTypeDisplay(route.trip_type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-golden-dark">
                        {route.distance_km ? `${route.distance_km} KM` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-golden-dark">
                        {route.rating || 4.2}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(route)}
                            className="border-golden-accent text-golden-dark hover:bg-golden-accent/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(route.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => handleDialogClose(isOpen, true)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
            <DialogDescription>
              Update the route information
            </DialogDescription>
          </DialogHeader>
          <RouteForm 
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleUpdate} 
            submitText="Update Route"
            imagePreview={imagePreview}
            onImageSelect={handleImageSelect}
            onRemoveImage={removeImage}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoutesManager;
