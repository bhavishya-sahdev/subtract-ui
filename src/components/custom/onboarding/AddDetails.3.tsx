"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, PlusIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function AddDetails() {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <div>
      <p className="text-2xl">Add details</p>
      <p>This is where the magic happens.</p>

      <Card className="box-border my-4">
        <CardContent className="py-2 px-4 grid gap-4 grid-cols-[max-content_2px_1fr] items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full border-dashed border-2"
              >
                <PlusIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuItem>Create New</DropdownMenuItem>
              <DropdownMenuItem>Pick from list</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Separator orientation="vertical" />
          <div className="flex overflow-auto gap-4">
            <div className="flex flex-col items-center gap-1">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn1.png"
                  alt="@shadcn"
                />
                <AvatarFallback>N</AvatarFallback>
              </Avatar>
              <Label>Netflix</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      <form>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="service_name">Service Name</Label>
            <Input id="service_name" type="text" placeholder="Netflix" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="subscription_created_date">Subscribed On</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="subscription_created_date"
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="subscription_charges">Subscription Charges</Label>
            <div className="flex gap-2" id="subscription_charges">
              <Select>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>South America</SelectLabel>
                    <SelectItem value="art">Argentina Time (ART)</SelectItem>
                    <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                    <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                    <SelectItem value="clt">
                      Chile Standard Time (CLT)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input type="number" placeholder="12.99" />
            </div>
          </div>
          {/* add day counter for renewal period, show next renewal on `date` */}

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="subscription_charges">Renewal Period</Label>
            <div className="flex gap-2" id="subscription_charges">
              <Select>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder="12.99" />
            </div>
          </div>
        </div>
      </form>
      {/* show auto generated previous payments */}
      <div className="space-x-2">
        <Button className="mt-4" variant="destructive">
          Remove
        </Button>
        <Button className="mt-4">Add or Next or Finish</Button>
      </div>
    </div>
  );
}
