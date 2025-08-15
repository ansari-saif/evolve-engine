import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variantClasses = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: 'rounded'
  };

  const style = {
    width: width,
    height: height
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  );
};

interface SkeletonLoaderProps {
  count?: number;
  className?: string;
  itemClassName?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 1,
  className,
  itemClassName,
  variant = 'text'
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          className={itemClassName}
        />
      ))}
    </div>
  );
};
