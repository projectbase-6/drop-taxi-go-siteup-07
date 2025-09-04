
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { useRoutes, useCreateRoute, useUpdateRoute, useDeleteRoute } from '@/hooks/useRoutes';
import type { Route } from '@/hooks/useRoutes';

const ServiceManager = () => {
  const { data: routes = [] } = useRoutes();
  const createRoute = useCreateRoute();
  const updateRoute = useUpdateRoute();
  const deleteRoute = useDeleteRoute();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    from_destination: '',
    to_destination: '',
    distance_km: '',
    price: '',
    trip_type: 'one-way' as 'one-way' | 'round-trip' | 'airport'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const routeData = {
      from_destination: formData.from_destination,
      to_destination: formData.to_destination,
      distance_km: parseFloat(formData.distance_km) || 0,
      price: parseFloat(formData.price),
      trip_type: formData.trip_type
    };

    try {
      if (isEditing && editingRoute) {
        await updateRoute.mutateAsync({ id: editingRoute.id, ...routeData });
      } else {
        await createRoute.mutateAsync(routeData);
      }
      
      // Reset form
      setFormData({
        from_destination: '',
        to_destination: '',
        distance_km: '',
        price: '',
        trip_type: 'one-way'
      });
      setIsEditing(false);
      setEditingRoute(null);
    } catch (error) {
      console.error('Error saving route:', error);
    }
  };

  const handleEdit = (route: Route) => {
    setIsEditing(true);
    setEditingRoute(route);
    setFormData({
      from_destination: route.from_destination,
      to_destination: route.to_destination,
      distance_km: route.distance_km?.toString() || '',
      price: route.price.toString(),
      trip_type: route.trip_type
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await deleteRoute.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting route:', error);
      }
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingRoute(null);
    setFormData({
      from_destination: '',
      to_destination: '',
      distance_km: '',
      price: '',
      trip_type: 'one-way'
    });
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Route Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>{isEditing ? 'Edit Route' : 'Add New Route'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from_destination">From Location</Label>
                <Input
                  id="from_destination"
                  value={formData.from_destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, from_destination: e.target.value }))}
                  placeholder="e.g., Chennai"
                  required
                />
              </div>
              <div>
                <Label htmlFor="to_destination">To Location</Label>
                <Input
                  id="to_destination"
                  value={formData.to_destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, to_destination: e.target.value }))}
                  placeholder="e.g., Coimbatore"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="distance_km">Distance (KM)</Label>
                <Input
                  id="distance_km"
                  type="number"
                  value={formData.distance_km}
                  onChange={(e) => setFormData(prev => ({ ...prev, distance_km: e.target.value }))}
                  placeholder="e.g., 500"
                />
              </div>
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., 7500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="trip_type">Trip Type</Label>
                <Select value={formData.trip_type} onValueChange={(value: 'one-way' | 'round-trip' | 'airport') => setFormData(prev => ({ ...prev, trip_type: value }))}>
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
            
            <div className="flex space-x-2">
              <Button type="submit" disabled={createRoute.isPending || updateRoute.isPending}>
                {isEditing ? 'Update Route' : 'Add Route'}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Routes List */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Routes ({routes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routes.map((route) => (
              <div key={route.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-semibold">
                      {route.from_destination} → {route.to_destination}
                    </p>
                    <p className="text-sm text-gray-500">
                      {route.distance_km ? `${route.distance_km}km` : 'Distance TBD'} • {route.trip_type} • ₹{route.price}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(route)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(route.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {routes.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No routes added yet. Add your first route above.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceManager;
