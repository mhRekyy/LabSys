
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

// Import components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ActivityCharts from "@/components/dashboard/ActivityCharts";
import UpcomingBookings from "@/components/dashboard/UpcomingBookings";
import RecentAlerts from "@/components/dashboard/RecentAlerts";
import ActivityTab from "@/components/dashboard/ActivityTab";
import BookingsTab from "@/components/dashboard/BookingsTab";
import { ActivityDataItem, EquipmentUsageItem, BookingItem, AlertItem } from "@/components/dashboard/types";

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

const upcomingBookings: BookingItem[] = [
  {
    id: 1,
    lab: "Computer Science Lab",
    equipment: "Workstation PC",
    date: "Today",
    time: "10:00 - 12:00",
    status: "confirmed"
  },
  {
    id: 2,
    lab: "Physics Laboratory",
    equipment: "Oscilloscope",
    date: "Tomorrow",
    time: "14:00 - 16:00",
    status: "pending"
  },
  {
    id: 3,
    lab: "Electronics Workshop",
    equipment: "Soldering Station",
    date: "Apr 20, 2025",
    time: "09:00 - 11:00",
    status: "confirmed"
  }
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
  const { studentNpm } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");
  
  const handleViewAll = (section: string) => {
    toast.info(`Viewing all ${section}`);
  };

  const handleShare = () => {
    toast.info("Sharing dashboard");
  };
  
  const handleCustomize = () => {
    toast.info("Customize dashboard");
  };
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <DashboardHeader onShareClick={handleShare} onCustomizeClick={handleCustomize} />
      
      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-3 w-full sm:w-auto">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Activity</TabsTrigger>
          <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <DashboardStats />
          
          {/* Charts Row */}
          <ActivityCharts activityData={activityData} equipmentUsageData={equipmentUsageData} />
          
          {/* Recent Activity and Alerts Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <UpcomingBookings bookings={upcomingBookings} onViewAll={handleViewAll} />
            <RecentAlerts alerts={recentAlerts} onViewAll={handleViewAll} />
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-6">
          <ActivityTab activityData={activityData} />
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-6">
          <BookingsTab bookings={upcomingBookings} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Dashboard;