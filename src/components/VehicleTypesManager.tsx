import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useVehicleCategories, useVehicleTypes, useCreateVehicleType, useUpdateVehicleType, useDeleteVehicleType, useCreateVehicleCategory } from '@/hooks/useVehicleTypes';

const VehicleTypesManager = () => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  
  const { data: categories = [] } = useVehicleCategories();
  const { data: vehicleTypes = [] } = useVehicleTypes();
  const createCategory = useCreateVehicleCategory();
  const createVehicle = useCreateVehicleType();
  const updateVehicle = useUpdateVehicleType();
  const deleteVehicle = useDeleteVehicleType();

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    base_multiplier: 1.0
  });

  const [vehicleForm, setVehicleForm] = useState({
    category_id: '',
    name: '',
    description: '',
    price_multiplier: 1.0,
    is_active: true,
    base_fare: 0.0,
    per_minute_rate: 0.0,
    drop_trip_rate_per_km: 14.0,
    round_trip_rate_per_km: 14.0
  });

  const handleCreateCategory = () => {
    createCategory.mutate(categoryForm, {
      onSuccess: () => {
        setCategoryForm({ name: '', base_multiplier: 1.0 });
        setIsAddingCategory(false);
      }
    });
  };

  const handleCreateVehicle = () => {
    createVehicle.mutate(vehicleForm, {
      onSuccess: () => {
        setVehicleForm({
          category_id: '',
          name: '',
          description: '',
          price_multiplier: 1.0,
          is_active: true,
          base_fare: 0.0,
          per_minute_rate: 0.0,
          drop_trip_rate_per_km: 14.0,
          round_trip_rate_per_km: 14.0
        });
        setIsAddingVehicle(false);
      }
    });
  };

  const handleUpdateVehicle = () => {
    if (editingVehicle) {
      updateVehicle.mutate({
        id: editingVehicle.id,
        ...vehicleForm
      }, {
        onSuccess: () => {
          setEditingVehicle(null);
          setVehicleForm({
            category_id: '',
            name: '',
            description: '',
            price_multiplier: 1.0,
            is_active: true,
            base_fare: 0.0,
            per_minute_rate: 0.0,
            drop_trip_rate_per_km: 14.0,
            round_trip_rate_per_km: 14.0
          });
        }
      });
    }
  };

  const handleEditVehicle = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setVehicleForm({
      category_id: vehicle.category_id,
      name: vehicle.name,
      description: vehicle.description || '',
      price_multiplier: vehicle.price_multiplier,
      is_active: vehicle.is_active,
      base_fare: vehicle.base_fare || 0.0,
      per_minute_rate: vehicle.per_minute_rate || 0.0,
      drop_trip_rate_per_km: vehicle.drop_trip_rate_per_km || 14.0,
      round_trip_rate_per_km: vehicle.round_trip_rate_per_km || 14.0
    });
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle type?')) {
      deleteVehicle.mutate(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-golden-dark">Car Types Management</h2>
          <p className="text-golden-dark/70 mt-2">Manage vehicle categories and types for your taxi service</p>
        </div>
      </div>

      {/* Categories Section */}
      <Card className="shadow-golden bg-warm-gradient border-golden-accent/40">
        <CardHeader className="border-b border-golden-accent/30">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-golden-dark">Vehicle Categories</CardTitle>
              <CardDescription className="text-golden-dark/70">Main vehicle categories (Sedan, SUV, etc.)</CardDescription>
            </div>
            <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
              <DialogTrigger asChild>
                <Button className="bg-golden-primary hover:bg-golden-primary/80 text-golden-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Vehicle Category</DialogTitle>
                  <DialogDescription>Create a new main category for vehicles</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input
                      id="category-name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="e.g., Luxury, Economy"
                    />
                  </div>
                  <div>
                    <Label htmlFor="base-multiplier">Base Price Multiplier</Label>
                    <Input
                      id="base-multiplier"
                      type="number"
                      step="0.1"
                      value={categoryForm.base_multiplier}
                      onChange={(e) => setCategoryForm({ ...categoryForm, base_multiplier: parseFloat(e.target.value) })}
                    />
                  </div>
                  <Button 
                    onClick={handleCreateCategory}
                    disabled={createCategory.isPending}
                    className="w-full bg-golden-primary hover:bg-golden-primary/80 text-golden-dark"
                  >
                    {createCategory.isPending ? 'Creating...' : 'Create Category'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="p-4 bg-golden-accent/20 rounded-lg border border-golden-accent/40">
                <h3 className="font-semibold text-golden-dark">{category.name}</h3>
                <p className="text-sm text-golden-dark/70">Multiplier: {category.base_multiplier}x</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Types Section */}
      <Card className="shadow-golden bg-warm-gradient border-golden-accent/40">
        <CardHeader className="border-b border-golden-accent/30">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-golden-dark">Vehicle Types</CardTitle>
              <CardDescription className="text-golden-dark/70">Specific vehicle models within each category</CardDescription>
            </div>
            <Dialog open={isAddingVehicle} onOpenChange={setIsAddingVehicle}>
              <DialogTrigger asChild>
                <Button className="bg-golden-primary hover:bg-golden-primary/80 text-golden-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle Type
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Vehicle Type</DialogTitle>
                  <DialogDescription>Add a specific vehicle model to a category</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pr-2">
                  <div>
                    <Label htmlFor="vehicle-category">Category</Label>
                    <Select value={vehicleForm.category_id} onValueChange={(value) => setVehicleForm({ ...vehicleForm, category_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="vehicle-name">Vehicle Name</Label>
                    <Input
                      id="vehicle-name"
                      value={vehicleForm.name}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                      placeholder="e.g., Swift Dzire, Innova Crysta"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicle-description">Description</Label>
                    <Input
                      id="vehicle-description"
                      value={vehicleForm.description}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, description: e.target.value })}
                      placeholder="Brief description of the vehicle"
                    />
                  </div>
                   <div>
                     <Label htmlFor="price-multiplier">Price Multiplier</Label>
                     <Input
                       id="price-multiplier"
                       type="number"
                       step="0.1"
                       value={vehicleForm.price_multiplier}
                       onChange={(e) => setVehicleForm({ ...vehicleForm, price_multiplier: parseFloat(e.target.value) })}
                     />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <Label htmlFor="base-fare">Base Fare (₹)</Label>
                       <Input
                         id="base-fare"
                         type="number"
                         step="0.01"
                         value={vehicleForm.base_fare}
                         onChange={(e) => setVehicleForm({ ...vehicleForm, base_fare: parseFloat(e.target.value) })}
                       />
                     </div>
                     <div>
                       <Label htmlFor="per-minute-rate">Per Minute (₹)</Label>
                       <Input
                         id="per-minute-rate"
                         type="number"
                         step="0.01"
                         value={vehicleForm.per_minute_rate}
                         onChange={(e) => setVehicleForm({ ...vehicleForm, per_minute_rate: parseFloat(e.target.value) })}
                       />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <Label htmlFor="drop-trip-rate">Drop Trip Rate (₹)</Label>
                       <Input
                         id="drop-trip-rate"
                         type="number"
                         step="0.01"
                         value={vehicleForm.drop_trip_rate_per_km}
                         onChange={(e) => setVehicleForm({ ...vehicleForm, drop_trip_rate_per_km: parseFloat(e.target.value) })}
                       />
                     </div>
                     <div>
                       <Label htmlFor="round-trip-rate">Round Trip Rate (₹)</Label>
                       <Input
                         id="round-trip-rate"
                         type="number"
                         step="0.01"
                         value={vehicleForm.round_trip_rate_per_km}
                         onChange={(e) => setVehicleForm({ ...vehicleForm, round_trip_rate_per_km: parseFloat(e.target.value) })}
                       />
                     </div>
                   </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is-active"
                      checked={vehicleForm.is_active}
                      onCheckedChange={(checked) => setVehicleForm({ ...vehicleForm, is_active: checked })}
                    />
                    <Label htmlFor="is-active">Active</Label>
                  </div>
                  <Button 
                    onClick={handleCreateVehicle}
                    disabled={createVehicle.isPending}
                    className="w-full bg-golden-primary hover:bg-golden-primary/80 text-golden-dark"
                  >
                    {createVehicle.isPending ? 'Creating...' : 'Create Vehicle Type'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryVehicles = vehicleTypes.filter(v => v.category_id === category.id);
              return (
                <div key={category.id} className="border border-golden-accent/40 rounded-lg p-4 bg-golden-accent/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Car className="h-5 w-5 text-golden-primary" />
                    <h3 className="font-semibold text-golden-dark">{category.name}</h3>
                    <Badge variant="outline" className="border-golden-accent text-golden-dark">
                      {categoryVehicles.length} vehicles
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoryVehicles.map((vehicle) => (
                      <div key={vehicle.id} className="p-3 bg-background rounded border border-golden-accent/30">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-golden-dark">{vehicle.name}</h4>
                            <p className="text-xs text-golden-dark/70">{vehicle.description}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditVehicle(vehicle)}
                              className="h-7 w-7 p-0 text-golden-dark hover:bg-golden-accent/20"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                         <div className="space-y-2">
                           <div className="flex justify-between items-center">
                             <span className="text-xs text-golden-dark/70">
                               Multiplier: {vehicle.price_multiplier}x
                             </span>
                             <Badge 
                               variant={vehicle.is_active ? "default" : "secondary"}
                               className={vehicle.is_active ? "bg-green-100 text-green-800" : ""}
                             >
                               {vehicle.is_active ? 'Active' : 'Inactive'}
                             </Badge>
                           </div>
                            <div className="text-xs text-golden-dark/70 space-y-1">
                              <div>₹{vehicle.drop_trip_rate_per_km || 14} (Drop)</div>
                              <div>₹{vehicle.round_trip_rate_per_km || 12} (Round)</div>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit Vehicle Dialog */}
      <Dialog open={!!editingVehicle} onOpenChange={() => setEditingVehicle(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vehicle Type</DialogTitle>
            <DialogDescription>Update vehicle type details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pr-2">
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select value={vehicleForm.category_id} onValueChange={(value) => setVehicleForm({ ...vehicleForm, category_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-name">Vehicle Name</Label>
              <Input
                id="edit-name"
                value={vehicleForm.name}
                onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={vehicleForm.description}
                onChange={(e) => setVehicleForm({ ...vehicleForm, description: e.target.value })}
              />
            </div>
             <div>
               <Label htmlFor="edit-multiplier">Price Multiplier</Label>
               <Input
                 id="edit-multiplier"
                 type="number"
                 step="0.1"
                 value={vehicleForm.price_multiplier}
                 onChange={(e) => setVehicleForm({ ...vehicleForm, price_multiplier: parseFloat(e.target.value) })}
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label htmlFor="edit-base-fare">Base Fare (₹)</Label>
                 <Input
                   id="edit-base-fare"
                   type="number"
                   step="0.01"
                   value={vehicleForm.base_fare}
                   onChange={(e) => setVehicleForm({ ...vehicleForm, base_fare: parseFloat(e.target.value) })}
                 />
               </div>
               <div>
                 <Label htmlFor="edit-per-minute-rate">Per Minute (₹)</Label>
                 <Input
                   id="edit-per-minute-rate"
                   type="number"
                   step="0.01"
                   value={vehicleForm.per_minute_rate}
                   onChange={(e) => setVehicleForm({ ...vehicleForm, per_minute_rate: parseFloat(e.target.value) })}
                 />
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label htmlFor="edit-drop-trip-rate">Drop Trip Rate (₹)</Label>
                 <Input
                   id="edit-drop-trip-rate"
                   type="number"
                   step="0.01"
                   value={vehicleForm.drop_trip_rate_per_km}
                   onChange={(e) => setVehicleForm({ ...vehicleForm, drop_trip_rate_per_km: parseFloat(e.target.value) })}
                 />
               </div>
               <div>
                 <Label htmlFor="edit-round-trip-rate">Round Trip Rate (₹)</Label>
                 <Input
                   id="edit-round-trip-rate"
                   type="number"
                   step="0.01"
                   value={vehicleForm.round_trip_rate_per_km}
                   onChange={(e) => setVehicleForm({ ...vehicleForm, round_trip_rate_per_km: parseFloat(e.target.value) })}
                 />
               </div>
             </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-active"
                checked={vehicleForm.is_active}
                onCheckedChange={(checked) => setVehicleForm({ ...vehicleForm, is_active: checked })}
              />
              <Label htmlFor="edit-active">Active</Label>
            </div>
            <Button 
              onClick={handleUpdateVehicle}
              disabled={updateVehicle.isPending}
              className="w-full bg-golden-primary hover:bg-golden-primary/80 text-golden-dark"
            >
              {updateVehicle.isPending ? 'Updating...' : 'Update Vehicle Type'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleTypesManager;