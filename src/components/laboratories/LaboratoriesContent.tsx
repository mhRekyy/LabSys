import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { Lab } from "@/components/laboratories/types";
import { useLabFilters } from "@/components/laboratories/LabFilteringProvider";
import LabTabsContent from "@/components/laboratories/LabTabsContent";
import LaboratoriesHeader from "@/components/laboratories/LaboratoriesHeader";
import { useAuth } from "@/contexts/AuthContext";
import LabFilters from "@/components/laboratories/LabFilters";
import LabDetailsDialog from "./LabDetailsDialog";
import LabBookingDialog from "./LabBookingDialog";

const LaboratoriesContent: React.FC = () => {
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [showLabDetails, setShowLabDetails] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const { setFilter, setLaboratories } = useLabFilters();
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  useEffect(() => {
    // Check for filter parameter in URL
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter");
    if (filterParam) {
      setFilter(filterParam);
    }
  }, [location.search, setFilter]);
  
  const handleLabCardClick = (lab: Lab) => {
    setSelectedLab(lab);
    setShowLabDetails(true);
  };

  const handleStatusChange = (labId: number, newStatus: string) => {
    if (!isAdmin) {
      toast.error("You don't have permission to change lab status");
      return;
    }
    
    setLaboratories(labs => 
      labs.map(lab => 
        lab.id === labId ? { ...lab, status: newStatus } : lab
      )
    );
    toast.success(`Lab status updated to ${newStatus}`);
  };
  
  const handleBookLab = (lab: Lab) => {
    setSelectedLab(lab);
    setShowLabDetails(false);
    setShowBookingDialog(true);
  };

  return (
    <>
      <LaboratoriesHeader />
      
      <LabFilters />
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
        <TabsList className="grid grid-cols-3 w-full sm:w-auto mb-4">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All Labs</TabsTrigger>
          <TabsTrigger value="open" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Open Now</TabsTrigger>
          <TabsTrigger value="building" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Engineering</TabsTrigger>
        </TabsList>
        
        <LabTabsContent 
          onLabClick={handleLabCardClick}
          onStatusChange={handleStatusChange}
        />
      </Tabs>

      {/* Lab Details Dialog */}
      <LabDetailsDialog
        open={showLabDetails}
        onOpenChange={setShowLabDetails}
        selectedLab={selectedLab}
        onStatusChange={handleStatusChange}
        onBookLab={handleBookLab}
      />
      
      {/* Booking Dialog */}
      <LabBookingDialog
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        selectedLab={selectedLab}
        onBookingSubmit={() => {}}
      />
    </>
  );
};

export default LaboratoriesContent;