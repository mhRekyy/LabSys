import React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterToggleButtonProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const FilterToggleButton: React.FC<FilterToggleButtonProps> = ({ 
  showFilters, 
  setShowFilters 
}) => {
  return (
    <Button 
      variant="outline" 
      size="icon"
      className="w-full sm:w-40 h-10"
      onClick={() => setShowFilters(!showFilters)}
    >
      <Filter className="h-4 w-4 mr-2" />
      <span className="ml-2">Filters</span>
    </Button>
  );
};

export default FilterToggleButton;