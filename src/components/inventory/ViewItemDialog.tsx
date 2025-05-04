import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Item } from "@/types/inventory";
import { Package, MapPin, Edit, Calendar, CircleDollarSign, Info } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

interface ViewItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
  onBorrow?: (item: Item, quantity: number) => void;
}

const ViewItemDialog: React.FC<ViewItemDialogProps> = ({
  open,
  onOpenChange,
  item,
  onBorrow,
}) => {
  const { isAdmin } = useAuth();
  const [borrowQuantity, setBorrowQuantity] = React.useState(1);

  if (!item) return null;

  const handleBorrow = () => {
    if (onBorrow && item) {
      onBorrow(item, borrowQuantity);
      onOpenChange(false);
    }
  };

  const maxBorrowQuantity = item.quantity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Item Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4 py-4">
          <div className="md:w-1/3 rounded-lg overflow-hidden bg-muted flex items-center justify-center h-[200px]">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="h-16 w-16 text-muted-foreground" />
            )}
          </div>

          <div className="md:w-2/3 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  style={{
                    backgroundColor: item.category.color,
                    color: "white",
                  }}
                >
                  {item.category.name}
                </Badge>
                <div className="text-xs text-muted-foreground flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {item.location.name}, {item.location.building}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{item.description}</p>

            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Quantity:</span>
                <span>{item.quantity}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Condition:</span>
                <span>{item.condition}</span>
              </div>
              {item.manufacturer && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Manufacturer:</span>
                  <span>{item.manufacturer}</span>
                </div>
              )}
              {item.model && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Model:</span>
                  <span>{item.model}</span>
                </div>
              )}
              {item.serialNumber && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Serial Number:</span>
                  <span>{item.serialNumber}</span>
                </div>
              )}
              {item.purchaseDate && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Purchase Date:</span>
                  <span>{format(new Date(item.purchaseDate), "PPP")}</span>
                </div>
              )}
            </div>

            {item.notes && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-1 flex items-center">
                  <Info className="h-4 w-4 mr-1 opacity-70" />
                  Notes
                </h3>
                <p className="text-sm">{item.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground italic mt-2">
          Last updated: {format(new Date(item.lastUpdated), "PPP")}
        </div>

        <DialogFooter className="gap-2">
          {isAdmin ? (
            <Button variant="outline" asChild>
              <a href={`/inventory/${item.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Item
              </a>
            </Button>
          ) : onBorrow && (
            <div className="w-full flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Quantity:</span>
                <Input
                  type="number"
                  min={1}
                  max={maxBorrowQuantity}
                  value={borrowQuantity}
                  onChange={(e) => setBorrowQuantity(Math.min(maxBorrowQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-20"
                />
              </div>
              <Button onClick={handleBorrow} disabled={item.quantity <= 0} className="ml-auto">
                {item.quantity > 0 ? "Borrow Item" : "Out of Stock"}
              </Button>
            </div>
          )}
          {!onBorrow && !isAdmin && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 " +
          className
        }
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export default ViewItemDialog;