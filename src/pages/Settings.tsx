import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect non-admin users
    if (!isAdmin) {
      toast.error("You do not have permission to access this page");
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);
  
  // If not admin, don't render the settings page
  if (!isAdmin) {
    return null;
  }
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your laboratory system settings and user permissions.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="labs">Laboratory Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure the basic settings for your laboratory system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSave}>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="institution-name">Institution Name</Label>
                    <Input
                      id="institution-name"
                      placeholder="University Campus"
                      defaultValue="University Campus"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="contact-email">Admin Contact Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="admin@example.edu"
                      defaultValue="admin@example.edu"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="low-stock-alerts" defaultChecked />
                    <Label htmlFor="low-stock-alerts">Enable inventory alerts</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="maintenance-alerts" defaultChecked />
                    <Label htmlFor="maintenance-alerts">Enable lab maintenance reminders</Label>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>
                Customize how the laboratory system works.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="default-view">Default Laboratory View</Label>
                <select
                  id="default-view"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="grid"
                >
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="items-per-page">Items Per Page</Label>
                <select
                  id="items-per-page"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="20"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="confirm-delete" defaultChecked />
                <Label htmlFor="confirm-delete">Confirm before deleting items</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="student-booking-approval" defaultChecked />
                <Label htmlFor="student-booking-approval">Require approval for student lab bookings</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-item-notification">Inventory Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when inventory changes
                    </p>
                  </div>
                  <Switch id="new-item-notification" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="low-stock-notification">Low Stock</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when items are running low
                    </p>
                  </div>
                  <Switch id="low-stock-notification" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="booking-notification">Lab Bookings</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for new laboratory bookings
                    </p>
                  </div>
                  <Switch id="booking-notification" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="student-notification">Student Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications to students for approaching deadlines
                    </p>
                  </div>
                  <Switch id="student-notification" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage access permissions and user accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="user-registration">User Registration</Label>
                <select
                  id="user-registration"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="approval"
                >
                  <option value="open">Open Registration</option>
                  <option value="approval">Require Admin Approval</option>
                  <option value="closed">Closed (Admin Only)</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="max-borrowings">Maximum Borrowings Per Student</Label>
                <Input
                  id="max-borrowings"
                  type="number"
                  defaultValue="5"
                  min="1"
                  max="20"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="auto-suspend" />
                <Label htmlFor="auto-suspend">Auto-suspend accounts with overdue items</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="allow-multiple-bookings" defaultChecked />
                <Label htmlFor="allow-multiple-bookings">Allow multiple lab bookings per student</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>
                Manage administrator access and permissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="admin-role">Default Admin Role</Label>
                <select
                  id="admin-role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="full"
                >
                  <option value="full">Full Access</option>
                  <option value="inventory">Inventory Management Only</option>
                  <option value="bookings">Bookings Management Only</option>
                  <option value="readonly">Read-Only</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="require-2fa" />
                <Label htmlFor="require-2fa">Require two-factor authentication for admins</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="admin-logs" defaultChecked />
                <Label htmlFor="admin-logs">Keep logs of admin actions</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="labs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Management</CardTitle>
              <CardDescription>
                Configure laboratory availability and settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="booking-window">Booking Window (days in advance)</Label>
                <Input
                  id="booking-window"
                  type="number"
                  defaultValue="14"
                  min="1"
                  max="90"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="max-duration">Maximum Booking Duration (hours)</Label>
                <Input
                  id="max-duration"
                  type="number"
                  defaultValue="4"
                  min="1"
                  max="24"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="weekend-bookings" />
                <Label htmlFor="weekend-bookings">Allow weekend bookings</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="auto-approve-faculty" defaultChecked />
                <Label htmlFor="auto-approve-faculty">Auto-approve faculty bookings</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="enforce-capacity" defaultChecked />
                <Label htmlFor="enforce-capacity">Enforce lab capacity limits</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;