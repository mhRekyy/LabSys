import React from "react";
import { Filter, Search, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

interface LabFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedFilters: {
    [key: string]: boolean;
  };
  toggleFilter: (filterName: string) => void;
}

const LabFilters: React.FC<LabFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  selectedFilters,
  toggleFilter
}) => {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search laboratories..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          className="w-full sm:w-auto h-10"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          <span className="ml-2">Filters</span>
        </Button>
      </div>
      
      {showFilters && (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
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
          
          <div className="col-span-1 sm:col-span-3">
            <h3 className="text-sm font-medium mb-2">Lab Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-computer" 
                  checked={selectedFilters.computer}
                  onCheckedChange={() => toggleFilter("computer")}
                />
                <label htmlFor="filter-computer" className="text-sm">Computer</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-science" 
                  checked={selectedFilters.science}
                  onCheckedChange={() => toggleFilter("science")}
                />
                <label htmlFor="filter-science" className="text-sm">Science</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-engineering" 
                  checked={selectedFilters.engineering}
                  onCheckedChange={() => toggleFilter("engineering")}
                />
                <label htmlFor="filter-engineering" className="text-sm">Engineering</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-biology" 
                  checked={selectedFilters.biology}
                  onCheckedChange={() => toggleFilter("biology")}
                />
                <label htmlFor="filter-biology" className="text-sm">Biology</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-electronics" 
                  checked={selectedFilters.electronics}
                  onCheckedChange={() => toggleFilter("electronics")}
                />
                <label htmlFor="filter-electronics" className="text-sm">Electronics</label>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default LabFilters;