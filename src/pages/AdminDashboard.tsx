import React, { useState, useEffect } from 'react';
import { Car, Users, MapPin, Clock, DollarSign, TrendingUp, Bell, Settings, LogOut, Calendar, Filter, Search, MoreVertical, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useBookings, useUpdateBooking } from '@/hooks/useBookings';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/integrations/supabase/client';
import TariffManager from '@/components/TariffManager';
import RealTimeBookingUpdates from '@/components/RealTimeBookingUpdates';
import RoutesManager from '@/components/RoutesManager';
import VehicleTypesManager from '@/components/VehicleTypesManager';
import BookingNotifications from '@/components/BookingNotifications';
import BookingStatusUpdater from '@/components/BookingStatusUpdater';
import VehicleSetup from '@/components/VehicleSetup';
import { useQueries, useUpdateQuery } from '@/hooks/useQueries';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const { data: bookings = [], isLoading, refetch } = useBookings();
  const { data: queries = [], isLoading: queriesLoading } = useQueries();
  const updateBooking = useUpdateBooking();
  const updateQuery = useUpdateQuery();
  const { isAdminLoggedIn, adminLogout } = useAdmin();

  // Real-time updates for bookings
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [refetch]);

  // Supabase real-time subscription for new bookings
  useEffect(() => {
    const channel = supabase.channel('booking-changes').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'bookings'
    }, payload => {
      console.log('New booking received:', payload);
      toast({
        title: "🚖 New Booking Alert!",
        description: `New ride from ${payload.new.pickup_location} to ${payload.new.destination}`,
        duration: 8000
      });
      refetch(); // Refresh the bookings list
    }).on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'bookings'
    }, payload => {
      console.log('Booking updated:', payload);
      refetch(); // Refresh the bookings list
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, refetch]);

  // Calculate stats from real data
  console.log('AdminDashboard - Bookings data:', bookings.length, bookings);
  console.log('AdminDashboard - Queries data:', queries.length, queries);
  
  const activeRides = bookings.filter(b => b.status === 'in-progress' || b.status === 'confirmed').length;
  const completedToday = bookings.filter(b => 
    b.status === 'completed' && 
    new Date(b.created_at).toDateString() === new Date().toDateString()
  );
  console.log('Completed bookings today:', completedToday);
  
  const todayRevenue = completedToday.reduce((sum, b) => sum + (Number(b.actual_fare) || 0), 0);
  console.log('Today revenue calculation:', todayRevenue);
  const stats = [{
    label: 'Active Rides',
    value: activeRides.toString(),
    change: '+12%',
    icon: Car,
    color: 'text-blue-600'
  }, {
    label: 'Total Bookings',
    value: bookings.length.toString(),
    change: '+8%',
    icon: Users,
    color: 'text-green-600'
  }, {
    label: 'Daily Revenue',
    value: `₹${todayRevenue.toFixed(2)}`,
    change: '+15%',
    icon: DollarSign,
    color: 'text-purple-600'
  }, {
    label: 'Avg Rating',
    value: '4.8',
    change: '+2%',
    icon: TrendingUp,
    color: 'text-orange-600'
  }];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-golden-primary/20 text-golden-dark border-golden-primary/40';
      case 'confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'pending':
        return 'bg-golden-accent/30 text-golden-dark border-golden-accent';
      default:
        return 'bg-golden-accent/30 text-golden-dark border-golden-accent';
    }
  };
  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    updateBooking.mutate({
      id: bookingId,
      status: newStatus,
      ...(newStatus === 'confirmed' && {
        driver_name: 'Amit Sharma',
        driver_phone: '+91 98765 43210'
      })
    });
  };
  const handleLogout = () => {
    adminLogout();
    toast({
      title: "Logged Out",
      description: "Admin session ended successfully."
    });
  };
  const handleQuickAction = (action: string) => {
    toast({
      title: "Quick Action",
      description: `${action} functionality coming soon!`
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-golden-light via-background to-golden-accent/20">
      {/* Include notification components */}
      <BookingNotifications />
      <BookingStatusUpdater />
      
      {/* Header */}
      <header className="bg-golden-gradient shadow-golden border-b border-golden-accent/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-golden-dark" />
            <h1 className="text-2xl font-bold text-golden-dark">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-golden-dark hover:bg-golden-accent/20">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-golden-dark hover:bg-golden-accent/20">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar className="border-2 border-golden-accent">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-golden-primary text-golden-dark">AD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-golden-dark">h@g.in</p>
                <p className="text-xs text-golden-dark/70">System Administrator</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-golden-dark hover:bg-golden-accent/20">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-golden-accent/30 p-1 rounded-lg mb-8 w-fit border border-golden-accent/40 shadow-golden">
          <Button variant={activeTab === 'overview' ? 'default' : 'ghost'} onClick={() => setActiveTab('overview')} className={`px-6 ${activeTab === 'overview' ? 'bg-golden-primary text-golden-dark shadow-md' : 'text-golden-dark hover:bg-golden-accent/40 hover:text-golden-dark'}`}>
            Overview
          </Button>
          <Button variant={activeTab === 'bookings' ? 'default' : 'ghost'} onClick={() => setActiveTab('bookings')} className={`px-6 ${activeTab === 'bookings' ? 'bg-golden-primary text-golden-dark shadow-md' : 'text-golden-dark hover:bg-golden-accent/40 hover:text-golden-dark'}`}>
            All Bookings
          </Button>
          <Button variant={activeTab === 'live' ? 'default' : 'ghost'} onClick={() => setActiveTab('live')} className={`px-6 ${activeTab === 'live' ? 'bg-golden-primary text-golden-dark shadow-md' : 'text-golden-dark hover:bg-golden-accent/40 hover:text-golden-dark'}`}>
            Live Updates
          </Button>
          <Button variant={activeTab === 'routes' ? 'default' : 'ghost'} onClick={() => setActiveTab('routes')} className={`px-6 ${activeTab === 'routes' ? 'bg-golden-primary text-golden-dark shadow-md' : 'text-golden-dark hover:bg-golden-accent/40 hover:text-golden-dark'}`}>
            Routes
          </Button>
            <Button variant={activeTab === 'tariffs' ? 'default' : 'ghost'} onClick={() => setActiveTab('tariffs')} className={`px-6 ${activeTab === 'tariffs' ? 'bg-golden-primary text-golden-dark shadow-md' : 'text-golden-dark hover:bg-golden-accent/40 hover:text-golden-dark'}`}>
              Tariff Management
            </Button>
            <Button variant={activeTab === 'car-types' ? 'default' : 'ghost'} onClick={() => setActiveTab('car-types')} className={`px-6 ${activeTab === 'car-types' ? 'bg-golden-primary text-golden-dark shadow-md' : 'text-golden-dark hover:bg-golden-accent/40 hover:text-golden-dark'}`}>
              Car Types
            </Button>
            <Button variant={activeTab === 'queries' ? 'default' : 'ghost'} onClick={() => setActiveTab('queries')} className={`px-6 ${activeTab === 'queries' ? 'bg-golden-primary text-golden-dark shadow-md' : 'text-golden-dark hover:bg-golden-accent/40 hover:text-golden-dark'}`}>
              Queries
            </Button>
        </div>

        {/* Overview Content */}
        {activeTab === 'overview' && <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return <Card key={index} className="hover:shadow-golden transition-all duration-300 bg-warm-gradient border-golden-accent/40 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-golden-dark/80">{stat.label}</p>
                          <p className="text-2xl font-bold text-golden-dark">{stat.value}</p>
                          <p className="text-sm text-green-600">{stat.change}</p>
                        </div>
                        <IconComponent className={`h-8 w-8 text-golden-primary`} />
                      </div>
                    </CardContent>
                  </Card>;
          })}
            </div>

            {/* All Bookings Section */}
            <Card className="shadow-golden bg-warm-gradient border-golden-accent/40 backdrop-blur-sm">
              <CardHeader className="border-b border-golden-accent/30">
                <CardTitle className="text-golden-dark">All Bookings</CardTitle>
                <CardDescription className="text-golden-dark/70">Manage and track all taxi bookings</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-golden-accent/30 hover:bg-golden-accent/10">
                        <TableHead className="text-golden-dark font-semibold">Booking ID</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Passenger</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Route</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Date & Time</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Status</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Fare</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map(booking => <TableRow key={booking.id} className="border-golden-accent/30 hover:bg-golden-accent/10">
                          <TableCell className="font-medium text-golden-dark">{booking.id.slice(0, 8)}</TableCell>
                          <TableCell className="text-golden-dark">{booking.passenger_name}</TableCell>
                          <TableCell className="text-golden-dark">
                            <div>{booking.pickup_location} → {booking.destination}</div>
                          </TableCell>
                          <TableCell className="text-golden-dark">{booking.pickup_date} {booking.pickup_time}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(booking.status)} border`}>
                              {booking.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-golden-dark">
                            ₹{(Number(booking.estimated_fare) || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {booking.status === 'pending' && <>
                                  <Button size="sm" onClick={() => handleStatusUpdate(booking.id, 'confirmed')} disabled={updateBooking.isPending} className="bg-golden-primary hover:bg-golden-primary/80 text-golden-dark">
                                    Assign
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(booking.id, 'cancelled')} disabled={updateBooking.isPending} className="border-golden-accent text-golden-dark hover:bg-golden-accent/20">
                                    Cancel
                                  </Button>
                                </>}
                              {booking.status === 'confirmed' && <Button size="sm" onClick={() => handleStatusUpdate(booking.id, 'in-progress')} disabled={updateBooking.isPending} className="bg-golden-primary hover:bg-golden-primary/80 text-golden-dark">
                                  Start
                                </Button>}
                              {booking.status === 'in-progress' && <Button size="sm" onClick={() => handleStatusUpdate(booking.id, 'completed')} disabled={updateBooking.isPending} className="bg-green-600 hover:bg-green-700 text-white">
                                  Complete
                                </Button>}
                            </div>
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-golden bg-warm-gradient border-golden-accent/40 backdrop-blur-sm">
              
              
            </Card>
          </div>}

        {/* All Bookings Content */}
        {activeTab === 'bookings' && <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-golden-dark">All Bookings</h2>
              <div className="flex space-x-2">
                <Select defaultValue="today">
                  <SelectTrigger className="w-32 border-golden-accent bg-golden-accent/10 text-golden-dark">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-golden-light border-golden-accent">
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="border-golden-accent text-golden-dark hover:bg-golden-accent/20">Export</Button>
              </div>
            </div>

            <Card className="shadow-golden bg-warm-gradient border-golden-accent/40 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-golden-accent/30 hover:bg-golden-accent/10">
                        <TableHead className="text-golden-dark font-semibold">Booking ID</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Passenger</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Route</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Date & Time</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Status</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Fare</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map(booking => <TableRow key={booking.id} className="border-golden-accent/30 hover:bg-golden-accent/10">
                          <TableCell className="font-medium text-golden-dark">{booking.id.slice(0, 8)}</TableCell>
                          <TableCell className="text-golden-dark">{booking.passenger_name}</TableCell>
                          <TableCell className="text-golden-dark">
                            <div>{booking.pickup_location} → {booking.destination}</div>
                          </TableCell>
                          <TableCell className="text-golden-dark">{booking.pickup_date} {booking.pickup_time}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(booking.status)} border`}>
                              {booking.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-golden-dark">
                            ₹{(Number(booking.estimated_fare) || 0).toFixed(2)}
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>}

        {/* Live Updates Content */}
        {activeTab === 'live' && <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-golden-dark mb-2">Live Updates</h2>
              <p className="text-golden-dark/70">Real-time booking management and status updates</p>
            </div>
            <RealTimeBookingUpdates />
          </div>}

        {/* Routes Management Content */}
        {activeTab === 'routes' && <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-golden-dark mb-2">Routes Management</h2>
              <p className="text-golden-dark/70">Manage popular routes displayed on the website</p>
            </div>
            <RoutesManager />
          </div>}

        {/* Tariff Management Content */}
        {activeTab === 'tariffs' && <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-golden-dark mb-2">Tariff Management</h2>
              <p className="text-golden-dark/70">Manage pricing rates for your taxi booking service</p>
            </div>
            <TariffManager />
          </div>}

        {/* Car Types Management Content */}
        {activeTab === 'car-types' && <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-golden-dark mb-2">Car Types Management</h2>
              <p className="text-golden-dark/70">Set up the 4 vehicle types with rates as shown in your image</p>
            </div>
            <VehicleSetup />
            <VehicleTypesManager />
          </div>}
          
        {/* Queries Management Content */}
        {activeTab === 'queries' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-golden-dark mb-2">Customer Queries</h2>
              <p className="text-golden-dark/70">Manage customer messages and inquiries</p>
            </div>
            
            <Card className="shadow-golden bg-warm-gradient border-golden-accent/40 backdrop-blur-sm">
              <CardHeader className="border-b border-golden-accent/30">
                <CardTitle className="text-golden-dark flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Customer Messages
                </CardTitle>
                <CardDescription className="text-golden-dark/70">
                  Review and respond to customer inquiries
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-golden-accent/30 hover:bg-golden-accent/10">
                        <TableHead className="text-golden-dark font-semibold">Name</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Email</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Subject</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Message</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Status</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Date</TableHead>
                        <TableHead className="text-golden-dark font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {queries.map((query) => (
                        <TableRow key={query.id} className="border-golden-accent/30 hover:bg-golden-accent/10">
                          <TableCell className="text-golden-dark font-medium">{query.full_name}</TableCell>
                          <TableCell className="text-golden-dark">{query.email}</TableCell>
                          <TableCell className="text-golden-dark">{query.subject}</TableCell>
                          <TableCell className="text-golden-dark max-w-xs">
                            <div className="truncate" title={query.message}>
                              {query.message}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`border ${
                              query.status === 'pending' ? 'bg-golden-accent/30 text-golden-dark border-golden-accent' :
                              query.status === 'in-progress' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                              'bg-green-100 text-green-800 border-green-300'
                            }`}>
                              {query.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-golden-dark">
                            {new Date(query.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {query.status === 'pending' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => updateQuery.mutate({ id: query.id, status: 'in-progress' })}
                                  className="bg-golden-primary hover:bg-golden-primary/80 text-golden-dark"
                                >
                                  Start
                                </Button>
                              )}
                              {query.status === 'in-progress' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => updateQuery.mutate({ id: query.id, status: 'resolved' })}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Resolve
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {queries.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-golden-dark/70">
                            No customer queries found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>;
};
export default AdminDashboard;