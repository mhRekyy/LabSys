import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search, Plus, Filter, MoreVertical, Edit, Trash2, Package, MapPin, History, CirclePlus, Eye
} from "lucide-react";
import { inventoryItems, categories, locations } from "@/data/mockData";
import { Item } from "@/types/inventory";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import AddItemDialog from "@/components/inventory/AddItemDialog";
import ViewItemDialog from "@/components/inventory/ViewItemDialog";

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showBorrowDialog, setShowBorrowDialog] = useState(false);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [showViewItemDialog, setShowViewItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const { isAdmin, studentNpm } = useAuth();

  // Load inventory items
  useEffect(() => {
    // Check if there are locally stored inventory items first
    const localStorageKey = 'inventoryItems';
    const storedItems = localStorage.getItem(localStorageKey);
    
    if (storedItems) {
      // Use data from localStorage if available
      setItems(JSON.parse(storedItems));
    } else {
      // Fall back to mock data
      setItems(inventoryItems);
      // Initialize localStorage with mock data
      localStorage.setItem(localStorageKey, JSON.stringify(inventoryItems));
    }
  }, []);

  const handleDelete = (itemId: string) => {
    if (!isAdmin) {
      toast.error("You don't have permission to delete items");
      return;
    }
    
    // Remove the item from the state
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    
    // Update localStorage
    localStorage.setItem('inventoryItems', JSON.stringify(updatedItems));
    
    toast.success("Item deleted successfully");
  };
  
  const handleBorrowItem = (item: Item) => {
    setSelectedItem(item);
    setShowBorrowDialog(false);
    setShowViewItemDialog(true);
  };
  
  const handleViewItem = (item: Item) => {
    setSelectedItem(item);
    setShowViewItemDialog(true);
  };
  
  const confirmBorrow = (item: Item, quantity: number) => {
    setShowViewItemDialog(false);
    
    if (!item) return;
    
    toast.success(`Successfully borrowed ${quantity} ${quantity > 1 ? 'units of' : 'unit of'} ${item.name}`);
    
    // Add to borrowing history in localStorage
    const newBorrowing = {
      id: Date.now().toString(),
      itemId: item.id,
      itemName: item.name,
      borrower: "Current User", // In a real app, this would be the user's name
      borrowerNpm: studentNpm || "123456",
      borrowDate: new Date().toISOString(),
      returnDate: null,
      status: "borrowed",
      location: item.location,
      category: item.category,
      quantity: quantity,
    };
    
    // Get existing borrowings
    const existingBorrowings = localStorage.getItem('borrowingHistory');
    const borrowings = existingBorrowings ? JSON.parse(existingBorrowings) : [];
    
    // Update localStorage with new borrowing
    localStorage.setItem('borrowingHistory', JSON.stringify([...borrowings, newBorrowing]));
    
    // Update the item's quantity
    if (item.quantity >= quantity) {
      const updatedItems = items.map(i => 
        i.id === item.id 
          ? { ...i, quantity: i.quantity - quantity }
          : i
      );
      setItems(updatedItems);
      localStorage.setItem('inventoryItems', JSON.stringify(updatedItems));
    }
  };
  
  const handleAddItem = (newItem: Item) => {
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    localStorage.setItem('inventoryItems', JSON.stringify(updatedItems));
  };

  // Filter and sort items
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? item.category.id === categoryFilter : true;
    const matchesLocation = locationFilter ? item.location.id === locationFilter : true;
    return matchesSearch && matchesCategory && matchesLocation;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "quantity":
        return b.quantity - a.quantity;
      case "recent":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin 
              ? "Manage and track all campus inventory items."
              : "Browse and borrow laboratory equipment."
            }
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="w-full sm:w-auto" size="sm" asChild>
            <Link to="/borrowing-history">
              <History className="mr-2 h-4 w-4" />
              Borrowing History
            </Link>
          </Button>
          {isAdmin && (
            <Button 
              className="w-full sm:w-auto" 
              size="sm" 
              onClick={() => setShowAddItemDialog(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Item
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search items..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id || "unknown-category"} // Fix: use "unknown-category" instead of empty string
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem 
                        key={location.id} 
                        value={location.id || "unknown-location"} // Fix: use "unknown-location" instead of empty string
                      >
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="quantity">Quantity (High-Low)</SelectItem>
                    <SelectItem value="recent">Recently Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("");
                  setLocationFilter("");
                  setSortBy("name");
                }}
              >
                Reset Filters
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-4 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredItems.length} of {items.length} items
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode("grid")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode("list")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <InventoryCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onBorrow={handleBorrowItem}
                  onView={handleViewItem}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <InventoryListItem
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onBorrow={handleBorrowItem}
                  onView={handleViewItem}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="h-60 flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg">
              <Filter className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No items found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* View Item Dialog */}
      <ViewItemDialog 
        open={showViewItemDialog} 
        onOpenChange={setShowViewItemDialog} 
        item={selectedItem} 
        onBorrow={confirmBorrow}
      />
      
      {/* Add Item Dialog */}
      <AddItemDialog 
        open={showAddItemDialog} 
        onOpenChange={setShowAddItemDialog} 
        onAddItem={handleAddItem}
        categories={categories}
        locations={locations}
      />
    </div>
  );
};

interface InventoryCardProps {
  item: Item;
  onDelete: (id: string) => void;
  onBorrow: (item: Item) => void;
  onView: (item: Item) => void;
  isAdmin: boolean;
}

const InventoryCard = ({ item, onDelete, onBorrow, onView, isAdmin }: InventoryCardProps) => {
  return (
    <Card className="overflow-hidden h-full">
      <div className="h-40 bg-muted flex items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className="h-12 w-12 text-muted-foreground" />
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium line-clamp-1">
            {item.name}
          </CardTitle>
          {isAdmin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(item)}>
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/inventory/${item.id}/edit`}>Edit item</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(item.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(item)}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View details</span>
            </Button>
          )}
        </div>
        <Badge
          className="mt-1 w-fit"
          style={{
            backgroundColor: item.category.color,
            color: "white",
          }}
        >
          {item.category.name}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between text-sm mt-2">
          <div>
            <span className="font-medium">Qty:</span> {item.quantity}
          </div>
          <div className="flex items-center">
            <span className="font-medium">Condition:</span>
            <span className="ml-1">{item.condition}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 inline mr-1 -mt-px" />
          {item.location.name}
        </div>
        {isAdmin ? (
          <Button variant="outline" size="sm" onClick={() => onView(item)}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={() => onBorrow(item)} disabled={item.quantity <= 0}>
            {item.quantity > 0 ? "Borrow" : "Out of Stock"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const InventoryListItem = ({ item, onDelete, onBorrow, onView, isAdmin }: InventoryCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-16 h-16 bg-muted flex-shrink-0 rounded flex items-center justify-center overflow-hidden">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Package className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge
                style={{
                  backgroundColor: item.category.color,
                  color: "white",
                }}
              >
                {item.category.name}
              </Badge>
              <div className="text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 inline mr-1 -mt-px" />
                {item.location.name}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1 min-w-[100px]">
            <div className="text-sm">
              <span className="font-medium">Qty:</span> {item.quantity}
            </div>
            <div className="text-sm">
              <span className="font-medium">Condition:</span> {item.condition}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <Button variant="outline" size="icon" onClick={() => onView(item)}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link to={`/inventory/${item.id}/edit`}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <Button variant="outline" size="icon" onClick={() => onDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="icon" onClick={() => onView(item)}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => onBorrow(item)}
                  disabled={item.quantity <= 0}
                >
                  {item.quantity > 0 ? "Borrow Item" : "Out of Stock"}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Inventory;