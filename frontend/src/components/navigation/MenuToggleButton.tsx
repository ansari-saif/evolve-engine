import React from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const MenuToggleButton: React.FC<MenuToggleButtonProps> = ({ 
  isOpen, 
  onClick, 
  className 
}) => {
  return (
    <button
      className={cn(
        "fixed top-2 left-2 sm:top-4 sm:left-4 z-[60] p-1.5 sm:p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg transition-all duration-200 hover:bg-background/90 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls="sidebar-menu"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? (
        <X className="h-4 w-4 sm:h-5 sm:w-5 text-foreground transition-transform duration-200" />
      ) : (
        <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-foreground transition-transform duration-200" />
      )}
    </button>
  );
};

export default MenuToggleButton;
