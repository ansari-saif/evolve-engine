import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { 
  BarChart3, 
  Code, 
  Palette, 
  Layers, 
  Settings 
} from 'lucide-react';
import { ControlCenterTab } from '../../hooks/useControlCenterState';

interface TabConfig {
  id: ControlCenterTab;
  label: string;
  icon: React.ReactNode;
}

interface ControlCenterTabsProps {
  activeTab: ControlCenterTab;
  onTabChange: (tab: ControlCenterTab) => void;
}

const tabConfigs: TabConfig[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'tokens', label: 'Design Tokens', icon: <Code className="w-4 h-4" /> },
  { id: 'themes', label: 'Theme Management', icon: <Palette className="w-4 h-4" /> },
  { id: 'components', label: 'Components', icon: <Layers className="w-4 h-4" /> },
  { id: 'settings', label: 'App Settings', icon: <Settings className="w-4 h-4" /> },
];

export const ControlCenterTabs: React.FC<ControlCenterTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-wrap gap-2 border-b border-border"
    >
      {tabConfigs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange(tab.id)}
          className="flex items-center gap-2"
        >
          {tab.icon}
          {tab.label}
        </Button>
      ))}
    </motion.div>
  );
};
