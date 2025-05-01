import React, { createContext, useState, useMemo, useContext } from "react";
import { Lab } from "@/components/laboratories/types";
import { LabFilterOptions } from "@/components/dashboard/types";

interface LabFilterContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedFilters: {
    [key: string]: boolean;
  };
  toggleFilter: (filterName: string) => void;
  buildingFilter: string;
  setBuildingFilter: (building: string) => void;
  floorFilter: string; 
  setFloorFilter: (floor: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  filterOptions: LabFilterOptions;
  filteredLabs: Lab[];
  laboratories: Lab[];
  setLaboratories: React.Dispatch<React.SetStateAction<Lab[]>>;
}

const LabFilterContext = createContext<LabFilterContextType | undefined>(undefined);

export const useLabFilters = () => {
  const context = useContext(LabFilterContext);
  if (!context) {
    throw new Error("useLabFilters must be used within a LabFilterProvider");
  }
  return context;
};

interface LabFilterProviderProps {
  children: React.ReactNode;
  initialLabs: Lab[];
}

export const LabFilterProvider: React.FC<LabFilterProviderProps> = ({ 
  children, 
  initialLabs 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    open: true,
    closed: true,
    computer: true,
    science: true,
    engineering: true,
    biology: true,
    electronics: true
  });
  const [buildingFilter, setBuildingFilter] = useState("all");
  const [floorFilter, setFloorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [laboratories, setLaboratories] = useState(initialLabs);
  
  // Extract unique filter options
  const filterOptions = useMemo<LabFilterOptions>(() => {
    const buildings = Array.from(new Set(laboratories.map(lab => lab.building)));
    const floors = Array.from(new Set(laboratories.map(lab => lab.floor.toString())));
    const types = Array.from(new Set(laboratories.map(lab => lab.type)));
    
    return { buildings, floors, types };
  }, [laboratories]);
  
  const toggleFilter = (filterName: string) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterName]: !selectedFilters[filterName]
    });
  };
  
  const filteredLabs = useMemo(() => {
    return laboratories.filter(lab => {
      // Filter by search query
      const matchesSearch = lab.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lab.building.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status and type (checkboxes)
      const matchesStatus = selectedFilters[lab.status];
      const matchesType = selectedFilters[lab.type];
      
      // Filter by building
      const matchesBuilding = buildingFilter === "all" || lab.building === buildingFilter;
      
      // Filter by floor
      const matchesFloor = floorFilter === "all" || lab.floor.toString() === floorFilter;
      
      // Filter by type dropdown
      const matchesTypeDropdown = typeFilter === "all" || lab.type === typeFilter;
      
      // Apply tab filter if not "all"
      const matchesTab = filter === "all" || 
                        (filter === "open" && lab.status === "open") ||
                        (filter === "building" && lab.building === "Engineering Building");
      
      return matchesSearch && 
             matchesStatus && 
             matchesType && 
             matchesTab && 
             matchesBuilding && 
             matchesFloor &&
             matchesTypeDropdown;
    });
  }, [
    laboratories, 
    searchQuery, 
    selectedFilters, 
    filter, 
    buildingFilter, 
    floorFilter, 
    typeFilter
  ]);

  const value = {
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
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
    filterOptions,
    filteredLabs,
    laboratories,
    setLaboratories
  };

  return (
    <LabFilterContext.Provider value={value}>
      {children}
    </LabFilterContext.Provider>
  );
};