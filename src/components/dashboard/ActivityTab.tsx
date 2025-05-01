import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { HomeIcon, Settings, MoreHorizontal } from "lucide-react";
import { ActivityDataItem } from "@/components/dashboard/types";
import { motion } from "framer-motion";
import Dashboard from './../../pages/Dashboard';

interface ActivityTabProps {
  activityData: ActivityDataItem[];
}

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

const ActivityTab: React.FC<ActivityTabProps> = ({ activityData }) => {
  return (
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
                  <Settings className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Compound Microscope</div>
                  <div className="text-sm text-muted-foreground">Biology Lab - Apr 15, 2025</div>
                </div>
                <Button variant="secondary" size="sm">Returned</Button>
              </div>
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="bg-purple-500/10 p-2 rounded-md text-purple-500">
                  <Settings className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Oscilloscope</div>
                  <div className="text-sm text-muted-foreground">Physics Lab - Apr 14, 2025</div>
                </div>
                <Button variant="secondary" size="sm">Returned</Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-500/10 p-2 rounded-md text-green-500">
                  <Settings className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Soldering Station</div>
                  <div className="text-sm text-muted-foreground">Electronics Lab - Apr 12, 2025</div>
                </div>
                <Button variant="secondary" size="sm">Returned</Button>
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
  );
};

export default ActivityTab;