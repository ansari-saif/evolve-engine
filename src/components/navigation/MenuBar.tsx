import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import MenuToggleButton from './MenuToggleButton';
import { 
  Home, 
  CheckSquare, 
  Target, 
  BookOpen, 
  BarChart3, 
  Settings, 
  MessageSquare 
} from 'lucide-react';

interface MenuBarProps {
  className?: string;
}

const menuItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/diary', label: 'Diary', icon: BookOpen },
//   { to: '/statistics', label: 'Statistics', icon: BarChart3 },
//   { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
];

const MenuBar: React.FC<MenuBarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <MenuToggleButton isOpen={isOpen} onClick={toggleMenu} />
      
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[55]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              ref={menuRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-background/95 backdrop-blur-xl border-r border-border shadow-2xl z-[56]",
                className
              )}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">
                    Navigation
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Quick access to all sections
                  </p>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-4" aria-label="Main navigation">
                  <ul className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.to;
                      
                      return (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                              cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                  ? "bg-primary text-primary-foreground shadow-sm"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              )
                            }
                            onClick={() => setIsOpen(false)}
                          >
                            <Icon className="h-5 w-5" />
                            {item.label}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                  <div className="text-xs text-muted-foreground text-center">
                    Evolve Engine v1.0
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MenuBar;
