import { motion } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Goals = () => {
  return (
    <div className="space-y-6 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Goals & Milestones</h1>
          <p className="text-text-secondary">Track your progress toward startup success</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Target className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-6 border border-border/50"
      >
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-5 h-5 text-success" />
          <h2 className="text-lg font-semibold">Coming Soon</h2>
        </div>
        <p className="text-text-secondary">
          Hierarchical goal tracking with quarterly, monthly, and weekly breakdowns.
        </p>
      </motion.div>
    </div>
  );
};

export default Goals;