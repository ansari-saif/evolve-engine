import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { useState, useEffect } from "react";
import { ShinyProgressHeader } from "../ui/shiny-progress-header";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

interface HeaderProps {
  onVisibilityChange?: (visible: boolean) => void;
}

const Header = ({ onVisibilityChange }: HeaderProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // Mock user's startup journey start date (birthday)
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2024-12-31");
  const today = new Date();
  const daysRemaining = differenceInDays(endDate, today);
  const totalDays = differenceInDays(endDate, startDate);
  const progress = ((totalDays - daysRemaining) / totalDays) * 100;

  // Placeholder progreLog-style signals (replace with real state when available)
  const tasksCompleted = Math.round((progress / 100) * 10);
  const tasksPlanned = 10;
  const moodScore = 72; // 0-100
  const energyLevel = 65;
  const focusScore = 78;

  const toggleHeader = () => {
    setIsVisible(!isVisible);
  };

  // Notify parent component of visibility changes
  useEffect(() => {
    onVisibilityChange?.(isVisible);
  }, [isVisible, onVisibilityChange]);

  return (
    <>
      {/* Toggle Button - Always visible */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 right-4 z-50"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={toggleHeader}
          className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </motion.div>

      {/* Header - Conditionally visible */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          y: isVisible ? 0 : -20,
          height: isVisible ? "auto" : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-40 bg-transparent backdrop-blur-xl overflow-hidden ${
          isVisible ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div className="px-6 py-4">
          <ShinyProgressHeader
            title="Startup Journey"
            subtitle={`${format(today, "EEEE, MMMM do")} • ${daysRemaining} days left`}
            tasksCompleted={tasksCompleted}
            tasksPlanned={tasksPlanned}
            moodScore={moodScore}
            energyLevel={energyLevel}
            focusScore={focusScore}
          />
        </div>
      </motion.header>
    </>
  );
};

export default Header;