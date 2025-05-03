import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MoreHorizontal, Users, Microscope, Activity, BookOpen, Settings, ArrowRight } from "lucide-react";
import { BookingItem } from "./types";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface BookingsTabProps {
  bookings: BookingItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

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

const BookingsTab: React.FC<BookingsTabProps> = ({ bookings }) => {
  if (bookings.length === 0) {
    return (
      <motion.div variants={cardVariants}>
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="mb-4 bg-muted inline-flex h-12 w-12 items-center justify-center rounded-full">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-1 text-xl font-semibold">No Laboratory Bookings</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't booked any laboratories yet. Book a lab to see it appear here.
              </p>
              <Button asChild>
                <Link to="/laboratories" className="flex items-center gap-1">
                  Browse Laboratories <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {bookings.map((booking, index) => (
          <motion.div key={booking.id} variants={cardVariants}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                    {booking.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl mt-2">{booking.lab}</CardTitle>
                <CardDescription>{booking.equipment}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{booking.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{booking.time}</span>
                  </div>
                </div>
                
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-center mb-2">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Lab Assistants</span>
                  </div>
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://i.pravatar.cc/150?img=${index * 2 + 1}`} />
                      <AvatarFallback>LA</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://i.pravatar.cc/150?img=${index * 2 + 2}`} />
                      <AvatarFallback>LA</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Reschedule</Button>
                <Button size="sm">View Details</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Book a New Session</CardTitle>
            <CardDescription>Schedule time in one of our laboratories</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" asChild className="h-20 w-full sm:w-auto flex-1 flex flex-col gap-2 p-3 justify-center items-center">
              <Link to="/laboratories?filter=biology">
                <Microscope className="h-5 w-5" />
                <span>Biology Lab</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 w-full sm:w-auto flex-1 flex flex-col gap-2 p-3 justify-center items-center">
              <Link to="/laboratories?filter=science">
                <Activity className="h-5 w-5" />
                <span>Physics Lab</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 w-full sm:w-auto flex-1 flex flex-col gap-2 p-3 justify-center items-center">
              <Link to="/laboratories?filter=computer">
                <Settings className="h-5 w-5" />
                <span>Computer Lab</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 w-full sm:w-auto flex-1 flex flex-col gap-2 p-3 justify-center items-center">
              <Link to="/laboratories">
                <BookOpen className="h-5 w-5" />
                <span>More Labs</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default BookingsTab;