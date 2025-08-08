import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock, Target } from "lucide-react";

const milestones = [
  { id: 1, title: "Market Research", status: "completed", date: "Mon", description: "Analyze target market and competitors" },
  { id: 2, title: "MVP Planning", status: "in-progress", date: "Wed", description: "Define core features and user flow" },
  { id: 3, title: "Tech Stack", status: "pending", date: "Fri", description: "Choose development technologies" },
  { id: 4, title: "Design System", status: "pending", date: "Sun", description: "Create brand and UI guidelines" },
];

const WeeklyRoadmap = () => {
  const completedCount = milestones.filter(m => m.status === "completed").length;
  const progressPercentage = (completedCount / milestones.length) * 100;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-gradient-subtle rounded-2xl p-8 border border-border/50 shadow-card hover:shadow-elegant transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Weekly Roadmap</h2>
            <p className="text-text-secondary text-sm">Your path to startup success</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gradient-primary">{completedCount}/4</div>
          <div className="text-xs text-text-secondary">Milestones</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-text-secondary mb-2">
          <span>Weekly Progress</span>
          <span>{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-surface-light rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="h-full bg-gradient-success"
          />
        </div>
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {milestones.map((milestone, index) => {
          const IconComponent = milestone.status === "completed" ? CheckCircle : 
                               milestone.status === "in-progress" ? Clock : Circle;
          
          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className={`
                p-4 rounded-xl border transition-all duration-300 cursor-pointer
                ${milestone.status === "completed" 
                  ? "bg-success/10 border-success/30 hover:shadow-success/20" 
                  : milestone.status === "in-progress"
                  ? "bg-primary/10 border-primary/30 hover:shadow-primary/20"
                  : "bg-surface-light border-border hover:border-primary/50"
                } hover:shadow-lg
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center mt-1
                  ${milestone.status === "completed" 
                    ? "bg-gradient-success text-white" 
                    : milestone.status === "in-progress"
                    ? "bg-gradient-primary text-white"
                    : "bg-surface text-text-secondary"
                  }
                `}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-text-secondary font-medium mb-1">
                    {milestone.date}
                  </div>
                  <h4 className="font-semibold text-text-primary text-sm mb-2">
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default WeeklyRoadmap;