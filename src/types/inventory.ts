
export interface Item {
  id: string;
  name: string;
  description: string;
  category: Category;
  location: Location;
  quantity: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  purchaseDate?: string;
  purchasePrice?: number;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  notes?: string;
  imageUrl?: string;
  lastUpdated: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Location {
  id: string;
  name: string;
  building: string;
  floor?: string;
  room?: string;
}

export interface DashboardStats {
  totalItems: number;
  totalCategories: number;
  totalLocations: number;
  recentlyAdded: number;
  lowStock: number;
}
