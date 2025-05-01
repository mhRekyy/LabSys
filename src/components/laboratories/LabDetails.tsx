import React from "react";
import { Button } from "@/components/ui/button";
import { Building, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

interface LabDetailsProps {
  lab: Lab;
  isAdmin: boolean;
  onStatusChange: (labId: number, status: string) => void;
}

const LabDetails: React.FC<LabDetailsProps> = ({ lab, isAdmin, onStatusChange }) => {
  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center">
          {lab.name}
          <Badge 
            className={`ml-3 ${
              lab.status === 'open' ? 'bg-green-500' : 
              lab.status === 'closed' ? 'bg-red-500' : 'bg-yellow-500'
            }`}
          >
            {lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
          </Badge>
        </DialogTitle>
        <DialogDescription>{lab.description}</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Laboratory Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Building className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p>{lab.building}</p>
                {lab.floor && lab.room && (
                  <p className="text-sm text-muted-foreground">
                    Floor {lab.floor}, Room {lab.room}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0" />
              <p>Operating Hours: {lab.hours}</p>
            </div>
            
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0" />
              <p>Capacity: {lab.capacity} students</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Available Equipment</h4>
              <div className="flex flex-wrap gap-2">
                {lab.equipment.map((item, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10">{item}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Schedule</h3>
          
          {lab.schedule ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="py-2 px-3 text-left text-sm">Day</th>
                    <th className="py-2 px-3 text-left text-sm">Available Times</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {lab.schedule.map((day, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                      <td className="py-2 px-3">{day.day}</td>
                      <td className="py-2 px-3">
                        {day.slots.map((slot, i) => (
                          <span key={i} className="block text-sm">{slot}</span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No schedule information available</p>
          )}
          
          <div className="mt-5">
            <h4 className="font-medium mb-2">Lab Staff</h4>
            <div className="space-y-3">
              {lab.assistants.map((assistant) => (
                <div key={assistant.id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={assistant.avatar} />
                    <AvatarFallback>{assistant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{assistant.name}</p>
                    <p className="text-sm text-muted-foreground">{assistant.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        {isAdmin && (
          <Select 
            defaultValue={lab.status}
            onValueChange={(value) => onStatusChange(lab.id, value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button>Book Laboratory</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default LabDetails;