import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const LaboratoriesHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Laboratories</h1>
        <p className="text-muted-foreground mt-1">
          Browse and access campus laboratories and their information.
        </p>
      </div>
      {/* <Button className="w-full sm:w-auto" size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Request Lab Access
      </Button> */}
    </div>
  );
};

export default LaboratoriesHeader;
