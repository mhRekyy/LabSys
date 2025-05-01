import React from "react";
import { Filter, Search, Building, Layers, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLabFilters } from "./LabFilteringProvider";

const LabFilters: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    selectedFilters,
    toggleFilter,
    buildingFilter,
    setBuildingFilter,
    floorFilter,
    setFloorFilter,
    typeFilter,
    setTypeFilter,
    filterOptions
  } = useLabFilters();

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search laboratories" 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          className="w-full sm:w-40 h-10"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          <span className="ml-2">Filters</span>
        </Button>
      </div>
      
      {showFilters && (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
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
                {filterOptions.buildings.map((building) => (
                  <SelectItem key={building} value={building}>{building}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                {filterOptions.floors.map((floor) => (
                  <SelectItem key={floor} value={floor}>Floor {floor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                {filterOptions.types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
          
          <div className="col-span-1 sm:col-span-2 lg:col-span-4">
            <h3 className="text-sm font-medium mb-2">Lab Type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
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