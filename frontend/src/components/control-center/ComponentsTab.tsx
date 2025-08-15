import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  Layers, 
  Box, 
  CheckCircle, 
  AlertCircle,
  Clock
} from 'lucide-react';

interface ComponentInfo {
  name: string;
  status: 'stable' | 'beta' | 'deprecated';
  category: string;
  description: string;
}

const componentData: ComponentInfo[] = [
  { name: 'Button', status: 'stable', category: 'Interactive', description: 'Primary interactive component' },
  { name: 'Card', status: 'stable', category: 'Layout', description: 'Container component for content' },
  { name: 'Input', status: 'stable', category: 'Form', description: 'Text input component' },
  { name: 'Modal', status: 'beta', category: 'Overlay', description: 'Dialog and modal components' },
  { name: 'Sidebar', status: 'stable', category: 'Navigation', description: 'Navigation sidebar component' },
  { name: 'Toast', status: 'stable', category: 'Feedback', description: 'Notification toast component' },
  { name: 'Table', status: 'beta', category: 'Data', description: 'Data table component' },
  { name: 'Chart', status: 'beta', category: 'Data', description: 'Chart and graph components' },
  { name: 'Calendar', status: 'deprecated', category: 'Date', description: 'Date picker component' },
];

const statusConfig = {
  stable: { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-500', label: 'Stable' },
  beta: { icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-500', label: 'Beta' },
  deprecated: { icon: <AlertCircle className="w-4 h-4" />, color: 'bg-red-500', label: 'Deprecated' },
};

export const ComponentsTab: React.FC = () => {
  const categories = [...new Set(componentData.map(c => c.category))];
  const statusCounts = componentData.reduce((acc, comp) => {
    acc[comp.status] = (acc[comp.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Component Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${statusConfig[status as keyof typeof statusConfig].color}`}>
                  {statusConfig[status as keyof typeof statusConfig].icon}
                </div>
                <div>
                  <p className="font-medium">{statusConfig[status as keyof typeof statusConfig].label}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Components by Category */}
      {categories.map((category, categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * categoryIndex }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {componentData
                  .filter(comp => comp.category === category)
                  .map((component, compIndex) => (
                    <motion.div
                      key={component.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * compIndex }}
                      className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{component.name}</h4>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${statusConfig[component.status].color}`}
                        >
                          {statusConfig[component.status].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {component.description}
                      </p>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
