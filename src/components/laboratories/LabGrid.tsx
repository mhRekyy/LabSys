import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Lab } from "./types";
import LabCard from "./LabCard";
import EmptyLabState from "./EmptyLabState";

interface LabGridProps {
  labs: Lab[];
  onLabClick: (lab: Lab) => void;
  onStatusChange: (labId: number, newStatus: string) => void;
  emptyMessage?: string;
}

const LabGrid: React.FC<LabGridProps> = ({ 
  labs, 
  onLabClick, 
  onStatusChange,
  emptyMessage 
}) => {
  const { isAdmin } = useAuth();

  if (labs.length === 0) {
    return <EmptyLabState message={emptyMessage} />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {labs.map((lab) => (
        <LabCard 
          key={lab.id} 
          lab={lab} 
          onClick={onLabClick}
          isAdmin={isAdmin()}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default LabGrid;