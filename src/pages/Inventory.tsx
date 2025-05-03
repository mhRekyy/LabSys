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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Search, Plus, Filter, MoreVertical, Edit, Trash2, Package, MapPin, History, CirclePlus
} from "lucide-react";
import { inventoryItems, categories, locations } from "@/data/mockData";
import { Item } from "@/types/inventory";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showBorrowDialog, setShowBorrowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { isAdmin } = useAuth();

  const handleDelete = (itemId: string) => {
    if (!isAdmin) {
      toast.error("You don't have permission to delete items");
      return;
    }
    toast.success("Item deleted successfully");
  };
  
  const handleBorrowItem = (item: Item) => {
    setSelectedItem(item);
    setShowBorrowDialog(true);
  };
  
  const confirmBorrow = () => {
    setShowBorrowDialog(false);
    if (selectedItem) {
      toast.success(`Successfully borrowed ${selectedItem.name}`);
      
      // Add to borrowing history in localStorage
      const newBorrowing = {
        id: Date.now().toString(),
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        borrower: "Current User",
        borrowerNpm: localStorage.getItem("studentNpm") || "123456",
        borrowDate: new Date().toISOString(),
        returnDate: null,
        status: "borrowed",
        location: selectedItem.location,
        category: selectedItem.category,
      };
      
      const existingBorrowings = localStorage.getItem('borrowingHistory');
      const borrowings = existingBorrowings ? JSON.parse(existingBorrowings) : [];
      localStorage.setItem('borrowingHistory', JSON.stringify([...borrowings, newBorrowing]));
    }
  };

  // Filter and sort items
  const filteredItems = inventoryItems.filter((item) => {
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
            <Button className="w-full sm:w-auto" size="sm">
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
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
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
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
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
              Showing {filteredItems.length} of {inventoryItems.length} items
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
      
      {/* Borrow Dialog */}
      <Dialog open={showBorrowDialog} onOpenChange={setShowBorrowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Borrow Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to borrow:</p>
            <div className="flex items-center gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{selectedItem?.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedItem?.category.name} • {selectedItem?.location.name}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBorrowDialog(false)}>Cancel</Button>
            <Button onClick={confirmBorrow}>Confirm Borrow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface InventoryCardProps {
  item: Item;
  onDelete: (id: string) => void;
  onBorrow: (item: Item) => void;
  isAdmin: boolean;
}

const InventoryCard = ({ item, onDelete, onBorrow, isAdmin }: InventoryCardProps) => {
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
                <DropdownMenuItem asChild>
                  <Link to={`/inventory/${item.id}`}>View details</Link>
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
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <CirclePlus className="h-4 w-4" onClick={() => onBorrow(item)} />
              <span className="sr-only">Borrow</span>
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
          <Button variant="outline" size="sm" asChild>
            <Link to={`/inventory/${item.id}`}>View</Link>
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={() => onBorrow(item)}>
            Borrow
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const InventoryListItem = ({ item, onDelete, onBorrow, isAdmin }: InventoryCardProps) => {
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
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/inventory/${item.id}`}>View</Link>
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={() => onBorrow(item)}>
                Borrow Item
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Inventory;