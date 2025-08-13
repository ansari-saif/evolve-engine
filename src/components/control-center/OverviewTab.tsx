import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  Grid3X3, 
  Palette, 
  Layers, 
  Zap,
  BarChart3,
  Target,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { usePerformanceMonitoring } from '../../hooks/usePerformanceMonitoring';

interface SystemStat {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface OverviewTabProps {
  availableThemes: string[];
  customThemes: Array<{ id: string; name: string }>;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ 
  availableThemes, 
  customThemes 
}) => {
  const { performanceMetrics, getPerformanceStatus } = usePerformanceMonitoring();

  const systemStats: SystemStat[] = [
    { label: 'Total Tokens', value: '47+', icon: <Grid3X3 className="w-4 h-4" /> },
    { label: 'Available Themes', value: (availableThemes.length + customThemes.length).toString(), icon: <Palette className="w-4 h-4" /> },
    { label: 'Components', value: '25+', icon: <Layers className="w-4 h-4" /> },
    { label: 'Performance', value: 'Optimized', icon: <Zap className="w-4 h-4" /> },
  ];

  const performanceStatus = getPerformanceStatus();
  const statusColors = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="text-primary">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Performance Metrics
            <Badge 
              variant="secondary" 
              className={`ml-2 ${statusColors[performanceStatus]}`}
            >
              {performanceStatus}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Load Time</p>
              <p className="text-lg font-semibold">{performanceMetrics.loadTime.toFixed(0)}ms</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Memory Usage</p>
              <p className="text-lg font-semibold">{performanceMetrics.memoryUsage.toFixed(1)}MB</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Render Time</p>
              <p className="text-lg font-semibold">{performanceMetrics.renderTime.toFixed(1)}ms</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Network Requests</p>
              <p className="text-lg font-semibold">{performanceMetrics.networkRequests}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Device Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Monitor className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium">Desktop</p>
                <p className="text-sm text-muted-foreground">Full support</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Tablet className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium">Tablet</p>
                <p className="text-sm text-muted-foreground">Responsive</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Smartphone className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium">Mobile</p>
                <p className="text-sm text-muted-foreground">Optimized</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
