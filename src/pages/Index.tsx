import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import startupHero from "@/assets/startup-hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img 
          src={startupHero} 
          alt="Startup Journey Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/60" />
      </div>
      
      {/* Floating elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-20 left-20 w-16 h-16 bg-gradient-primary rounded-2xl opacity-30"
      />
      
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -3, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-32 right-32 w-12 h-12 bg-gradient-motivation rounded-full opacity-40"
      />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 1, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="inline-flex items-center space-x-2 mb-4"
          >
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-gradient-primary">Startup Journey</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="text-gradient-primary">Transform Your</span>
            <br />
            <span className="text-text-primary">Entrepreneurial Dream</span>
          </h1>
          
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
            AI-powered diary to track your one-year journey from employee to startup founder. 
            Beautiful progress tracking, smart task management, and personalized motivation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Button
            size="lg"
            onClick={() => navigate("/")}
            className="bg-gradient-primary hover:opacity-90 text-white px-8 py-4 text-lg font-semibold shadow-glow group"
          >
            Start Your Journey
            <motion.div
              whileHover={{ x: 5 }}
              className="ml-2"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </Button>
          
          <div className="text-text-muted text-sm">
            ✨ Free forever • 🚀 AI-powered • 📊 Beautiful analytics
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {[
            { icon: "🎯", title: "Goal Tracking", desc: "Hierarchical goals with smart milestones" },
            { icon: "🤖", title: "AI Coach", desc: "Personalized motivation and insights" },
            { icon: "📈", title: "Progress Analytics", desc: "Beautiful charts and productivity metrics" }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-text-secondary text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
