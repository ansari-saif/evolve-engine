import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";

const Statistics = () => {
  return (
    <div className="space-y-6 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gradient-primary mb-2">Statistics</h1>
        <p className="text-text-secondary">Analyze your productivity and progress</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-6 border border-border/50"
      >
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="w-5 h-5 text-success" />
          <h2 className="text-lg font-semibold">Coming Soon</h2>
        </div>
        <p className="text-text-secondary">
          Comprehensive analytics with productivity heatmaps, completion rates, and AI insights.
        </p>
      </motion.div>
    </div>
  );
};

export default Statistics;