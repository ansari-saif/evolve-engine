import React, { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface BaseCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: 'none' | 'light' | 'medium' | 'strong';
  hover?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const BaseCard: React.FC<BaseCardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  radius = 'md',
  shadow = 'sm',
  border = 'light',
  hover = false,
  interactive = false,
  disabled = false,
  onClick,
}) => {
  const baseClasses = cn(
    // Base styles
    'relative transition-all duration-200',
    
    // Variant styles
    {
      'bg-background text-foreground': variant === 'default',
      'bg-transparent border border-border': variant === 'outlined',
      'bg-background shadow-lg': variant === 'elevated',
      'bg-muted/50': variant === 'flat',
    },
    
    // Padding styles
    {
      'p-0': padding === 'none',
      'p-2': padding === 'sm',
      'p-4': padding === 'md',
      'p-6': padding === 'lg',
    },
    
    // Radius styles
    {
      'rounded-none': radius === 'none',
      'rounded-sm': radius === 'sm',
      'rounded-md': radius === 'md',
      'rounded-lg': radius === 'lg',
      'rounded-full': radius === 'full',
    },
    
    // Shadow styles
    {
      'shadow-none': shadow === 'none',
      'shadow-sm': shadow === 'sm',
      'shadow-md': shadow === 'md',
      'shadow-lg': shadow === 'lg',
      'shadow-xl': shadow === 'xl',
    },
    
    // Border styles
    {
      'border-0': border === 'none',
      'border border-border/50': border === 'light',
      'border border-border': border === 'medium',
      'border-2 border-border': border === 'strong',
    },
    
    // Interactive styles
    {
      'cursor-pointer': interactive && !disabled,
      'cursor-not-allowed opacity-50': disabled,
      'hover:shadow-lg hover:-translate-y-0.5': hover && !disabled,
      'active:scale-95': interactive && !disabled,
    },
    
    className
  );

  return (
    <div 
      className={baseClasses}
      onClick={disabled ? undefined : onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive && !disabled ? 0 : undefined}
    >
      {children}
    </div>
  );
};

// Composition-based specialized cards
export const TaskCard = ({ children, ...props }: Omit<BaseCardProps, 'variant' | 'padding' | 'radius'>) => (
  <BaseCard
    variant="elevated"
    padding="md"
    radius="lg"
    hover={true}
    interactive={true}
    {...props}
  >
    {children}
  </BaseCard>
);

export const GoalCard = ({ children, ...props }: Omit<BaseCardProps, 'variant' | 'padding' | 'radius'>) => (
  <BaseCard
    variant="outlined"
    padding="lg"
    radius="md"
    hover={true}
    {...props}
  >
    {children}
  </BaseCard>
);

export const InfoCard = ({ children, ...props }: Omit<BaseCardProps, 'variant' | 'padding' | 'radius'>) => (
  <BaseCard
    variant="flat"
    padding="sm"
    radius="sm"
    {...props}
  >
    {children}
  </BaseCard>
);

export const ActionCard = ({ children, ...props }: Omit<BaseCardProps, 'variant' | 'padding' | 'radius'>) => (
  <BaseCard
    variant="default"
    padding="md"
    radius="md"
    hover={true}
    interactive={true}
    {...props}
  >
    {children}
  </BaseCard>
);

export default BaseCard;
