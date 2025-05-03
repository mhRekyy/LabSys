import React from "react";
import { motion } from "framer-motion";
import { useLabFilters } from "./LabFilteringProvider";
import SearchFilter from "@/components/laboratories/filters/SearchFilter";
import FilterToggleButton from "@/components/laboratories/filters/FilterToggleButton";
import BuildingFilter from "@/components/laboratories/filters/BuildingFilter";
import FloorFilter from "@/components/laboratories/filters/FloorFilter";
import TypeFilter from "@/components/laboratories/filters/TypeFilter";
import StatusFilter from "@/components/laboratories/filters/StatusFilter";
import LabTypeCheckboxes from "@/components/laboratories/filters/LabTypeCheckboxes";
import Laboratories from './../../pages/Laboratories';

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
        <SearchFilter 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <FilterToggleButton 
          showFilters={showFilters} 
          setShowFilters={setShowFilters} 
        />
      </div>
      
      {showFilters && (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <BuildingFilter 
            buildingFilter={buildingFilter}
            setBuildingFilter={setBuildingFilter}
            buildings={filterOptions.buildings}
          />

          <FloorFilter 
            floorFilter={floorFilter}
            setFloorFilter={setFloorFilter}
            floors={filterOptions.floors}
          />

          <TypeFilter 
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            types={filterOptions.types}
          />

          <StatusFilter
            selectedFilters={selectedFilters as { open: boolean; closed: boolean }}
            toggleFilter={toggleFilter}
          />

          
          <LabTypeCheckboxes 
            selectedFilters={selectedFilters}
            toggleFilter={toggleFilter}
          />
        </motion.div>
      )}
    </>
  );
};

export default LabFilters;