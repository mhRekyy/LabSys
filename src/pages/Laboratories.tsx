import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LabCard from "@/components/laboratories/LabCard";
import LabFilters from "@/components/laboratories/LabFilters";
import LabDetails from "@/components/laboratories/LabDetails";
import EmptyLabState from "@/components/laboratories/EmptyLabState";
import { Lab } from "@/components/laboratories/types";

// Mock data for laboratories
const INITIAL_LABS = [
  {
    id: 1,
    name: "Computer Science Lab",
    building: "Engineering Building",
    floor: 2,
    room: "E2.15",
    status: "open",
    type: "computer",
    description: "Main laboratory for computer science students with high-performance workstations and specialized software for programming and software development.",
    hours: "08:00 - 20:00",
    capacity: 30,
    assistants: [
      { id: 1, name: "Alex Johnson", role: "Head Assistant", avatar: "https://i.pravatar.cc/150?img=1" },
      { id: 2, name: "Maria Garcia", role: "Technical Assistant", avatar: "https://i.pravatar.cc/150?img=5" }
    ],
    equipment: ["Workstations", "Servers", "Network Equipment", "IoT Devices"],
    rating: 4.8,
    schedule: [
      { day: "Monday", slots: ["09:00 - 11:00", "14:00 - 16:00"] },
      { day: "Tuesday", slots: ["10:00 - 12:00", "15:00 - 17:00"] },
      { day: "Wednesday", slots: ["09:00 - 11:00", "13:00 - 15:00"] },
      { day: "Thursday", slots: ["11:00 - 13:00", "16:00 - 18:00"] },
      { day: "Friday", slots: ["09:00 - 12:00"] }
    ]
  },
  {
    id: 2,
    name: "Physics Laboratory",
    building: "Science Center",
    floor: 1,
    room: "S1.05",
    status: "open",
    type: "science",
    description: "Physics lab equipped with instruments for mechanics, electricity, magnetism, and optical experiments.",
    hours: "09:00 - 18:00",
    capacity: 24,
    assistants: [
      { id: 3, name: "John Smith", role: "Senior Assistant", avatar: "https://i.pravatar.cc/150?img=3" },
      { id: 4, name: "Emily Davis", role: "Lab Technician", avatar: "https://i.pravatar.cc/150?img=8" }
    ],
    equipment: ["Oscilloscopes", "Wave Generators", "Optical Benches", "Force Sensors"],
    rating: 4.5
  },
  {
    id: 3,
    name: "Electronics Workshop",
    building: "Engineering Building",
    floor: 3,
    room: "E3.22",
    status: "closed",
    type: "electronics",
    description: "Electronics lab for circuit design, microcontroller programming, and electronics prototyping projects.",
    hours: "10:00 - 19:00",
    capacity: 20,
    assistants: [
      { id: 5, name: "Robert Chen", role: "Lab Coordinator", avatar: "https://i.pravatar.cc/150?img=12" },
      { id: 6, name: "Sofia Patel", role: "Assistant", avatar: "https://i.pravatar.cc/150?img=20" }
    ],
    equipment: ["PCB Fabrication", "Soldering Stations", "Multimeters", "Power Supplies"],
    rating: 4.7
  },
  {
    id: 4,
    name: "Biotechnology Laboratory",
    building: "Life Sciences Building",
    floor: 2,
    room: "L2.08",
    status: "open",
    type: "biology",
    description: "Advanced biotechnology lab with equipment for DNA analysis, cell culture, and biochemical experiments.",
    hours: "08:30 - 17:30",
    capacity: 18,
    assistants: [
      { id: 7, name: "Laura Kim", role: "Research Assistant", avatar: "https://i.pravatar.cc/150?img=9" },
      { id: 8, name: "David Wong", role: "Lab Assistant", avatar: "https://i.pravatar.cc/150?img=15" }
    ],
    equipment: ["Centrifuges", "PCR Machines", "Microscopes", "Incubators"],
    rating: 4.9
  },
  {
    id: 5,
    name: "Mechanical Engineering Lab",
    building: "Engineering Building",
    floor: 1,
    room: "E1.10",
    status: "open",
    type: "engineering",
    description: "Mechanical engineering lab with equipment for material testing, thermodynamics, and fluid mechanics experiments.",
    hours: "09:00 - 19:00",
    capacity: 25,
    assistants: [
      { id: 9, name: "Michael Brown", role: "Senior Assistant", avatar: "https://i.pravatar.cc/150?img=11" },
      { id: 10, name: "Sarah Johnson", role: "Lab Technician", avatar: "https://i.pravatar.cc/150?img=21" }
    ],
    equipment: ["CNC Machines", "Material Testers", "Hydraulic Systems", "3D Printers"],
    rating: 4.6
  }
];

