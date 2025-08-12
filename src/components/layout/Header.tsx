import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { useState, useEffect } from "react";
import { ShinyProgressHeader } from "../ui/shiny-progress-header";
import { Button } from "../ui/button";
import { Eye, EyeOff, Menu } from "lucide-react";
import { useUserId } from "../../contexts/AppContext";
import { useGetUserProgressStats, useGetUserRecentProgressLogs } from "../../hooks";
import { extractProgressData } from "../../utils/progress";

interface HeaderProps {
  onVisibilityChange?: (visible: boolean) => void;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

const Header = ({ onVisibilityChange, sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const userId = useUserId();

  // Fetch progress data from API
  const { data: progressStats, isLoading: isLoadingStats } = useGetUserProgressStats(userId, 30);
  const { data: recentLogs, isLoading: isLoadingLogs } = useGetUserRecentProgressLogs(userId, 7);

  // Mock user's startup journey start date (birthday) - this could be fetched from user profile later
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2024-12-31");
  const today = new Date();
  const daysRemaining = differenceInDays(endDate, today);
  const totalDays = differenceInDays(endDate, startDate);
  const progress = ((totalDays - daysRemaining) / totalDays) * 100;

  // Calculate progress data from API or use defaults
  const getProgressData = () => {
    return extractProgressData(progressStats, recentLogs, progress);
  };

  const { tasksCompleted, tasksPlanned, moodScore, energyLevel, focusScore } = getProgressData();

  const toggleHeader = () => {
    setIsVisible(!isVisible);
  };

  // Notify parent component of visibility changes
  useEffect(() => {
    onVisibilityChange?.(isVisible);
  }, [isVisible, onVisibilityChange]);

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 lg:hidden"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen?.(!sidebarOpen)}
          className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 h-8 w-8 sm:h-10 sm:w-10"
        >
          <Menu className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </motion.div>

      {/* Toggle Button - Always visible */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={toggleHeader}
          className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 h-8 w-8 sm:h-10 sm:w-10"
        >
          {isVisible ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4" />}
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
        <div className="px-4 py-3 sm:px-6 sm:py-4">
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