
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Building, MapPin, Clock, Users, ChevronRight, Search, Filter, Microscope, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Mock data for laboratories
const laboratories = [
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
    rating: 4.8
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

// Lab card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  hover: { 
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { type: "spring", stiffness: 400, damping: 20 }
  }
};

const LabCard = ({ lab, onClick }) => {
  const statusColors = {
    open: "bg-green-500",
    closed: "bg-red-500",
    maintenance: "bg-yellow-500"
  };
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div className={`absolute top-0 left-0 right-0 h-1 ${statusColors[lab.status]}`}></div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <Badge className={`mb-2 ${lab.status === 'open' ? 'bg-green-500' : lab.status === 'closed' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                {lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
              </Badge>
              <CardTitle className="text-xl flex items-center">
                {lab.name}
              </CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {lab.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start">
              <Building className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm">{lab.building}</p>
                {lab.floor && lab.room && (
                  <p className="text-xs text-muted-foreground">
                    Floor {lab.floor}, Room {lab.room}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
              <p className="text-sm">{lab.hours}</p>
            </div>
            
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
              <p className="text-sm">Capacity: {lab.capacity} students</p>
            </div>
            
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-amber-500 flex-shrink-0" />
              <p className="text-sm">{lab.rating} / 5.0</p>
            </div>
            
            <div className="flex mt-2">
              <p className="text-xs font-medium text-muted-foreground mr-2">Lab Assistants:</p>
              <div className="flex -space-x-2">
                {lab.assistants.map((assistant) => (
                  <HoverCard key={assistant.id}>
                    <HoverCardTrigger>
                      <Avatar className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={assistant.avatar} />
                        <AvatarFallback>{assistant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64">
                      <div className="flex justify-between space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={assistant.avatar} />
                          <AvatarFallback>{assistant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">{assistant.name}</h4>
                          <p className="text-xs text-muted-foreground">{assistant.role}</p>
                          <div className="flex items-center pt-1">
                            <span className="text-xs text-muted-foreground">Available now</span>
                            <span className="ml-1 h-2 w-2 rounded-full bg-green-500"></span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 flex justify-end">
          <Button variant="ghost" size="sm" className="text-primary gap-1">
            View Details <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

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
  
  const handleLabCardClick = (lab) => {
    toast.info(`Viewing details for ${lab.name}`);
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
  
  const toggleFilter = (filterName) => {
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
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search laboratories..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          className="w-full sm:w-auto h-10"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          <span className="ml-2">Filters</span>
        </Button>
      </div>
      
      {showFilters && (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div>
            <h3 className="text-sm font-medium mb-2">Status</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-open" 
                  checked={selectedFilters.open}
                  onCheckedChange={() => toggleFilter("open")}
                />
                <label htmlFor="filter-open" className="text-sm">Open</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-closed" 
                  checked={selectedFilters.closed}
                  onCheckedChange={() => toggleFilter("closed")}
                />
                <label htmlFor="filter-closed" className="text-sm">Closed</label>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 sm:col-span-3">
            <h3 className="text-sm font-medium mb-2">Lab Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-computer" 
                  checked={selectedFilters.computer}
                  onCheckedChange={() => toggleFilter("computer")}
                />
                <label htmlFor="filter-computer" className="text-sm">Computer</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-science" 
                  checked={selectedFilters.science}
                  onCheckedChange={() => toggleFilter("science")}
                />
                <label htmlFor="filter-science" className="text-sm">Science</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-engineering" 
                  checked={selectedFilters.engineering}
                  onCheckedChange={() => toggleFilter("engineering")}
                />
                <label htmlFor="filter-engineering" className="text-sm">Engineering</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-biology" 
                  checked={selectedFilters.biology}
                  onCheckedChange={() => toggleFilter("biology")}
                />
                <label htmlFor="filter-biology" className="text-sm">Biology</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-electronics" 
                  checked={selectedFilters.electronics}
                  onCheckedChange={() => toggleFilter("electronics")}
                />
                <label htmlFor="filter-electronics" className="text-sm">Electronics</label>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
        <TabsList className="grid grid-cols-3 w-full sm:w-auto mb-4">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All Labs</TabsTrigger>
          <TabsTrigger value="open" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Open Now</TabsTrigger>
          <TabsTrigger value="building" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Engineering</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {filteredLabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Microscope className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium">No laboratories found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLabs.map((lab) => (
                <LabCard key={lab.id} lab={lab} onClick={() => handleLabCardClick(lab)} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="open" className="mt-0">
          {filteredLabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Microscope className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium">No open laboratories found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLabs.map((lab) => (
                <LabCard key={lab.id} lab={lab} onClick={() => handleLabCardClick(lab)} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="building" className="mt-0">
          {filteredLabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Microscope className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium">No engineering laboratories found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLabs.map((lab) => (
                <LabCard key={lab.id} lab={lab} onClick={() => handleLabCardClick(lab)} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Laboratories;
