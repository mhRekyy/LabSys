import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import LabGrid from "./LabGrid";
import { Lab } from "./types";
import { useLabFilters } from "./LabFilteringProvider";

interface LabTabsContentProps {
  onLabClick: (lab: Lab) => void;
  onStatusChange: (labId: number, newStatus: string) => void;
}

const LabTabsContent: React.FC<LabTabsContentProps> = ({ onLabClick, onStatusChange }) => {
  const { filteredLabs } = useLabFilters();
  
  return (
    <>
      <TabsContent value="all" className="mt-0">
        <LabGrid 
          labs={filteredLabs}
          onLabClick={onLabClick}
          onStatusChange={onStatusChange}
        />
      </TabsContent>
      
      <TabsContent value="open" className="mt-0">
        <LabGrid 
          labs={filteredLabs}
          onLabClick={onLabClick}
          onStatusChange={onStatusChange}
          emptyMessage="No open laboratories found"
        />
      </TabsContent>
      
      <TabsContent value="building" className="mt-0">
        <LabGrid 
          labs={filteredLabs}
          onLabClick={onLabClick}
          onStatusChange={onStatusChange}
          emptyMessage="No engineering laboratories found"
        />
      </TabsContent>
    </>
  );
};

export default LabTabsContent;