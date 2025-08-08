import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock, Plus, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import confetti from "canvas-confetti";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  deadline?: string;
}

const mockTasks: Task[] = [
  {
    id: 1,
    title: "MVP Feature Definition",
    description: "Define core features for the minimum viable product",
    completed: false,
    priority: "High",
    deadline: "2:00 PM"
  },
  {
    id: 2,
    title: "Competitor Analysis",
    description: "Research top 5 competitors and their strategies",
    completed: true,
    priority: "Medium"
  },
  {
    id: 3,
    title: "Landing Page Wireframes",
    description: "Create initial wireframes for marketing site",
    completed: false,
    priority: "Medium",
    deadline: "5:00 PM"
  },
  {
    id: 4,
    title: "Team Meeting",
    description: "Weekly sync with development team",
    completed: false,
    priority: "Low",
    deadline: "3:30 PM"
  }
];

const TodaysTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = (completedTasks / totalTasks) * 100;

  const handleToggleTask = (taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId && !task.completed) {
          // Trigger confetti for completion
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#6366f1', '#ec4899', '#10b981']
          });
          return { ...task, completed: true };
        }
        return task;
      })
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-danger";
      case "Medium": return "text-warning";
      default: return "text-text-muted";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 border border-border/50 shadow-card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Today's Tasks</h2>
            <p className="text-text-secondary text-sm">
              {completedTasks} of {totalTasks} completed ({completionRate.toFixed(0)}%)
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {completionRate >= 50 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-1 text-warning"
            >
              <Flame className="w-4 h-4" />
              <span className="text-xs font-semibold">On Fire!</span>
            </motion.div>
          )}
          <Button size="sm" className="bg-gradient-primary hover:opacity-90">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="w-full bg-surface-light rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-success"
          />
        </div>
      </div>

      {/* Tasks list */}
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, x: 4 }}
            className={`
              p-4 rounded-xl border transition-all duration-200 cursor-pointer group
              ${task.completed 
                ? "bg-success/5 border-success/20" 
                : "bg-surface/50 border-border hover:border-primary/50 hover:bg-surface"
              }
            `}
            onClick={() => handleToggleTask(task.id)}
          >
            <div className="flex items-start space-x-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`
                  mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${task.completed 
                    ? 'bg-success border-success text-white' 
                    : 'border-border hover:border-primary group-hover:border-primary'
                  }
                `}
              >
                {task.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle className="w-3 h-3" />
                  </motion.div>
                )}
              </motion.button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`
                    font-semibold text-sm transition-colors
                    ${task.completed 
                      ? 'text-text-secondary line-through' 
                      : 'text-text-primary group-hover:text-primary'
                    }
                  `}>
                    {task.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {task.deadline && !task.completed && (
                      <div className="flex items-center space-x-1 text-text-muted">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{task.deadline}</span>
                      </div>
                    )}
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === "High" ? "bg-danger" :
                      task.priority === "Medium" ? "bg-warning" : "bg-text-muted"
                    }`} />
                  </div>
                </div>
                <p className={`
                  text-xs leading-relaxed
                  ${task.completed ? 'text-text-muted' : 'text-text-secondary'}
                `}>
                  {task.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          <Circle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No tasks for today. Add one to get started!</p>
        </div>
      )}
    </motion.div>
  );
};

export default TodaysTasks;