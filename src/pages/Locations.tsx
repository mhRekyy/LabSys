
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building, MapPin } from "lucide-react";
import { locations } from "@/data/mockData";

const Locations = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground mt-1">
            Manage all campus locations where inventory is stored.
          </p>
        </div>
        <Button className="w-full sm:w-auto" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add New Location
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                {location.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm">{location.building}</p>
                    {location.floor && location.room && (
                      <p className="text-xs text-muted-foreground">
                        Floor {location.floor}, Room {location.room}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">View Items</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Locations;
