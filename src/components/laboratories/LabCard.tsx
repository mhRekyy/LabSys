import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, BookOpen, Shield } from "lucide-react";
import { Lab } from "./types";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface LabCardProps {
  lab: Lab;
  onClick: (lab: Lab) => void;
  onStatusChange: (labId: number, newStatus: string) => void;
}

const LabCard: React.FC<LabCardProps> = ({ lab, onClick, onStatusChange }) => {
  const { isAdmin } = useAuth();
  
  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStatusChange(lab.id, lab.status === "open" ? "closed" : "open");
  };
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="h-full cursor-pointer hover:border-primary transition-all" 
        onClick={() => onClick(lab)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{lab.name}</CardTitle>
              <CardDescription>{lab.building}, Room {lab.room}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={lab.status === "open" ? "default" : "secondary"}>
                {lab.status === "open" ? "Open" : "Closed"}
              </Badge>
              {isAdmin && (
                <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900 border-purple-200 dark:border-purple-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-0.5" />
            <span>Floor {lab.floor}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-3.5 w-3.5 text-muted-foreground mr-0.5" />
            <span>{lab.hours}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Users className="h-3.5 w-3.5 text-muted-foreground mr-0.5" />
            <span>{lab.capacity} people</span>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-1">
            {lab.equipment.slice(0, 2).map((item) => (
              <Badge variant="outline" key={item} className="text-xs">
                {item}
              </Badge>
            ))}
            {lab.equipment.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{lab.equipment.length - 2} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" className="gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            Details
          </Button>
          
          {isAdmin && (
            <Button 
              variant={lab.status === "open" ? "destructive" : "default"} 
              size="sm" 
              onClick={handleStatusToggle}
            >
              {lab.status === "open" ? "Close" : "Open"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LabCard;