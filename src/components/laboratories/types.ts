export interface LabAssistant {
    id: number;
    name: string;
    role: string;
    avatar: string;
  }
  
  export interface LabScheduleDay {
    day: string;
    slots: string[];
  }
  
  export interface Lab {
    id: number;
    name: string;
    building: string;
    floor: number;
    room: string;
    status: string;
    type: string;
    description: string;
    hours: string;
    capacity: number;
    assistants: LabAssistant[];
    equipment: string[];
    rating: number;
    schedule?: LabScheduleDay[];
  }