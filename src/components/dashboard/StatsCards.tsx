import { motion } from "framer-motion";
import { TrendingUp, CheckCircle, Flame, Clock } from "lucide-react";
import { LiquidCard } from "../ui/liquid-card";

const stats = [
  {
    id: 1,
    title: "Tasks Completed",
    value: "12",
    subtext: "Today",
    change: "+23%",
    changeType: "positive" as const,
    icon: CheckCircle,
    gradient: "bg-gradient-success",
  },
  {
    id: 2,
    title: "Weekly Streak",
    value: "5",
    subtext: "Days",
    change: "🔥 Hot",
    changeType: "neutral" as const,
    icon: Flame,
    gradient: "bg-gradient-warning",
  },
  {
    id: 3,
    title: "Goals Progress",
    value: "68%",
    subtext: "Complete",
    change: "+12%",
    changeType: "positive" as const,
    icon: TrendingUp,
    gradient: "bg-gradient-primary",
  },
  {
    id: 4,
    title: "Focus Time",
    value: "4.2h",
    subtext: "Today",
    change: "-0.3h",
    changeType: "negative" as const,
    icon: Clock,
    gradient: "bg-gradient-motivation",
  },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <LiquidCard
            key={stat.id}
            variant={stat.gradient === "bg-gradient-success" ? "success" : 
                    stat.gradient === "bg-gradient-warning" ? "warning" : 
                    stat.gradient === "bg-gradient-primary" ? "primary" : "secondary"}
            hoverEffect="both"
            className="p-3 sm:p-4 lg:p-6 cursor-pointer group relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 ${stat.gradient} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-white" />
                </motion.div>
                <div className={`
                  text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium leading-tight
                  ${stat.changeType === "positive" 
                    ? "bg-success/20 text-success" 
                    : stat.changeType === "negative"
                    ? "bg-danger/20 text-danger"
                    : "bg-warning/20 text-warning"
                  }
                `}>
                  {stat.change}
                </div>
              </div>
              
              <div className="space-y-0.5 sm:space-y-1">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-text-primary leading-tight">
                  {stat.value}
                </div>
                <div className="text-text-secondary text-xs sm:text-sm font-medium leading-tight">
                  {stat.title}
                </div>
                <div className="text-text-muted text-[10px] sm:text-xs leading-tight">
                  {stat.subtext}
                </div>
              </div>
            </div>
          </LiquidCard>
        );
      })}
    </div>
  );
};

export default StatsCards;