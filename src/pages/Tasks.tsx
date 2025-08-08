import { motion } from "framer-motion";
import { Plus, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Tasks = () => {
  return (
    <div className="space-y-6 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Tasks</h1>
          <p className="text-text-secondary">Manage your daily tasks and deadlines</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-6 border border-border/50"
      >
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-5 h-5 text-success" />
          <h2 className="text-lg font-semibold">Coming Soon</h2>
        </div>
        <p className="text-text-secondary">
          Advanced task management with AI-powered scheduling and deadline predictions.
        </p>
      </motion.div>
    </div>
  );
};

export default Tasks;