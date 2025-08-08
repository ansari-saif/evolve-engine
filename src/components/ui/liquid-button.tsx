import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSpring, animated } from '@react-spring/web';

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  bendFactor?: number; // Controls how much the button bends toward cursor (0-1)
}

const LiquidButton = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className,
  bendFactor = 0.3, // Less bend for buttons by default
  ...props
}: LiquidButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  
  // Normalize bend factor to a reasonable range
  const normalizedBendFactor = Math.max(0, Math.min(1, bendFactor));
  
  // Use react-spring for smooth animations
  const [springProps, api] = useSpring(() => ({
    transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
    config: { mass: 1, tension: 280, friction: 60 }
  }));
  
  // Handle mouse move for bending effect
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
    
    // Calculate rotation based on mouse position
    // Transform from [0,1] to [-10,10] degrees for rotation (less than cards)
    const rotateX = (0.5 - y) * 20 * normalizedBendFactor;
    const rotateY = (x - 0.5) * 20 * normalizedBendFactor;
    
    // Update spring animation
    api.start({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    // Reset rotation when mouse leaves
    api.start({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
    });
  };
  
  // Map variant to gradient class
  const gradientMap = {
    primary: 'bg-gradient-primary',
    secondary: 'bg-gradient-motivation',
    success: 'bg-gradient-success',
    warning: 'bg-gradient-warning',
    subtle: 'bg-gradient-subtle',
  };

  // Map size to padding and text size
  const sizeMap = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <animated.button
      ref={buttonRef}
      className={cn(
        gradientMap[variant],
        sizeMap[size],
        'relative overflow-hidden rounded-lg text-white font-medium',
        'flex items-center justify-center gap-2',
        'shadow-card hover:shadow-glow transition-all duration-300',
        className
      )}
      style={{
        ...springProps,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Liquid effect overlay */}
      {isHovering && (
        <motion.div
          className="absolute inset-0 w-full h-full pointer-events-none"
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
              rgba(255, 255, 255, 0.2) 0%,
              rgba(255, 255, 255, 0) 70%
            )`,
            opacity: 0.8,
            left: '-25%',
            top: '-25%',
            transform: 'translateZ(5px)', // Slight 3D effect
          }}
        />
      )}

      {/* Shimmering border effect */}
      {isHovering && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.3)',
            transform: 'translateZ(3px)', // Slight 3D effect
          }}
        />
      )}

      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center gap-2" style={{ transform: 'translateZ(10px)' }}>
        {icon && (
          <motion.div
            whileHover={{ rotate: 15, scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          >
            {icon}
          </motion.div>
        )}
        {children}
      </div>
    </animated.button>
  );
};

export { LiquidButton };