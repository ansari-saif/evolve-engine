import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { ShinyProgressHeader } from "../ui/shiny-progress-header";

const Header = () => {
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

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-xl"
    >
      <div className="px-6 py-4 ml-64">
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
  );
};

export default Header;