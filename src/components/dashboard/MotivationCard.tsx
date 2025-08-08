import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Zap, Heart, Target } from "lucide-react";
import { useState, useEffect } from "react";

interface MotivationMessage {
  type: "celebration" | "encouragement" | "accountability" | "inspiration";
  message: string;
  icon: typeof Sparkles;
}

const motivationMessages: MotivationMessage[] = [
  {
    type: "celebration",
    message: "🎉 Amazing progress today! You're crushing your goals and building something incredible!",
    icon: Sparkles
  },
  {
    type: "encouragement", 
    message: "Every small step counts! You're 23% closer to your startup dream than yesterday. Keep going! 💪",
    icon: TrendingUp
  },
  {
    type: "accountability",
    message: "Time to focus! Your future self is counting on the decisions you make today. Let's make them count! ⚡",
    icon: Zap
  },
  {
    type: "inspiration",
    message: "Remember why you started. Every successful entrepreneur faced the same challenges you're facing now! 🚀",
    icon: Target
  }
];

const MotivationCard = () => {
  const [currentMessage, setCurrentMessage] = useState<MotivationMessage>(motivationMessages[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate AI fetching motivation based on user's current progress
    const fetchMotivation = () => {
      setIsLoading(true);
      setTimeout(() => {
        const randomMessage = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
        setCurrentMessage(randomMessage);
        setIsLoading(false);
      }, 1000);
    };

    fetchMotivation();
    
    // Update motivation every 30 seconds
    const interval = setInterval(fetchMotivation, 30000);
    return () => clearInterval(interval);
  }, []);

  const getGradientByType = (type: string) => {
    switch (type) {
      case "celebration": return "bg-gradient-success";
      case "encouragement": return "bg-gradient-primary";
      case "accountability": return "bg-gradient-warning";
      case "inspiration": return "bg-gradient-motivation";
      default: return "bg-gradient-primary";
    }
  };

  const Icon = currentMessage.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`
        ${getGradientByType(currentMessage.type)} rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer
        shadow-card hover:shadow-glow transition-all duration-300
      `}
    >
      {/* Animated background elements */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute -top-4 -right-4 w-16 h-16 opacity-20"
      >
        <Icon className="w-16 h-16" />
      </motion.div>
      
      <motion.div
        animate={{ 
          x: [0, 10, 0],
          y: [0, -5, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute -bottom-2 -left-2 w-8 h-8 opacity-10"
      >
        <Heart className="w-8 h-8" />
      </motion.div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"
            >
              <Icon className="w-4 h-4" />
            </motion.div>
            <h3 className="text-lg font-semibold">AI Coach</h3>
          </div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-white rounded-full"
          />
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="space-y-2"
            >
              <div className="h-3 bg-white/20 rounded w-full" />
              <div className="h-3 bg-white/20 rounded w-4/5" />
              <div className="h-3 bg-white/20 rounded w-3/4" />
            </motion.div>
          </div>
        ) : (
          <motion.div
            key={currentMessage.message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm leading-relaxed font-medium">
              {currentMessage.message}
            </p>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="h-0.5 bg-white/30 rounded-full mt-4 origin-left"
            />
            
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs opacity-80 capitalize">
                {currentMessage.type} Mode
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLoading(true);
                  setTimeout(() => {
                    const randomMessage = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
                    setCurrentMessage(randomMessage);
                    setIsLoading(false);
                  }, 800);
                }}
              >
                Refresh
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MotivationCard;