
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package } from "lucide-react";
import { categories, inventoryItems } from "@/data/mockData";

const Categories = () => {
  // Count items per category
  const getCategoryItemCount = (categoryId: string) => {
    return inventoryItems.filter(item => item.category.id === categoryId).length;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage inventory categories for better organization.
          </p>
        </div>
        <Button className="w-full sm:w-auto" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className="h-2" style={{ backgroundColor: category.color }}></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <div 
                  className="h-4 w-4 rounded-full mr-2" 
                  style={{ backgroundColor: category.color }}
                ></div>
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{getCategoryItemCount(category.id)} items</span>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">View Items</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Categories;
