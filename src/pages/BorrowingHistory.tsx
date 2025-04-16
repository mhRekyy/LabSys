
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Search, Filter, Package, Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

// Mock data for borrowing history
const borrowingHistoryData = [
  {
    id: "1",
    itemId: "item-1",
    itemName: "Laptop Dell XPS 13",
    borrower: "John Smith",
    borrowDate: "2025-04-01T10:00:00",
    returnDate: "2025-04-08T16:30:00",
    status: "returned",
    location: { name: "Engineering Building" },
    category: { name: "Electronics", color: "#3b82f6" },
  },
  {
    id: "2",
    itemId: "item-3",
    itemName: "DSLR Camera",
    borrower: "Emily Johnson",
    borrowDate: "2025-04-05T09:15:00",
    returnDate: null,
    status: "borrowed",
    location: { name: "Media Center" },
    category: { name: "Photography", color: "#8b5cf6" },
  },
  {
    id: "3",
    itemId: "item-7",
    itemName: "Projector",
    borrower: "Michael Brown",
    borrowDate: "2025-03-28T13:45:00",
    returnDate: "2025-04-01T11:20:00",
    status: "returned",
    location: { name: "Lecture Hall" },
    category: { name: "Audio/Visual", color: "#ec4899" },
  },
  {
    id: "4",
    itemId: "item-12",
    itemName: "iPad Pro",
    borrower: "Sarah Davis",
    borrowDate: "2025-04-07T14:30:00",
    returnDate: null,
    status: "borrowed",
    location: { name: "Art Department" },
    category: { name: "Electronics", color: "#3b82f6" },
  },
  {
    id: "5",
    itemId: "item-15",
    itemName: "Microphone Set",
    borrower: "David Wilson",
    borrowDate: "2025-03-25T10:00:00",
    returnDate: "2025-03-27T15:45:00",
    status: "returned",
    location: { name: "Music Room" },
    category: { name: "Audio/Visual", color: "#ec4899" },
  },
];

const BorrowingHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // Filter and sort history items
  const filteredHistory = borrowingHistoryData
    .filter((record) => {
      const matchesSearch =
        record.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.borrower.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter ? record.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
        case "oldest":
          return new Date(a.borrowDate).getTime() - new Date(b.borrowDate).getTime();
        case "name":
          return a.itemName.localeCompare(b.itemName);
        case "borrower":
          return a.borrower.localeCompare(b.borrower);
        default:
          return 0;
      }
    });

  const handleReturn = (id: string) => {
    toast.success("Item marked as returned");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Borrowing History</h1>
          <p className="text-muted-foreground mt-1">
            Track all borrowing and returns of inventory items.
          </p>
        </div>
        <Button className="w-full sm:w-auto" size="sm" asChild>
          <Link to="/inventory">
            <Package className="mr-2 h-4 w-4" />
            View Inventory
          </Link>
        </Button>
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
                    placeholder="Search by item or borrower..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="borrowed">Currently Borrowed</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
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
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name">Item Name (A-Z)</SelectItem>
                    <SelectItem value="borrower">Borrower Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Borrowing Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{record.itemName}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                <Badge
                                  className="mr-1"
                                  style={{
                                    backgroundColor: record.category.color,
                                    color: "white",
                                  }}
                                >
                                  {record.category.name}
                                </Badge>
                                {record.location.name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              {record.borrower}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-xs">
                                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>Borrowed: {format(new Date(record.borrowDate), "MMM d, yyyy")}</span>
                              </div>
                              {record.returnDate && (
                                <div className="flex items-center text-xs">
                                  <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                  <span>Returned: {format(new Date(record.returnDate), "MMM d, yyyy")}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={record.status === "borrowed" ? "outline" : "default"}
                              className={
                                record.status === "borrowed"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
                                  : "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                              }
                            >
                              {record.status === "borrowed" ? "Currently Borrowed" : "Returned"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {record.status === "borrowed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReturn(record.id)}
                              >
                                Mark Returned
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="ml-2"
                            >
                              <Link to={`/inventory/${record.itemId}`}>
                                View Item
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-center p-4">
                            <Filter className="h-8 w-8 text-muted-foreground mb-2" />
                            <h3 className="text-lg font-medium">No records found</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Try adjusting your search or filter to find what you're looking for.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BorrowingHistory;
