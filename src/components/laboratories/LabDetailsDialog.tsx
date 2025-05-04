import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Lab } from "./types";
import LabDetails from "./LabDetails";

interface LabDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLab: Lab | null;
  onStatusChange: (labId: number, newStatus: string) => void;
  onBookLab: (lab: Lab) => void;
}

const LabDetailsDialog: React.FC<LabDetailsDialogProps> = ({ 
  open, 
  onOpenChange, 
  selectedLab,
  onStatusChange,
  onBookLab
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        {selectedLab && (
          <LabDetails 
            lab={selectedLab}
            onStatusChange={onStatusChange}
            onBookLab={() => onBookLab(selectedLab)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LabDetailsDialog;