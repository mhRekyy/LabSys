import React from "react";
import { Building } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BuildingFilterProps {
  buildingFilter: string;
  setBuildingFilter: (building: string) => void;
  buildings: string[];
}

const BuildingFilter: React.FC<BuildingFilterProps> = ({ 
  buildingFilter, 
  setBuildingFilter,
  buildings
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <Building className="h-4 w-4 mr-1.5 text-muted-foreground" />
        Building
      </h3>
      <Select value={buildingFilter} onValueChange={setBuildingFilter}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All Buildings" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Buildings</SelectItem>
          {buildings.map((building) => (
            <SelectItem key={building} value={building}>{building}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BuildingFilter;