/**
 * Control Center - Design System Management Dashboard
 * 
 * A comprehensive interface for managing themes, viewing design tokens,
 * and controlling various aspects of the application.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ThemeSelector } from '../components/ui/theme-selector';
import { useTheme } from '../providers/ThemeProvider';
import { tokens } from '../theme';
import { 
  Palette, 
  Settings, 
  Eye, 
  Code, 
  Layers, 
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
  Zap,
  Target,
  BarChart3,
  Grid3X3,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';

interface TokenCategory {
  name: string;
  icon: React.ReactNode;
  tokens: Array<{
    name: string;
    value: string;
    preview?: React.ReactNode;
  }>;
}

const ControlCenter: React.FC = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tokens' | 'themes' | 'components'>('overview');

  const copyToClipboard = async (text: string, tokenName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToken(tokenName);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const tokenCategories: TokenCategory[] = [
    {
      name: 'Colors',
      icon: <Palette className="w-4 h-4" />,
      tokens: [
        { name: 'Primary', value: tokens.colors.primary.DEFAULT },
        { name: 'Secondary', value: tokens.colors.secondary.DEFAULT },
        { name: 'Success', value: tokens.colors.success.DEFAULT },
        { name: 'Warning', value: tokens.colors.warning.DEFAULT },
        { name: 'Danger', value: tokens.colors.danger.DEFAULT },
        { name: 'Background', value: tokens.colors.background },
        { name: 'Surface', value: tokens.colors.surface },
      ]
    },
    {
      name: 'Gradients',
      icon: <Layers className="w-4 h-4" />,
      tokens: [
        { name: 'Primary', value: tokens.gradients.primary },
        { name: 'Motivation', value: tokens.gradients.motivation },
        { name: 'Success', value: tokens.gradients.success },
        { name: 'Warning', value: tokens.gradients.warning },
        { name: 'Subtle', value: tokens.gradients.subtle },
      ]
    },
    {
      name: 'Shadows',
      icon: <Eye className="w-4 h-4" />,
      tokens: [
        { name: 'Elegant', value: tokens.shadows.elegant },
        { name: 'Glow', value: tokens.shadows.glow },
        { name: 'Card', value: tokens.shadows.card },
      ]
    },
    {
      name: 'Animations',
      icon: <Zap className="w-4 h-4" />,
      tokens: [
        { name: 'Smooth', value: tokens.animations.smooth },
        { name: 'Spring', value: tokens.animations.spring },
      ]
    }
  ];

  const systemStats = [
    { label: 'Total Tokens', value: '47+', icon: <Grid3X3 className="w-4 h-4" /> },
    { label: 'Available Themes', value: availableThemes.length.toString(), icon: <Palette className="w-4 h-4" /> },
    { label: 'Components', value: '25+', icon: <Layers className="w-4 h-4" /> },
    { label: 'Performance', value: '98%', icon: <Zap className="w-4 h-4" /> },
  ];

  const renderTokenPreview = (tokenName: string, value: string) => {
    if (tokenName.toLowerCase().includes('color') || tokenName === 'Primary' || tokenName === 'Secondary' || tokenName === 'Success' || tokenName === 'Warning' || tokenName === 'Danger' || tokenName === 'Background' || tokenName === 'Surface') {
      return (
        <div 
          className="w-8 h-8 rounded-md border border-border"
          style={{ backgroundColor: value }}
        />
      );
    }
    if (tokenName.toLowerCase().includes('gradient')) {
      return (
        <div 
          className="w-8 h-8 rounded-md border border-border"
          style={{ background: value }}
        />
      );
    }
    if (tokenName.toLowerCase().includes('shadow')) {
      return (
        <div 
          className="w-8 h-8 rounded-md bg-card border border-border"
          style={{ boxShadow: value }}
        />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              Control Center
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage themes, view design tokens, and control application features
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSelector variant="outline" />
            <Badge variant="secondary" className="text-xs">
              {theme} mode
            </Badge>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 border-b border-border"
        >
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'tokens', label: 'Design Tokens', icon: <Code className="w-4 h-4" /> },
            { id: 'themes', label: 'Theme Management', icon: <Palette className="w-4 h-4" /> },
            { id: 'components', label: 'Components', icon: <Layers className="w-4 h-4" /> },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id as 'overview' | 'tokens' | 'themes' | 'components')}
              className="flex items-center gap-2"
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {activeTab === 'overview' && (
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
          )}

          {activeTab === 'tokens' && (
            <div className="space-y-6">
              {tokenCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * categoryIndex }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {category.icon}
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.tokens.map((token, tokenIndex) => (
                          <motion.div
                            key={token.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.05 * tokenIndex }}
                            className="group relative p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-foreground">{token.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(token.value, token.name)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                {copiedToken === token.name ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                            <div className="flex items-center gap-3">
                              {renderTokenPreview(token.name, token.value)}
                              <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded flex-1 truncate">
                                {token.value}
                              </code>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'themes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {availableThemes.map((themeOption, index) => (
                <motion.div
                  key={themeOption}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      theme === themeOption ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setTheme(themeOption)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold capitalize">{themeOption}</h3>
                        {theme === themeOption && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <div className="w-3 h-3 rounded-full bg-secondary"></div>
                          <div className="w-3 h-3 rounded-full bg-success"></div>
                          <div className="w-3 h-3 rounded-full bg-warning"></div>
                        </div>
                        <div className="h-8 rounded bg-gradient-to-r from-primary to-secondary"></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'components' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Buttons', icon: <Target className="w-6 h-6" />, count: '8 variants' },
                { name: 'Cards', icon: <Layers className="w-6 h-6" />, count: '5 types' },
                { name: 'Forms', icon: <Code className="w-6 h-6" />, count: '12 inputs' },
                { name: 'Navigation', icon: <Grid3X3 className="w-6 h-6" />, count: '6 components' },
                { name: 'Feedback', icon: <Sparkles className="w-6 h-6" />, count: '4 states' },
                { name: 'Layout', icon: <Monitor className="w-6 h-6" />, count: '3 systems' },
              ].map((component, index) => (
                <motion.div
                  key={component.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-primary">
                            {component.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{component.name}</h3>
                            <p className="text-sm text-muted-foreground">{component.count}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ControlCenter;
