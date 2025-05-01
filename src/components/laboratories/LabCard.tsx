import React from "react";
import { Building, Clock, Users, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Lab card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  hover: { 
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { type: "spring", stiffness: 400, damping: 20 }
  }
};

interface LabAssistant {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

interface LabScheduleDay {
  day: string;
  slots: string[];
}

interface Lab {
  id: number;
  name: string;
  building: string;
  floor: number;
  room: string;
  status: string;
  type: string;
  description: string;
  hours: string;
  capacity: number;
  assistants: LabAssistant[];
  equipment: string[];
  rating: number;
  schedule?: LabScheduleDay[];
}

interface LabCardProps {
  lab: Lab;
  onClick: (lab: Lab) => void;
  isAdmin: boolean;
  onStatusChange: (labId: number, newStatus: string) => void;
}

const LabCard: React.FC<LabCardProps> = ({ lab, onClick, isAdmin, onStatusChange }) => {
  const statusColors = {
    open: "bg-green-500",
    closed: "bg-red-500",
    maintenance: "bg-yellow-500"
  };
  
  const handleStatusChange = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    onStatusChange(lab.id, value);
  };
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={() => onClick(lab)}
      className="cursor-pointer"
    >
      <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div className={`absolute top-0 left-0 right-0 h-1 ${statusColors[lab.status]}`}></div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <Badge className={`mb-2 ${lab.status === 'open' ? 'bg-green-500' : lab.status === 'closed' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                {lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
              </Badge>
              {isAdmin && (
                <Select 
                  defaultValue={lab.status} 
                  onValueChange={(value) => onStatusChange(lab.id, value)}
                >
                  <SelectTrigger 
                    className="w-[120px] h-8 text-xs mt-1 mb-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent onClick={(e) => e.stopPropagation()}>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <CardTitle className="text-xl flex items-center">
                {lab.name}
              </CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {lab.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start">
              <Building className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm">{lab.building}</p>
                {lab.floor && lab.room && (
                  <p className="text-xs text-muted-foreground">
                    Floor {lab.floor}, Room {lab.room}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
              <p className="text-sm">{lab.hours}</p>
            </div>
            
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
              <p className="text-sm">Capacity: {lab.capacity} students</p>
            </div>
            
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-amber-500 flex-shrink-0" />
              <p className="text-sm">{lab.rating} / 5.0</p>
            </div>
            
            <div className="flex mt-2">
              <p className="text-xs font-medium text-muted-foreground mr-2">Lab Assistants:</p>
              <div className="flex -space-x-2">
                {lab.assistants.map((assistant) => (
                  <HoverCard key={assistant.id}>
                    <HoverCardTrigger>
                      <Avatar className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={assistant.avatar} />
                        <AvatarFallback>{assistant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64">
                      <div className="flex justify-between space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={assistant.avatar} />
                          <AvatarFallback>{assistant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">{assistant.name}</h4>
                          <p className="text-xs text-muted-foreground">{assistant.role}</p>
                          <div className="flex items-center pt-1">
                            <span className="text-xs text-muted-foreground">Available now</span>
                            <span className="ml-1 h-2 w-2 rounded-full bg-green-500"></span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 flex justify-end">
          <Button variant="ghost" size="sm" className="text-primary gap-1">
            View Details <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LabCard;