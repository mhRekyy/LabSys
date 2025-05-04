import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LaboratoriesHeaderProps {
  onFilterToggle?: () => void;
  onAddLab?: () => void;
}

const LaboratoriesHeader: React.FC<LaboratoriesHeaderProps> = ({
  onFilterToggle,
  onAddLab
}) => {
  const { isAdmin } = useAuth();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Laboratories
        </h1>
        <p className="text-muted-foreground">
          Explore and book laboratories for your academic activities
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* <Button variant="outline" size="sm" onClick={onFilterToggle}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        
        {isAdmin && (
          <Button size="sm" onClick={onAddLab}>
            <Plus className="h-4 w-4 mr-2" />
            Add Laboratory
          </Button>
        )} */}
      </div>
    </div>
  );
};

export default LaboratoriesHeader;