import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Search, Filter, MoreVertical, ArrowUpDown, Calendar, Eye } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ViewItemDialog from "@/components/inventory/ViewItemDialog";
import { Item } from "@/types/inventory";
import { inventoryItems } from "@/data/mockData";

// Define the shape of a borrowing record
interface BorrowingRecord {
  id: string;
  itemId: string;
  itemName: string;
  borrower: string;
  borrowerNpm: string;
  borrowDate: string;
  returnDate: string | null;
  status: "borrowed" | "returned";
  location: any;
  category: any;
  quantity?: number;
}

const BorrowingHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [sortBy, setSortBy] = useState("recent");
  const [borrowingHistoryData, setBorrowingHistoryData] = useState<BorrowingRecord[]>([]);
  const [showViewItemDialog, setShowViewItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const { isAdmin, studentNpm } = useAuth();

  // Load borrowing history data
  useEffect(() => {
    const localStorageKey = 'borrowingHistory';
    const storedHistory = localStorage.getItem(localStorageKey);
    
    let historyData = [];
    if (storedHistory) {
      historyData = JSON.parse(storedHistory);
    }
    
    // If not admin, filter to show only current user's borrowings
    if (!isAdmin && studentNpm) {
      historyData = historyData.filter((record: BorrowingRecord) => record.borrowerNpm === studentNpm);
    }
    
    setBorrowingHistoryData(historyData);
    
    // Load inventory items too
    const storedItems = localStorage.getItem('inventoryItems');
    if (storedItems) {
      setAllItems(JSON.parse(storedItems));
    } else {
      setAllItems(inventoryItems);
    }
  }, [isAdmin, studentNpm]);

  const handleReturn = (recordId: string) => {
    const updatedHistory = borrowingHistoryData.map(record =>
      record.id === recordId
        ? {
            ...record,
            returnDate: new Date().toISOString(),
            status: "returned" as const,
          }
        : record
    );

    // Update local state
    setBorrowingHistoryData(updatedHistory);
    
    // Update localStorage
    localStorage.setItem('borrowingHistory', JSON.stringify(updatedHistory));
    
    // Update inventory quantity
    const returnedRecord = borrowingHistoryData.find(record => record.id === recordId);
    if (returnedRecord) {
      const returnQuantity = returnedRecord.quantity || 1;
      
      const storedItems = localStorage.getItem('inventoryItems');
      if (storedItems) {
        const items = JSON.parse(storedItems);
        const updatedItems = items.map((item: Item) => {
          if (item.id === returnedRecord.itemId) {
            return {
              ...item,
              quantity: item.quantity + returnQuantity
            };
          }
          return item;
        });
        
        localStorage.setItem('inventoryItems', JSON.stringify(updatedItems));
      }
    }

    toast.success("Item marked as returned");
  };
  
  const handleViewItem = (record: BorrowingRecord) => {
    // Find the full item data based on the record's itemId
    const item = allItems.find(item => item.id === record.itemId);
    
    if (item) {
      setSelectedItem(item);
      setShowViewItemDialog(true);
    } else {
      // If the item doesn't exist anymore, create a temporary one with the record's data
      const temporaryItem: Item = {
        id: record.itemId,
        name: record.itemName,
        description: "Item details may be incomplete as this item no longer exists in the inventory.",
        category: record.category,
        location: record.location,
        quantity: 0,
        // Fix: Change "Unknown" to "Fair" to match the allowed condition types
        condition: "Fair",
        lastUpdated: record.borrowDate,
      };
      setSelectedItem(temporaryItem);
      setShowViewItemDialog(true);
    }
  };

  // Filter and sort borrowing records
  const filteredRecords = borrowingHistoryData
    .filter((record) => {
      const matchesSearch =
        record.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.borrower.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all-status" ? true : record.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
        case "oldest":
          return new Date(a.borrowDate).getTime() - new Date(b.borrowDate).getTime();
        case "item":
          return a.itemName.localeCompare(b.itemName);
        case "borrower":
          return a.borrower.localeCompare(b.borrower);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Borrowing History</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin
              ? "Track all borrowed items across the campus."
              : "View your borrowed equipment history."
            }
          </p>
        </div>
        <div>
          <Button asChild>
            <Link to="/inventory">
              <Package className="mr-2 h-4 w-4" />
              Inventory
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>
                {isAdmin ? "All Borrowings" : "Your Borrowings"}
              </CardTitle>
              <CardDescription>
                {filteredRecords.length} records found
              </CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative w-full sm:w-[240px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="borrowed">Currently Borrowed</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRecords.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Item</TableHead>
                    {isAdmin && <TableHead>Borrower</TableHead>}
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>
                      <button
                        className="flex items-center space-x-1 hover:text-primary"
                        onClick={() =>
                          setSortBy(sortBy === "recent" ? "oldest" : "recent")
                        }
                      >
                        <span>Date</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell text-center">Quantity</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="h-9 w-9 rounded bg-primary/10 flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{record.itemName}</div>
                            <div className="text-xs text-muted-foreground">
                              {record.location?.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div className="font-medium">{record.borrower}</div>
                          <div className="text-xs text-muted-foreground">
                            NPM: {record.borrowerNpm}
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          style={{
                            backgroundColor: record.category?.color || "#888",
                            color: "white",
                          }}
                        >
                          {record.category?.name || "Other"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span title={format(new Date(record.borrowDate), "PPpp")}>
                            {formatDistanceToNow(new Date(record.borrowDate), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        {record.returnDate && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Returned{" "}
                            {formatDistanceToNow(new Date(record.returnDate), {
                              addSuffix: true,
                            })}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={record.status === "borrowed" ? "default" : "outline"}
                        >
                          {record.status === "borrowed" ? "Borrowed" : "Returned"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-center">
                        {record.quantity || 1}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewItem(record)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          {record.status === "borrowed" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                  size="sm"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleReturn(record.id)}
                                >
                                  Mark as returned
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="h-60 flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg">
              <Filter className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No borrowing records found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery || statusFilter !== "all-status"
                  ? "Try adjusting your search or filter."
                  : isAdmin
                  ? "No items have been borrowed yet."
                  : "You haven't borrowed any items yet."}
              </p>
              <Button asChild className="mt-4">
                <Link to="/inventory">Browse Inventory</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* View Item Dialog */}
      <ViewItemDialog 
        open={showViewItemDialog} 
        onOpenChange={setShowViewItemDialog} 
        item={selectedItem}
      />
    </div>
  );
};

export default BorrowingHistory;