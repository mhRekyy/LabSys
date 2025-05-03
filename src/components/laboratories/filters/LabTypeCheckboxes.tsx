import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface LabTypeCheckboxesProps {
  selectedFilters: {
    [key: string]: boolean;
  };
  toggleFilter: (filterName: string) => void;
}

const LabTypeCheckboxes: React.FC<LabTypeCheckboxesProps> = ({ 
  selectedFilters, 
  toggleFilter 
}) => {
  const labTypes = [
    { id: "computer", label: "Computer" },
    { id: "science", label: "Science" },
    { id: "engineering", label: "Engineering" },
    { id: "biology", label: "Biology" },
    { id: "electronics", label: "Electronics" }
  ];

  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-4">
      <h3 className="text-sm font-medium mb-2">Lab Type</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {labTypes.map(type => (
          <div key={type.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`filter-${type.id}`} 
              checked={selectedFilters[type.id]}
              onCheckedChange={() => toggleFilter(type.id)}
            />
            <label htmlFor={`filter-${type.id}`} className="text-sm">{type.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabTypeCheckboxes;