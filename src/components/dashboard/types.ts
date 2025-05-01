export interface ActivityDataItem {
    name: string;
    value: number;
  }
  
  export interface EquipmentUsageItem {
    name: string;
    value: number;
  }
  
  export interface BookingItem {
    id: number;
    lab: string;
    equipment: string;
    date: string;
    time: string;
    status: "confirmed" | "pending";
  }
  
  export interface AlertItem {
    id: number;
    title: string;
    description: string;
    time: string;
    type: "warning" | "info";
  }
  
  // Adding lab building, floor and room types for filtering
  export interface BuildingInfo {
    name: string;
    floors: number[];
  }
  
  export interface LabFilterOptions {
    buildings: string[];
    floors: string[];
    types: string[];
  }