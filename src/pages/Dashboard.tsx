import { motion } from "framer-motion";
import WeeklyRoadmap from "../components/dashboard/WeeklyRoadmap";
import StatsCards from "../components/dashboard/StatsCards";
import TodaysTasks from "../components/dashboard/TodaysTasks";
import MotivationCard from "../components/dashboard/MotivationCard";
import { LiquidGlass } from "../components/ui/liquid-glass";
import { useUserId } from "../contexts/AppContext";

const Dashboard = () => {
  const userId = useUserId();

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Hero Section with Weekly Roadmap */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3 sm:space-y-4"
      >
        {/* Header - Mobile Optimized */}
        <div className="px-1">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gradient-primary mb-1">
            Your Journey
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm lg:text-lg">
            Transform dreams into reality, one step at a time.
          </p>
        </div>
        
        {/* Weekly Roadmap - No extra wrapper */}
        <WeeklyRoadmap />
      </motion.section>

      {/* Stats Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <StatsCards userId={userId} />
      </motion.section>

      {/* Main Content - Mobile First */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Mobile: Stack vertically, Desktop: Grid */}
        <div className="block lg:hidden space-y-4">
          <TodaysTasks />
          <MotivationCard />
        </div>
        
        {/* Desktop: Side by side */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TodaysTasks />
          </div>
          <div className="space-y-6">
            <MotivationCard />
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Dashboard;