import React from "react";
import { Microscope } from "lucide-react";

interface EmptyLabStateProps {
  message?: string;
  subMessage?: string;
}

const EmptyLabState: React.FC<EmptyLabStateProps> = ({ 
  message = "No laboratories found", 
  subMessage = "Try adjusting your search or filters" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Microscope className="h-16 w-16 text-muted-foreground/40 mb-4" />
      <h3 className="text-lg font-medium">{message}</h3>
      <p className="text-muted-foreground mt-1">{subMessage}</p>
    </div>
  );
};

export default EmptyLabState;