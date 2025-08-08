import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import WeeklyRoadmap from "@/components/dashboard/WeeklyRoadmap";
import StatsCards from "@/components/dashboard/StatsCards";
import TodaysTasks from "@/components/dashboard/TodaysTasks";
import MotivationCard from "@/components/dashboard/MotivationCard";

const Dashboard = () => {
  return (  
    <Layout>
      <div className="relative min-h-screen overflow-hidden">
        {/* Floating background elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, -8, 0],
            rotate: [0, -3, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-success/20 to-warning/20 rounded-2xl blur-lg"
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 5, 0],
            rotate: [0, 3, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-32 left-1/4 w-12 h-12 bg-gradient-to-r from-motivation/20 to-primary/20 rounded-full blur-lg"
        />
        <motion.div
          animate={{
            y: [0, 12, 0],
            x: [0, -6, 0],
            rotate: [0, -2, 0],
            scale: [1, 0.95, 1]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-warning/15 to-success/15 rounded-3xl blur-xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.01, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          initial={{ opacity: 0, y: 20 }}
          className="relative z-10 space-y-6"
        >
      {/* Hero Section with Weekly Roadmap */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;