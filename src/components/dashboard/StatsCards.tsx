import { motion } from "framer-motion";
import { TrendingUp, CheckCircle, Flame, Clock } from "lucide-react";
import { floatingCard, floatingIcon } from "@/utils/animations";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: [0, -8, 0],
              rotate: [0, 0.5, 0]
            }}
            transition={{ 
              opacity: { duration: 0.5, delay: index * 0.1 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 },
              rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }
            }}
            whileHover={{
              scale: 1.05,
              y: -12,
              rotate: 1,
              boxShadow: "0 25px 50px -12px hsl(var(--primary) / 0.25)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-card cursor-pointer group relative overflow-hidden"
          >
            {/* Background gradient on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.05 }}
              className={`absolute inset-0 ${stat.gradient}`}
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.2, 1],
                    delay: index * 0.2
                  }}
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  className={`w-10 h-10 ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>
                <div className={`
                  text-xs px-2 py-1 rounded-full font-medium
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
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-text-primary">
                  {stat.value}
                </div>
                <div className="text-text-secondary text-sm font-medium">
                  {stat.title}
                </div>
                <div className="text-text-muted text-xs">
                  {stat.subtext}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;