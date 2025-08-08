import React, { useRef, useState } from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LiquidCardProps extends Omit<
  React.ComponentProps<typeof motion.div>,
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDragCapture'
  | 'onDragStartCapture'
  | 'onDragEndCapture'
> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning';
  hoverEffect?: 'lift' | 'glow' | 'both' | 'none';
  className?: string;
  borderGlow?: boolean;
  bendFactor?: number;
}

const LiquidCard = ({
  children,
  variant = 'default',
  hoverEffect = 'both',
  className,
  borderGlow = true,
  bendFactor = 0.5,
  ...props
}: LiquidCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Initialize motion values for smooth animations
  
  // Use framer-motion for smoother animations
  // Use framer-motion's motion values for smooth animations
  // Initialize motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform motion values to rotation values
  const rotateX = useTransform(y, [-100, 100], [-30, 30]);
  const rotateY = useTransform(x, [-100, 100], [30, -30]);

  // Map variant to background styles
  const variantStyles = {
    default: 'bg-card/80 backdrop-blur-sm',
    primary: 'bg-primary/10 backdrop-blur-sm',
    secondary: 'bg-secondary/10 backdrop-blur-sm',
    success: 'bg-success/10 backdrop-blur-sm',
    warning: 'bg-warning/10 backdrop-blur-sm',
  };

  // Map variant to border glow styles
  const glowStyles = {
    default: 'shadow-glow',
    primary: 'shadow-[0_0_30px_rgba(99,102,241,0.3)]',
    secondary: 'shadow-[0_0_30px_rgba(236,72,153,0.3)]',
    success: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]',
    warning: 'shadow-[0_0_30px_rgba(234,179,8,0.3)]',
  };

  // Handle mouse move for bending effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) - rect.width / 2;
    const mouseY = (e.clientY - rect.top) - rect.height / 2;
    // store normalized position for light effect
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
    
    // Apply bend factor to scale the effect
    const scaledX = mouseX * (bendFactor || 0.5);
    const scaledY = mouseY * (bendFactor || 0.5);
    
    // Update motion values
    x.set(scaledX);
    y.set(-scaledY);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    // Reset motion values on leave
    x.set(0);
    y.set(0);
  };

  // Determine hover animation based on hoverEffect prop
  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case 'lift':
        return { y: -8 };
      case 'glow':
        return { boxShadow: borderGlow ? glowStyles[variant] : undefined };
      case 'both':
        return { 
          y: -8,
          boxShadow: borderGlow ? glowStyles[variant] : undefined
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border/50 p-6 transition-all duration-300',
        variantStyles[variant],
        className
      )}
      style={{
        transform: `perspective(800px) rotateX(${rotateX}) rotateY(${rotateY})`,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backfaceVisibility: 'hidden'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Liquid light effect */}
      {isHovering && (
        <motion.div
          className="absolute pointer-events-none"
          animate={{
            x: `calc(${mousePosition.x * 100}% - 50%)`,
            y: `calc(${mousePosition.y * 100}% - 50%)`,
          }}
          transition={{ type: 'spring', damping: 15, stiffness: 150 }}
          style={{
            width: '150%',
            height: '150%',
            borderRadius: '50%',
            background: `radial-gradient(
              circle,
              rgba(255, 255, 255, 0.15) 0%,
              rgba(255, 255, 255, 0) 70%
            )`,
            opacity: 0.8,
            left: '-25%',
            top: '-25%',
            zIndex: 0,
            transform: 'translateZ(10px)', // Slight 3D effect
          }}
        />
      )}

      {/* Border highlight effect */}
      {borderGlow && isHovering && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            borderRadius: 'inherit',
            boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.3)',
            transform: 'translateZ(5px)', // Slight 3D effect
          }}
        />
      )}

      {/* Card content */}
      <div className="relative z-10" style={{ transform: 'translateZ(15px)' }}>{children}</div>
    </motion.div>
  );
};

export { LiquidCard };