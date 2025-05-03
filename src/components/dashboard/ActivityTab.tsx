import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { ActivityDataItem } from "./types";

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
    </motion.div>
  );
};

export default ActivityTab;