import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock, Target, AlertCircle, Loader2 } from "lucide-react";
import { useWeeklyGoals, useWeeklyMilestones } from "../../hooks/useWeeklyGoals";
import { useUserId } from "../../contexts/AppContext";

// Fallback milestones for when API fails or no data
const fallbackMilestones = [
  { id: 1, title: "Market Research", status: "completed" as const, date: "Mon", description: "Analyze target market and competitors", completion_percentage: 100 },
  { id: 2, title: "MVP Planning", status: "in-progress" as const, date: "Wed", description: "Define core features and user flow", completion_percentage: 60 },
  { id: 3, title: "Tech Stack", status: "pending" as const, date: "Fri", description: "Choose development technologies", completion_percentage: 0 },
  { id: 4, title: "Design System", status: "pending" as const, date: "Sun", description: "Create brand and UI guidelines", completion_percentage: 0 },
];

const WeeklyRoadmap = () => {
  const userId = useUserId();
  
  // Fetch weekly goals data from backend
  const { 
    data: weeklyProgress, 
    isLoading: isLoadingProgress, 
    error: progressError 
  } = useWeeklyGoals(userId);
  
  const { 
    data: milestones, 
    isLoading: isLoadingMilestones, 
    error: milestonesError 
  } = useWeeklyMilestones(userId);

  // Use fallback data if API fails or no data
  const displayMilestones = milestones || fallbackMilestones;
  const displayProgress = weeklyProgress || { completed: 2, total: 4, percentage: 50 };
  
  const isLoading = isLoadingProgress || isLoadingMilestones;
  const hasError = progressError || milestonesError;

  // Error state component
  if (hasError) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-gradient-subtle rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-8 border border-border/50 shadow-card hover:shadow-elegant transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-primary rounded-lg sm:rounded-xl flex items-center justify-center">
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg lg:text-xl font-semibold text-text-primary">Weekly Roadmap</h2>
              <p className="text-text-secondary text-xs sm:text-sm">Your path to startup success</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient-primary">{displayProgress.completed}/{displayProgress.total}</div>
            <div className="text-[10px] sm:text-xs text-text-secondary">Milestones</div>
          </div>
        </div>

        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-text-secondary">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Using fallback data</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex justify-between text-xs sm:text-sm text-text-secondary mb-2">
            <span>Weekly Progress</span>
            <span>{displayProgress.percentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-surface-light rounded-full h-1.5 sm:h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${displayProgress.percentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-gradient-success"
            />
          </div>
        </div>

        {/* Milestones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          {displayMilestones.map((milestone, index) => {
            const IconComponent = milestone.status === "completed" ? CheckCircle : 
                                 milestone.status === "in-progress" ? Clock : Circle;
            
            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`
                  p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border transition-all duration-300 cursor-pointer
                  ${milestone.status === "completed" 
                    ? "bg-success/10 border-success/30 hover:shadow-success/20" 
                    : milestone.status === "in-progress"
                    ? "bg-primary/10 border-primary/30 hover:shadow-primary/20"
                    : "bg-surface-light border-border hover:border-primary/50"
                  } hover:shadow-lg
                `}
              >
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className={`
                    w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center mt-0.5 lg:mt-1
                    ${milestone.status === "completed" 
                      ? "bg-gradient-success text-white" 
                      : milestone.status === "in-progress"
                      ? "bg-gradient-primary text-white"
                      : "bg-surface text-text-secondary"
                    }
                  `}>
                    <IconComponent className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] sm:text-xs text-text-secondary font-medium mb-1">
                      {milestone.date}
                    </div>
                    <h4 className="font-semibold text-text-primary text-xs sm:text-sm mb-1 sm:mb-2">
                      {milestone.title}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-text-muted leading-relaxed">
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
  }

  // Loading state component
  if (isLoading) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-gradient-subtle rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-8 border border-border/50 shadow-card hover:shadow-elegant transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-primary rounded-lg sm:rounded-xl flex items-center justify-center">
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg lg:text-xl font-semibold text-text-primary">Weekly Roadmap</h2>
              <p className="text-text-secondary text-xs sm:text-sm">Your path to startup success</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-text-secondary" />
              <span className="text-[10px] sm:text-xs text-text-secondary">Loading...</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-text-secondary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading weekly goals...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-gradient-subtle rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-8 border border-border/50 shadow-card hover:shadow-elegant transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-primary rounded-lg sm:rounded-xl flex items-center justify-center">
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm sm:text-lg lg:text-xl font-semibold text-text-primary">Weekly Roadmap</h2>
            <p className="text-text-secondary text-xs sm:text-sm">Your path to startup success</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient-primary">{displayProgress.completed}/{displayProgress.total}</div>
          <div className="text-[10px] sm:text-xs text-text-secondary">Milestones</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex justify-between text-xs sm:text-sm text-text-secondary mb-2">
          <span>Weekly Progress</span>
          <span>{displayProgress.percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-surface-light rounded-full h-1.5 sm:h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${displayProgress.percentage}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="h-full bg-gradient-success"
          />
        </div>
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        {displayMilestones.map((milestone, index) => {
          const IconComponent = milestone.status === "completed" ? CheckCircle : 
                               milestone.status === "in-progress" ? Clock : Circle;
          
          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`
                p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border transition-all duration-300 cursor-pointer
                ${milestone.status === "completed" 
                  ? "bg-success/10 border-success/30 hover:shadow-success/20" 
                  : milestone.status === "in-progress"
                  ? "bg-primary/10 border-primary/30 hover:shadow-primary/20"
                  : "bg-surface-light border-border hover:border-primary/50"
                } hover:shadow-lg
              `}
            >
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className={`
                  w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center mt-0.5 lg:mt-1
                  ${milestone.status === "completed" 
                    ? "bg-gradient-success text-white" 
                    : milestone.status === "in-progress"
                    ? "bg-gradient-primary text-white"
                    : "bg-surface text-text-secondary"
                  }
                `}>
                  <IconComponent className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] sm:text-xs text-text-secondary font-medium mb-1">
                    {milestone.date}
                  </div>
                  <h4 className="font-semibold text-text-primary text-xs sm:text-sm mb-1 sm:mb-2">
                    {milestone.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-text-muted leading-relaxed">
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