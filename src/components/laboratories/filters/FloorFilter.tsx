import React from "react";
import { Layers } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FloorFilterProps {
  floorFilter: string;
  setFloorFilter: (floor: string) => void;
  floors: string[];
}

const FloorFilter: React.FC<FloorFilterProps> = ({ 
  floorFilter, 
  setFloorFilter,
  floors
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <Layers className="h-4 w-4 mr-1.5 text-muted-foreground" />
        Floor
      </h3>
      <Select value={floorFilter} onValueChange={setFloorFilter}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All Floors" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Floors</SelectItem>
          {floors.map((floor) => (
            <SelectItem key={floor} value={floor}>Floor {floor}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FloorFilter;