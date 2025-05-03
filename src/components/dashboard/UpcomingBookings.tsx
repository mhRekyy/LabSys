import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ClockIcon, Settings, Activity, Microscope, ArrowRight } from "lucide-react";
import { BookingItem } from "./types";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface UpcomingBookingsProps {
  bookings: BookingItem[];
  onViewAll: (section: string) => void;
}

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({ bookings, onViewAll }) => {
  return (
    <motion.div variants={cardVariants}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your scheduled laboratory sessions</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onViewAll('bookings')} className="text-primary">
            View all
          </Button>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-md ${
                      booking.lab.includes("Computer") ? "bg-blue-500/10 text-blue-500" :
                      booking.lab.includes("Physics") ? "bg-purple-500/10 text-purple-500" :
                      "bg-green-500/10 text-green-500"
                    }`}>
                      {booking.lab.includes("Computer") ? (
                        <Settings className="h-5 w-5" />
                      ) : booking.lab.includes("Physics") ? (
                        <Activity className="h-5 w-5" />
                      ) : (
                        <Microscope className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{booking.lab}</div>
                      <div className="text-sm text-muted-foreground">{booking.equipment}</div>
                      <div className="flex items-center mt-1 gap-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {booking.date}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {booking.time}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="bg-muted inline-flex h-12 w-12 items-center justify-center rounded-full">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <h3 className="mb-1 text-lg font-semibold">No bookings yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You haven't made any laboratory bookings yet
              </p>
              <Button asChild>
                <Link to="/laboratories" className="flex items-center gap-1">
                  Book a laboratory <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UpcomingBookings;