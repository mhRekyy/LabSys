import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsersRound, Microscope } from "lucide-react";

// Import components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ActivityCharts from "@/components/dashboard/ActivityCharts";
import UpcomingBookings from "@/components/dashboard/UpcomingBookings";
import RecentAlerts from "@/components/dashboard/RecentAlerts";
import ActivityTab from "@/components/dashboard/ActivityTab";
import BookingsTab from "@/components/dashboard/BookingsTab";
import { ActivityDataItem, EquipmentUsageItem, BookingItem, AlertItem } from "@/components/dashboard/types";
import { useNavigate } from "react-router-dom";

// Mock data
const activityData: ActivityDataItem[] = [
  { name: "Mon", value: 4 },
  { name: "Tue", value: 6 },
  { name: "Wed", value: 10 },
  { name: "Thu", value: 8 },
  { name: "Fri", value: 12 },
  { name: "Sat", value: 5 },
  { name: "Sun", value: 3 },
];

const equipmentUsageData: EquipmentUsageItem[] = [
  { name: "Microscopes", value: 30 },
  { name: "Computers", value: 45 },
  { name: "Lab Tools", value: 20 },
  { name: "Electronics", value: 15 },
];

// Mock labs in use data
const labsInUse = [
  { id: 1, name: "Computer Science Lab", building: "Engineering Building", capacity: 30, usagePercentage: 85 },
  { id: 2, name: "Physics Laboratory", building: "Science Center", capacity: 24, usagePercentage: 95 },
  { id: 4, name: "Biotechnology Laboratory", building: "Life Sciences Building", capacity: 18, usagePercentage: 70 },
];

const recentAlerts: AlertItem[] = [
  {
    id: 1,
    title: "Equipment due for return",
    description: "Microscope #M102 is due for return today by 5PM",
    time: "20 minutes ago",
    type: "warning"
  },
  {
    id: 2,
    title: "New laboratory schedule",
    description: "Physics Lab has updated their operating hours for next week",
    time: "2 hours ago",
    type: "info"
  },
  {
    id: 3,
    title: "System maintenance",
    description: "LabSys will be under maintenance tomorrow from 2AM to 4AM",
    time: "5 hours ago",
    type: "info"
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

const Dashboard = () => {
  const { studentNpm, isAdmin } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = localStorage.getItem('userBookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);
  
  const handleViewAll = (section: string) => {
    if (section === 'bookings') {
      setSelectedTab('bookings');
    } else if (section === 'laboratories') {
      navigate('/laboratories');
    } else {
      toast.info(`Viewing all ${section}`);
    }
  };

  const handleShare = () => {
    toast.info("Sharing dashboard");
  };
  
  const handleCustomize = () => {
    toast.info("Customize dashboard");
  };

  const handleBookLaboratory = () => {
    navigate('/laboratories');
  };

  // Admin-specific statistics
  const adminStats = [
    { title: "Total Users", value: "118", icon: <UsersRound className="h-5 w-5" /> },
    { title: "Active Labs", value: "5", icon: <Microscope className="h-5 w-5" /> },
    { title: "Equipment Usage", value: "83%", change: "+12%" },
    { title: "Pending Returns", value: "7", change: "-2" }
  ];
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <DashboardHeader 
        onShareClick={handleShare} 
        onCustomizeClick={handleCustomize} 
      />
      
      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-3 w-full sm:w-auto">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Activity</TabsTrigger>
          <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          {isAdmin ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {adminStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                      {stat.change && (
                        <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.change} from last week
                        </p>
                      )}
                    </div>
                    {stat.icon && (
                      <div className="p-3 bg-primary/10 rounded-full">
                        {stat.icon}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <DashboardStats bookingsCount={bookings.length} />
          )}
          
          {/* Charts Row */}
          <ActivityCharts activityData={activityData} equipmentUsageData={equipmentUsageData} />
          
          {/* Recent Activity and Alerts Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <UpcomingBookings bookings={bookings} onViewAll={handleViewAll} />
            <RecentAlerts alerts={recentAlerts} onViewAll={handleViewAll} />
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-6">
          <ActivityTab activityData={activityData} />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Laboratories Currently in Use</span>
                <Button variant="link" size="sm" onClick={() => handleViewAll('laboratories')}>
                  View all
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {labsInUse.map(lab => (
                  <div key={lab.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <h4 className="font-medium">{lab.name}</h4>
                      <p className="text-sm text-muted-foreground">{lab.building}</p>
                    </div>
                    <div className="text-right">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${lab.usagePercentage > 90 ? 'bg-red-500' : 'bg-green-500'}`} 
                          style={{width: `${lab.usagePercentage}%`}}
                        />
                      </div>
                      <p className="text-xs mt-1">{lab.usagePercentage}% full ({Math.round(lab.capacity * lab.usagePercentage / 100)}/{lab.capacity})</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-6">
          <BookingsTab bookings={bookings} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Dashboard;