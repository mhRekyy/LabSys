import React from "react";
import { Grid3X3 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TypeFilterProps {
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  types: string[];
}

const TypeFilter: React.FC<TypeFilterProps> = ({ 
  typeFilter, 
  setTypeFilter,
  types
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <Grid3X3 className="h-4 w-4 mr-1.5 text-muted-foreground" />
        Lab Type
      </h3>
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {types.map((type) => (
            <SelectItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TypeFilter;
