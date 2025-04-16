import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Calendar, CheckCheck, Clock, ClockIcon, Microscope, MoreHorizontal, Package, Settings, Share2, Sliders, Users, AlertTriangle, Activity, BookOpen, Home as HomeIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

// Mock data
const activityData = [
  { name: "Mon", value: 4 },
  { name: "Tue", value: 6 },
  { name: "Wed", value: 10 },
  { name: "Thu", value: 8 },
  { name: "Fri", value: 12 },
  { name: "Sat", value: 5 },
  { name: "Sun", value: 3 },
];

const equipmentUsageData = [
  { name: "Microscopes", value: 30 },
  { name: "Computers", value: 45 },
  { name: "Lab Tools", value: 20 },
  { name: "Electronics", value: 15 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"];

const upcomingBookings = [
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

const recentAlerts = [
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

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const Dashboard = () => {
  const { studentNpm } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");
  
  const handleViewAll = (section: string) => {
    toast.info(`Viewing all ${section}`);
  };
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Welcome to LabSys</h1>
          <p className="text-muted-foreground mt-1">
            Manage your laboratory activities and equipment borrowing.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Sliders className="mr-2 h-4 w-4" />
            Customize
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-3 w-full sm:w-auto">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Activity</TabsTrigger>
          <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <motion.div variants={cardVariants}>
              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Bookings
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +2 from last week
                  </p>
                  <Progress value={75} className="h-2 mt-3" />
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants}>
              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Lab Hours
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24.5h</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +5.5h from last month
                  </p>
                  <Progress value={60} className="h-2 mt-3" />
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants}>
              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Events
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Next: Physics Lab Workshop
                  </p>
                  <Progress value={45} className="h-2 mt-3" />
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants}>
              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Tasks
                  </CardTitle>
                  <CheckCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    85% completion rate
                  </p>
                  <Progress value={85} className="h-2 mt-3" />
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div variants={cardVariants}>
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>Your laboratory usage over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="name" stroke="#94A3B8" />
                        <YAxis stroke="#94A3B8" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "0.5rem",
                            border: "1px solid #E2E8F0",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#activityGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants}>
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Equipment Usage</CardTitle>
                  <CardDescription>Distribution of equipment types used</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={equipmentUsageData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {equipmentUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Recent Activity and Alerts Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Bookings</CardTitle>
                    <CardDescription>Your scheduled laboratory sessions</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleViewAll('bookings')} className="text-primary">
                    View all
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-md ${
                            booking.lab.includes("Computer") ? "bg-blue-500/10 text-blue-500" :
                            booking.lab.includes("Physics") ? "bg-purple-500/10 text-purple-500" :
                            "bg-green-500/10 text-green-500"
                          }`}>
                            {booking.lab.includes("Computer") ? (
                              <Settings className="h-5 w-5" />
                            ) : booking.lab.includes("Physics") ? (
                              <Activity className="h-5 w-5" />
                            ) : (
                              <Microscope className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{booking.lab}</div>
                            <div className="text-sm text-muted-foreground">{booking.equipment}</div>
                            <div className="flex items-center mt-1 gap-2">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                {booking.date}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {booking.time}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Alerts</CardTitle>
                    <CardDescription>Important notifications and updates</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleViewAll('alerts')} className="text-primary">
                    View all
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAlerts.map((alert) => (
                      <div key={alert.id} className="flex gap-3 border-b pb-4 last:border-0 last:pb-0">
                        <div className={`p-2 h-fit rounded-md ${
                          alert.type === "warning" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                        }`}>
                          {alert.type === "warning" ? (
                            <AlertTriangle className="h-5 w-5" />
                          ) : (
                            <BookOpen className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{alert.title}</div>
                          <div className="text-sm text-muted-foreground">{alert.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">{alert.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-6">
          <motion.div 
            className="grid grid-cols-1 gap-6"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Activity History</CardTitle>
                <CardDescription>Track your laboratory and equipment usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="name" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderRadius: "0.5rem",
                          border: "1px solid #E2E8F0",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Equipment Used</CardTitle>
                    <CardDescription>Your recently used laboratory equipment</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View all
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 border-b pb-4">
                      <div className="bg-blue-500/10 p-2 rounded-md text-blue-500">
                        <Microscope className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Compound Microscope</div>
                        <div className="text-sm text-muted-foreground">Biology Lab - Apr 15, 2025</div>
                      </div>
                      <Badge>Returned</Badge>
                    </div>
                    <div className="flex items-center gap-4 border-b pb-4">
                      <div className="bg-purple-500/10 p-2 rounded-md text-purple-500">
                        <Settings className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Oscilloscope</div>
                        <div className="text-sm text-muted-foreground">Physics Lab - Apr 14, 2025</div>
                      </div>
                      <Badge>Returned</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-green-500/10 p-2 rounded-md text-green-500">
                        <Settings className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Soldering Station</div>
                        <div className="text-sm text-muted-foreground">Electronics Lab - Apr 12, 2025</div>
                      </div>
                      <Badge>Returned</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Visited Laboratories</CardTitle>
                    <CardDescription>Labs you've recently worked in</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View all
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 border-b pb-4">
                      <div className="bg-blue-500/10 p-2 rounded-md text-blue-500">
                        <HomeIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Computer Science Lab</div>
                        <div className="text-sm text-muted-foreground">3 hours spent - Apr 15, 2025</div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 border-b pb-4">
                      <div className="bg-purple-500/10 p-2 rounded-md text-purple-500">
                        <HomeIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Physics Laboratory</div>
                        <div className="text-sm text-muted-foreground">2 hours spent - Apr 14, 2025</div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-green-500/10 p-2 rounded-md text-green-500">
                        <HomeIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Biotechnology Lab</div>
                        <div className="text-sm text-muted-foreground">1.5 hours spent - Apr 10, 2025</div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-6">
          <motion.div 
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {upcomingBookings.map((booking, index) => (
              <motion.div key={booking.id} variants={cardVariants}>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                        {booking.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-xl mt-2">{booking.lab}</CardTitle>
                    <CardDescription>{booking.equipment}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{booking.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{booking.time}</span>
                      </div>
                    </div>
                    
                    <div className="rounded-lg bg-muted p-3">
                      <div className="flex items-center mb-2">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">Lab Assistants</span>
                      </div>
                      <div className="flex gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://i.pravatar.cc/150?img=${index * 2 + 1}`} />
                          <AvatarFallback>LA</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://i.pravatar.cc/150?img=${index * 2 + 2}`} />
                          <AvatarFallback>LA</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">Reschedule</Button>
                    <Button size="sm">View Details</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Book a New Session</CardTitle>
                <CardDescription>Schedule time in one of our laboratories</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button variant="outline" className="h-20 w-full sm:w-auto flex-1 flex flex-col gap-2 p-3 justify-center items-center">
                  <Microscope className="h-5 w-5" />
                  <span>Biology Lab</span>
                </Button>
                <Button variant="outline" className="h-20 w-full sm:w-auto flex-1 flex flex-col gap-2 p-3 justify-center items-center">
                  <Activity className="h-5 w-5" />
                  <span>Physics Lab</span>
                </Button>
                <Button variant="outline" className="h-20 w-full sm:w-auto flex-1 flex flex-col gap-2 p-3 justify-center items-center">
                  <Settings className="h-5 w-5" />
                  <span>Computer Lab</span>
                </Button>
                <Button variant="outline" className="h-20 w-full sm:w-auto flex-1 flex flex-col gap-2 p-3 justify-center items-center">
                  <BookOpen className="h-5 w-5" />
                  <span>More Labs</span>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Dashboard;
