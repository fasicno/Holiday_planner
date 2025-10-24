"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Users, Search } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "./ui/card";
import { useState } from "react";

const formSchema = z.object({
  location: z.string().min(1, "Location is required"),
  dates: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }),
  guests: z.coerce.number().int().positive("Must be at least 1 guest"),
});

export function HotelSearchForm() {
  const router = useRouter();
  const [date, setDate] = useState<DateRange | undefined>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      dates: { from: undefined, to: undefined },
      guests: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams();
    params.set("location", values.location);
    if (values.dates.from) {
      params.set("from", format(values.dates.from, "yyyy-MM-dd"));
    }
    if (values.dates.to) {
      params.set("to", format(values.dates.to, "yyyy-MM-dd"));
    }
    params.set("guests", values.guests.toString());

    router.push(`/hotels?${params.toString()}`);
  }

  return (
    <Card className="shadow-2xl">
      <CardContent className="p-4 md:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="md:col-span-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="Where are you going?" className="pl-10 h-12 text-base" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dates"
              render={({ field }) => (
                <FormItem className="md:col-span-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal h-12 text-base",
                            !field.value.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-5 w-5" />
                          {field.value.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "LLL dd, y")} -{" "}
                                {format(field.value.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick your dates</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={field.value}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input type="number" placeholder="Guests" min={1} className="pl-10 h-12 text-base" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="md:col-span-2 w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground text-base">
              <Search className="h-5 w-5 mr-2" /> Search
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
