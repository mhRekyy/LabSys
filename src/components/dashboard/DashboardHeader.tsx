import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Sliders } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  onShareClick: () => void;
  onCustomizeClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onShareClick,
  onCustomizeClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Welcome to LabSys
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your laboratory activities and equipment borrowing.
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
