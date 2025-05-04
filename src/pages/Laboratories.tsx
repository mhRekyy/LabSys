import React from "react";
import { motion } from "framer-motion";
import { LabFilterProvider } from "@/components/laboratories/LabFilteringProvider";
import LaboratoriesContent from "@/components/laboratories/LaboratoriesContent";

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

const Laboratories: React.FC = () => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <LabFilterProvider initialLabs={INITIAL_LABS}>
        <LaboratoriesContent />
      </LabFilterProvider>
    </motion.div>
  );
};

export default Laboratories;