import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Users, Star, MapPin, InfoIcon, Shield } from "lucide-react";
import { Lab } from "./types";
import { useAuth } from "@/contexts/AuthContext";

interface LabDetailsProps {
  lab: Lab;
  onStatusChange?: (labId: number, newStatus: string) => void;
  onBookLab?: () => void;
}

const LabDetails: React.FC<LabDetailsProps> = ({ 
  lab, 
  onStatusChange,
  onBookLab
}) => {
  const { isAdmin } = useAuth();
  
  const toggleStatus = () => {
    if (onStatusChange) {
      onStatusChange(lab.id, lab.status === "open" ? "closed" : "open");
    }
  };
  
  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div>
            <DialogTitle className="text-xl">{lab.name}</DialogTitle>
            <DialogDescription>{lab.building}, Room {lab.room}</DialogDescription>
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
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={toggleStatus}>
                {lab.status === "open" ? "Set to Closed" : "Set to Open"}
              </Button>
            )}
          </div>
        </div>
      </DialogHeader>
      
      <Tabs defaultValue="info" className="mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4 mt-4">
          <div>
            <h4 className="font-medium mb-1 flex items-center gap-1">
              <InfoIcon className="h-4 w-4" />
              About
            </h4>
            <p className="text-sm text-muted-foreground">{lab.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Hours
              </h4>
              <p className="text-sm">{lab.hours}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1 flex items-center gap-1">
                <Users className="h-4 w-4" />
                Capacity
              </h4>
              <p className="text-sm">{lab.capacity} people</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-1 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Location
            </h4>
            <p className="text-sm">{lab.building}, Floor {lab.floor}, Room {lab.room}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-1 flex items-center gap-1">
              <Star className="h-4 w-4" />
              Rating
            </h4>
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(lab.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm ml-2">{lab.rating.toFixed(1)}</span>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4 mt-4">
          {lab.schedule ? (
            lab.schedule.map((day) => (
              <div key={day.day} className="flex gap-2">
                <div className="font-medium w-24">{day.day}:</div>
                <div className="text-sm">
                  {day.slots.length > 0 ? (
                    day.slots.join(", ")
                  ) : (
                    <span className="text-muted-foreground">No sessions</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No schedule information available</p>
          )}
        </TabsContent>
        
        <TabsContent value="equipment" className="mt-4">
          <div className="grid grid-cols-2 gap-2">
            {lab.equipment.map((item) => (
              <div key={item} className="bg-muted p-2 rounded-md text-sm">
                {item}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <h4 className="font-medium mb-2">Lab Assistants</h4>
        <div className="flex gap-3">
          {lab.assistants.map((assistant) => (
            <div key={assistant.id} className="flex flex-col items-center">
              <Avatar className="h-10 w-10 mb-1">
                <AvatarImage src={assistant.avatar} />
                <AvatarFallback>{assistant.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="text-xs text-center">{assistant.name}</div>
              <div className="text-xs text-muted-foreground text-center">{assistant.role}</div>
            </div>
          ))}
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        {lab.status === "open" && onBookLab && (
          <Button onClick={onBookLab}>
            {isAdmin ? "Manage Laboratory" : "Book This Laboratory"}
          </Button>
        )}
        {lab.status === "closed" && (
          <Button disabled>Currently Closed</Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default LabDetails;