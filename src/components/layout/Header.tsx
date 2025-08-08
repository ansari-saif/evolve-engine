import { motion } from "framer-motion";
import { Calendar, Zap, Target } from "lucide-react";
import { format, differenceInDays } from "date-fns";

const Header = () => {
  // Mock user's startup journey start date (birthday)
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2024-12-31");
  const today = new Date();
  const daysRemaining = differenceInDays(endDate, today);
  const totalDays = differenceInDays(endDate, startDate);
  const progress = ((totalDays - daysRemaining) / totalDays) * 100;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="px-6 py-4 ml-64">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-gradient-primary"
            >
              Startup Journey
            </motion.div>
            <div className="flex items-center space-x-2 text-text-secondary">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {format(today, "EEEE, MMMM do")}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-motivation text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <div className="text-sm">
                <div className="font-semibold">{daysRemaining} days left</div>
                <div className="text-xs opacity-90">{progress.toFixed(1)}% complete</div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center cursor-pointer"
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 w-full bg-surface-light rounded-full h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-primary"
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;