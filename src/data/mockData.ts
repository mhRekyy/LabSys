
import { Item, Category, Location, DashboardStats } from "@/types/inventory";

export const categories: Category[] = [
  { id: "cat1", name: "Electronics", color: "#3B82F6" },
  { id: "cat2", name: "Furniture", color: "#10B981" },
  { id: "cat3", name: "Books", color: "#F59E0B" },
  { id: "cat4", name: "Lab Equipment", color: "#8B5CF6" },
  { id: "cat5", name: "Sports", color: "#EC4899" },
  { id: "cat6", name: "Office Supplies", color: "#6366F1" },
];

export const locations: Location[] = [
  { id: "loc1", name: "Main Library", building: "Library Building", floor: "2", room: "201" },
  { id: "loc2", name: "Computer Lab", building: "Tech Building", floor: "1", room: "105" },
  { id: "loc3", name: "Science Lab", building: "Science Building", floor: "3", room: "302" },
  { id: "loc4", name: "Admin Office", building: "Administration", floor: "1", room: "101" },
  { id: "loc5", name: "Gymnasium", building: "Sports Complex", floor: "1", room: "Main Hall" },
  { id: "loc6", name: "Student Lounge", building: "Student Center", floor: "2", room: "210" },
];

export const inventoryItems: Item[] = [
  {
    id: "item1",
    name: "Dell Laptop XPS 15",
    description: "High-performance laptop for student use",
    category: categories[0],
    location: locations[1],
    quantity: 25,
    condition: "Good",
    purchaseDate: "2023-06-15",
    purchasePrice: 1299.99,
    serialNumber: "DL-XPS15-2023-001",
    model: "XPS 15",
    manufacturer: "Dell",
    imageUrl: "/placeholder.svg",
    lastUpdated: "2023-12-10T14:30:00Z"
  },
  {
    id: "item2",
    name: "Classroom Chair",
    description: "Standard classroom chair with desk attachment",
    category: categories[1],
    location: locations[3],
    quantity: 150,
    condition: "Good",
    purchaseDate: "2022-08-03",
    purchasePrice: 89.99,
    model: "ClassicDesk-01",
    manufacturer: "Education Furnishings",
    imageUrl: "/placeholder.svg",
    lastUpdated: "2023-10-05T09:15:00Z"
  },
  {
    id: "item3",
    name: "Chemistry Textbooks",
    description: "Advanced Chemistry textbooks for senior classes",
    category: categories[2],
    location: locations[0],
    quantity: 35,
    condition: "Excellent",
    purchaseDate: "2024-01-10",
    purchasePrice: 129.99,
    imageUrl: "/placeholder.svg",
    lastUpdated: "2024-01-15T11:20:00Z"
  },
  {
    id: "item4",
    name: "Microscope Set",
    description: "Digital microscopes for biology lab",
    category: categories[3],
    location: locations[2],
    quantity: 12,
    condition: "Excellent",
    purchaseDate: "2023-11-20",
    purchasePrice: 649.99,
    serialNumber: "MS-DIG-2023-001",
    model: "BioView X500",
    manufacturer: "LabTech",
    imageUrl: "/placeholder.svg",
    lastUpdated: "2023-11-25T10:45:00Z"
  },
  {
    id: "item5",
    name: "Basketball",
    description: "Professional basketballs for gym class",
    category: categories[4],
    location: locations[4],
    quantity: 18,
    condition: "Good",
    purchaseDate: "2023-09-05",
    purchasePrice: 39.99,
    model: "Pro Bounce 2.0",
    manufacturer: "SportsMaster",
    imageUrl: "/placeholder.svg",
    lastUpdated: "2023-09-10T16:30:00Z"
  },
  {
    id: "item6",
    name: "Printer Paper",
    description: "Standard white printer paper, A4 size",
    category: categories[5],
    location: locations[3],
    quantity: 200,
    condition: "Excellent",
    purchaseDate: "2024-02-01",
    purchasePrice: 4.99,
    model: "MultiPrint A4",
    manufacturer: "PaperCo",
    notes: "Bulk purchase - 200 reams",
    imageUrl: "/placeholder.svg",
    lastUpdated: "2024-02-02T13:15:00Z"
  },
  {
    id: "item7",
    name: "Projector",
    description: "HD Projector for classrooms",
    category: categories[0],
    location: locations[1],
    quantity: 8,
    condition: "Fair",
    purchaseDate: "2022-03-15",
    purchasePrice: 799.99,
    serialNumber: "PROJ-HD-2022-008",
    model: "ViewMax 4K",
    manufacturer: "OptiTech",
    notes: "Some units need bulb replacement",
    imageUrl: "/placeholder.svg",
    lastUpdated: "2023-08-12T09:45:00Z"
  },
  {
    id: "item8",
    name: "Study Desk",
    description: "Individual study desks for library",
    category: categories[1],
    location: locations[0],
    quantity: 30,
    condition: "Good",
    purchaseDate: "2022-07-25",
    purchasePrice: 219.99,
    model: "StudyStation Pro",
    manufacturer: "Education Furnishings",
    imageUrl: "/placeholder.svg",
    lastUpdated: "2022-08-01T15:20:00Z"
  }
];

export const dashboardStats: DashboardStats = {
  totalItems: 8,
  totalCategories: 6,
  totalLocations: 6,
  recentlyAdded: 3,
  lowStock: 2
};
