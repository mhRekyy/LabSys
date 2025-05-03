import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { Lab } from "./types";

interface BookingFormProps {
  lab: Lab;
  onSubmit: (data: any) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ lab, onSubmit }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Generate time slots based on lab hours
  const generateTimeSlots = () => {
    const slots = [
      "09:00 - 11:00",
      "11:00 - 13:00",
      "14:00 - 16:00",
      "16:00 - 18:00"
    ];
    return slots;
  };
  
  const form = useForm({
    defaultValues: {
      date: new Date(),
      timeSlot: "",
      equipment: ""
    }
  });
  
  const handleSubmit = (data: any) => {
    // Format date for display
    if (data.date) {
      data.date = format(data.date, "MMM dd, yyyy");
    }
    onSubmit(data);
  };
  
  const timeSlots = generateTimeSlots();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setDate(date);
                    }}
                    disabled={(date) => 
                      date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                      date > new Date(new Date().setDate(new Date().getDate() + 14))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Slot</FormLabel>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="grid grid-cols-2 gap-2"
              >
                {timeSlots.map((slot) => (
                  <FormItem key={slot} className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={slot} />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">{slot}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="equipment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lab.equipment.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">Confirm Booking</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default BookingForm;