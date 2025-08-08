import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSpring, animated } from '@react-spring/web';

interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: number; // Controls the intensity of the liquid effect (1-10)
  color?: string; // Optional color override
  borderRadius?: string; // Optional border radius
  className?: string;
  disableHoverEffect?: boolean; // Disable hover animation
  bendFactor?: number; // Controls how much the element bends toward cursor (0-1)
}

const LiquidGlass = ({
  children,
  intensity = 5,
  color,
  borderRadius = '1rem',
  className,
  disableHoverEffect = false,
  bendFactor = 0.5,
  ...props
}: LiquidGlassProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Normalize intensity to a reasonable range
  const normalizedIntensity = Math.max(1, Math.min(10, intensity)) / 10;
  // Normalize bend factor to a reasonable range
  const normalizedBendFactor = Math.max(0, Math.min(1, bendFactor));

  // Use react-spring for smooth animations
  const [springProps, api] = useSpring(() => ({
    transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
    config: { mass: 1, tension: 280, friction: 60 }
  }));

  // Handle mouse move to create the liquid effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setPosition({ x, y });
    
    // Calculate rotation based on mouse position
    // Transform from [0,1] to [-15,15] degrees for rotation
    const rotateX = disableHoverEffect ? 0 : (0.5 - y) * 30 * normalizedBendFactor;
    const rotateY = disableHoverEffect ? 0 : (x - 0.5) * 30 * normalizedBendFactor;
    
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

  // Filter out custom props before passing to motion.div
  const { disableHoverEffect: _, ...motionProps } = props;
  
  return (
    <animated.div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden backdrop-blur-md transition-all duration-300',
        className
      )}
      style={{
        ...springProps,
        borderRadius,
        background: color || 'rgba(255, 255, 255, 0.1)',
        boxShadow: isHovering ? '0 10px 30px rgba(0, 0, 0, 0.2)' : '0 4px 10px rgba(0, 0, 0, 0.1)',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      {...motionProps}
    >
      {/* Liquid blob effect */}
      {isHovering && (
        <motion.div
          className="absolute pointer-events-none"
          animate={{
            x: `calc(${position.x * 100}% - 50%)`,
            y: `calc(${position.y * 100}% - 50%)`,
            scale: 1 + normalizedIntensity * 0.4,
          }}
          transition={{ type: 'spring', damping: 15, stiffness: 150 }}
          style={{
            width: '150%',
            height: '150%',
            borderRadius: '50%',
            background: `radial-gradient(
              circle,
              rgba(255, 255, 255, ${0.15 * normalizedIntensity}) 0%,
              rgba(255, 255, 255, 0) 70%
            )`,
            opacity: 0.8,
            left: '-25%',
            top: '-25%',
            transform: 'translateZ(10px)', // Slight 3D effect
          }}
        />
      )}

      {/* Border glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isHovering ? 0.7 : 0,
        }}
        style={{
          borderRadius,
          boxShadow: `inset 0 0 0 1px rgba(255, 255, 255, ${0.3 * normalizedIntensity})`,
          transform: 'translateZ(5px)', // Slight 3D effect
        }}
      />

      {/* Content */}
      <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </animated.div>
  );
};

export { LiquidGlass };