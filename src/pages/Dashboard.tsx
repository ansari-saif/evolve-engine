import { motion } from "framer-motion";
import WeeklyRoadmap from "../components/dashboard/WeeklyRoadmap";
import StatsCards from "../components/dashboard/StatsCards";
import TodaysTasks from "../components/dashboard/TodaysTasks";
import MotivationCard from "../components/dashboard/MotivationCard";
import { LiquidGlass } from "../components/ui/liquid-glass";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section with Weekly Roadmap */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <LiquidGlass 
          intensity={3}
          borderRadius="1.5rem"
          className="p-6 mb-6"
          disableHoverEffect={true}
        >
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gradient-primary mb-2">
              Your Startup Journey
            </h1>
            <p className="text-text-secondary text-lg">
              Transform your dreams into reality, one day at a time.
            </p>
          </div>
          <WeeklyRoadmap />
        </LiquidGlass>
      </motion.section>

      {/* Stats Overview */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <StatsCards />
      </motion.section>

      {/* Main Content Grid */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <TodaysTasks />
        </div>
        <div className="space-y-6">
          <MotivationCard />
        </div>
      </motion.section>
    </div>
  );
};

export default Dashboard;