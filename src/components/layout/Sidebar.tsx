import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Target, 
  BookOpen, 
  BarChart3, 
  Settings,
  Sparkles
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Diary", href: "/diary", icon: BookOpen },
  { name: "Statistics", href: "/statistics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: isOpen ? 0 : -256, opacity: isOpen ? 1 : 0 }}
      className={`fixed left-0 top-0 h-full w-64 bg-surface/80 backdrop-blur-xl border-r border-border/50 pt-16 sm:pt-20 z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all group
                    ${isActive 
                      ? 'bg-gradient-primary text-white shadow-glow' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
                    }
                  `}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* AI Coach section */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="m-3 sm:m-4 p-3 sm:p-4 bg-gradient-motivation rounded-xl text-white relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2 w-8 h-8 opacity-30"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
          <div className="relative z-10">
            <h3 className="font-semibold text-xs sm:text-sm mb-1">AI Coach</h3>
            <p className="text-[10px] sm:text-xs opacity-90 leading-relaxed">
              "You're making great progress! Keep pushing toward your goals! 🚀"
            </p>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;