const Laboratories = () => {
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
  const [laboratories, setLaboratories] = useState(INITIAL_LABS);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [showLabDetails, setShowLabDetails] = useState(false);
  const { isAdmin } = useAuth();
  
  const handleLabCardClick = (lab: Lab) => {
    setSelectedLab(lab);
    setShowLabDetails(true);
  };

  const handleStatusChange = (labId: number, newStatus: string) => {
    setLaboratories(labs => 
      labs.map(lab => 
        lab.id === labId ? { ...lab, status: newStatus } : lab
      )
    );
    toast.success(`Lab status updated to ${newStatus}`);
  };
  
  const filteredLabs = laboratories.filter(lab => {
    // Filter by search query
    const matchesSearch = lab.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lab.building.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status and type
    const matchesStatus = selectedFilters[lab.status];
    const matchesType = selectedFilters[lab.type];
    
    // Apply tab filter if not "all"
    const matchesTab = filter === "all" || 
                      (filter === "open" && lab.status === "open") ||
                      (filter === "building" && lab.building === "Engineering Building");
    
    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });
  
  const toggleFilter = (filterName: string) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterName]: !selectedFilters[filterName]
    });
  };
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Laboratories</h1>
          <p className="text-muted-foreground mt-1">
            Browse and access campus laboratories and their information.
          </p>
        </div>
        <Button className="w-full sm:w-auto" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Request Lab Access
        </Button>
      </div>
      
      <LabFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        selectedFilters={selectedFilters}
        toggleFilter={toggleFilter}
      />
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
        <TabsList className="grid grid-cols-3 w-full sm:w-auto mb-4">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All Labs</TabsTrigger>
          <TabsTrigger value="open" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Open Now</TabsTrigger>
          <TabsTrigger value="building" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Engineering</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {filteredLabs.length === 0 ? (
            <EmptyLabState />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLabs.map((lab) => (
                <LabCard 
                  key={lab.id} 
                  lab={lab} 
                  onClick={handleLabCardClick}
                  isAdmin={isAdmin()}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="open" className="mt-0">
          {filteredLabs.length === 0 ? (
            <EmptyLabState message="No open laboratories found" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLabs.map((lab) => (
                <LabCard 
                  key={lab.id} 
                  lab={lab} 
                  onClick={handleLabCardClick}
                  isAdmin={isAdmin()}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="building" className="mt-0">
          {filteredLabs.length === 0 ? (
            <EmptyLabState message="No engineering laboratories found" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLabs.map((lab) => (
                <LabCard 
                  key={lab.id} 
                  lab={lab} 
                  onClick={handleLabCardClick}
                  isAdmin={isAdmin()}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Lab Details Dialog */}
      <Dialog open={showLabDetails} onOpenChange={setShowLabDetails}>
        {selectedLab && (
          <LabDetails 
            lab={selectedLab}
            isAdmin={isAdmin()}
            onStatusChange={handleStatusChange}
          />
        )}
      </Dialog>
    </motion.div>
  );
};

export default Laboratories;