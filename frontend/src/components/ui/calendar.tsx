import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-border/50 shadow-card",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-lg font-semibold text-foreground",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-surface/80 border-border/50 p-0 opacity-70 hover:opacity-100 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-text-secondary rounded-md w-10 font-medium text-sm",
        row: "flex w-full mt-2",
        cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/30 [&:has([aria-selected])]:bg-primary/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-gradient-to-br from-primary to-primary-dark text-primary-foreground hover:from-primary-dark hover:to-primary shadow-elegant font-semibold",
        day_today: "bg-secondary/20 text-secondary-foreground border-2 border-secondary/50 font-semibold",
        day_outside:
          "day-outside text-text-muted opacity-50 aria-selected:bg-accent/30 aria-selected:text-text-muted aria-selected:opacity-40",
        day_disabled: "text-text-muted opacity-40 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-primary/20 aria-selected:text-primary",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => (
          <ChevronLeft className="h-4 w-4 text-foreground" />
        ),
        IconRight: ({ ..._props }) => (
          <ChevronRight className="h-4 w-4 text-foreground" />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
