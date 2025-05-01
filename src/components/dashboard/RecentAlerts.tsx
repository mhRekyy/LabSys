import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BookOpen } from "lucide-react";
import { AlertItem } from "@/components/dashboard/types";
import { motion } from "framer-motion";

interface RecentAlertsProps {
  alerts: AlertItem[];
  onViewAll: (section: string) => void;
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

const RecentAlerts: React.FC<RecentAlertsProps> = ({ alerts, onViewAll }) => {
  return (
    <motion.div variants={cardVariants}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Important notifications and updates</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onViewAll('alerts')} className="text-primary">
            View all
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
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
  );
};

export default RecentAlerts;