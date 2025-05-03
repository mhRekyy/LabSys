import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface StatusFilterProps {
  selectedFilters: {
    open: boolean; 
    closed: boolean; 
  };
  toggleFilter: (filterName: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ selectedFilters, toggleFilter }) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Status</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="filter-open" 
            checked={selectedFilters.open}
            onCheckedChange={() => toggleFilter("open")}
          />
          <label htmlFor="filter-open" className="text-sm">Open</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="filter-closed" 
            checked={selectedFilters.closed}
            onCheckedChange={() => toggleFilter("closed")}
          />
          <label htmlFor="filter-closed" className="text-sm">Closed</label>
        </div>
      </div>
    </div>
  );
};

export default StatusFilter;