/**
 * Control Center - Design System Management Dashboard
 * 
 * A comprehensive interface for managing themes, viewing design tokens,
 * and controlling various aspects of the application.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { performanceMetrics } from '../utils/performance';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { ThemeSelector } from '../components/ui/theme-selector';
import { useTheme } from '../providers/ThemeProvider';
import { tokens } from '../theme';
import { useDesignSystem } from '../hooks/useDesignSystem';
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
  RefreshCw,
  Save,
  Plus,
  Trash2,
  Edit3,
  Download,
  Upload,
  ToggleLeft,
  ToggleRight,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Smartphone as MobileIcon,
  Monitor as DesktopIcon
} from 'lucide-react';

interface TokenCategory {
  name: string;
  icon: React.ReactNode;
  tokens: Array<{
    name: string;
    value: string;
    preview?: React.ReactNode;
    editable?: boolean;
  }>;
}

interface CustomTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
  };
}

const ControlCenter: React.FC = () => {
  const startTime = performance.now();
  
  const { theme, setTheme, availableThemes } = useTheme();
  const {
    updateToken,
    getTokenValue,
    customTokens,
    createCustomTheme,
    deleteCustomTheme,
    applyCustomThemeById,
    customThemes,
    activeCustomTheme,
    resetToDefaultTheme,
    exportConfiguration,
    importConfiguration,
  } = useDesignSystem();
  
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tokens' | 'themes' | 'components' | 'settings'>('overview');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [tokenValue, setTokenValue] = useState('');
  const [selectedTokenCategory, setSelectedTokenCategory] = useState<string>('');
  
  // Performance tracking
  useEffect(() => {
    performanceMetrics.componentRender('ControlCenter', startTime);
  }, [startTime]);

  // App control state
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [mobileOptimized, setMobileOptimized] = useState(false);
  const [darkModeAuto, setDarkModeAuto] = useState(false);

  // Performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    memoryUsage: 0,
    renderTime: 0,
    networkRequests: 0
  });

  useEffect(() => {
    // Simulate performance monitoring
    const interval = setInterval(() => {
      setPerformanceMetrics({
        loadTime: Math.random() * 1000 + 200,
        memoryUsage: Math.random() * 50 + 20,
        renderTime: Math.random() * 16 + 8,
        networkRequests: Math.floor(Math.random() * 10) + 2
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async (text: string, tokenName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToken(tokenName);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCreateCustomTheme = () => {
    createCustomTheme(`Custom Theme ${customThemes.length + 1}`, {
      primary: '#6366F1',
      secondary: '#EC4899',
      background: '#0F172A',
      surface: '#1E293B',
      foreground: '#F8FAFC',
      muted: '#334155',
      accent: '#334155'
    });
  };

  const handleDeleteCustomTheme = (themeId: string) => {
    deleteCustomTheme(themeId);
  };

  const handleUpdateToken = (tokenName: string, newValue: string) => {
    if (selectedTokenCategory && tokenName) {
      updateToken(selectedTokenCategory, tokenName, newValue);
      setSelectedToken(null);
      setTokenValue('');
      setSelectedTokenCategory('');
    }
  };

  const handleExportDesignSystem = () => {
    exportConfiguration();
  };

  const tokenCategories: TokenCategory[] = [
    {
      name: 'Colors',
      icon: <Palette className="w-4 h-4" />,
      tokens: [
        { name: 'Primary', value: getTokenValue('colors', 'Primary'), editable: true },
        { name: 'Secondary', value: getTokenValue('colors', 'Secondary'), editable: true },
        { name: 'Success', value: getTokenValue('colors', 'Success'), editable: true },
        { name: 'Warning', value: getTokenValue('colors', 'Warning'), editable: true },
        { name: 'Danger', value: getTokenValue('colors', 'Danger'), editable: true },
        { name: 'Background', value: getTokenValue('colors', 'Background'), editable: true },
        { name: 'Surface', value: getTokenValue('colors', 'Surface'), editable: true },
      ]
    },
    {
      name: 'Gradients',
      icon: <Layers className="w-4 h-4" />,
      tokens: [
        { name: 'Primary', value: getTokenValue('gradients', 'Primary'), editable: true },
        { name: 'Motivation', value: getTokenValue('gradients', 'Motivation'), editable: true },
        { name: 'Success', value: getTokenValue('gradients', 'Success'), editable: true },
        { name: 'Warning', value: getTokenValue('gradients', 'Warning'), editable: true },
        { name: 'Subtle', value: getTokenValue('gradients', 'Subtle'), editable: true },
      ]
    },
    {
      name: 'Shadows',
      icon: <Eye className="w-4 h-4" />,
      tokens: [
        { name: 'Elegant', value: getTokenValue('shadows', 'Elegant'), editable: true },
        { name: 'Glow', value: getTokenValue('shadows', 'Glow'), editable: true },
        { name: 'Card', value: getTokenValue('shadows', 'Card'), editable: true },
      ]
    },
    {
      name: 'Animations',
      icon: <Zap className="w-4 h-4" />,
      tokens: [
        { name: 'Smooth', value: getTokenValue('animations', 'Smooth'), editable: true },
        { name: 'Spring', value: getTokenValue('animations', 'Spring'), editable: true },
      ]
    }
  ];

  const systemStats = [
    { label: 'Total Tokens', value: '47+', icon: <Grid3X3 className="w-4 h-4" /> },
    { label: 'Available Themes', value: (availableThemes.length + customThemes.length).toString(), icon: <Palette className="w-4 h-4" /> },
    { label: 'Components', value: '25+', icon: <Layers className="w-4 h-4" /> },
    { label: 'Performance', value: `${Math.round(100 - performanceMetrics.renderTime)}%`, icon: <Zap className="w-4 h-4" /> },
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
            <Button onClick={handleExportDesignSystem} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
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
            { id: 'settings', label: 'App Settings', icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id as 'overview' | 'tokens' | 'themes' | 'components' | 'settings')}
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
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Load Time</p>
                      <p className="text-lg font-semibold">{Math.round(performanceMetrics.loadTime)}ms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Memory Usage</p>
                      <p className="text-lg font-semibold">{Math.round(performanceMetrics.memoryUsage)}MB</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Render Time</p>
                      <p className="text-lg font-semibold">{Math.round(performanceMetrics.renderTime)}ms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Network Requests</p>
                      <p className="text-lg font-semibold">{performanceMetrics.networkRequests}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                              <div className="flex gap-1">
                                {token.editable && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedToken(token.name);
                                      setTokenValue(token.value);
                                      setSelectedTokenCategory(category.name.toLowerCase());
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                )}
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

              {/* Token Editor Modal */}
              {selectedToken && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Edit Token: {selectedToken}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tokenValue">Value</Label>
                        <Input
                          id="tokenValue"
                          value={tokenValue}
                          onChange={(e) => setTokenValue(e.target.value)}
                          placeholder="Enter new token value..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdateToken(selectedToken, tokenValue)}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setSelectedToken(null);
                          setTokenValue('');
                        }}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'themes' && (
            <div className="space-y-6">
              {/* Built-in Themes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Built-in Themes
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              {/* Custom Themes */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Custom Themes
                    </CardTitle>
                    <Button onClick={handleCreateCustomTheme} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Theme
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {customThemes.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No custom themes yet. Create your first theme!
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {customThemes.map((customTheme, index) => (
                        <Card key={index} className="relative">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold">{customTheme.name}</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCustomTheme(customTheme.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <div className="flex gap-1">
                                <div 
                                  className="w-3 h-3 rounded-full border border-border"
                                  style={{ backgroundColor: customTheme.colors.primary }}
                                ></div>
                                <div 
                                  className="w-3 h-3 rounded-full border border-border"
                                  style={{ backgroundColor: customTheme.colors.secondary }}
                                ></div>
                                <div 
                                  className="w-3 h-3 rounded-full border border-border"
                                  style={{ backgroundColor: customTheme.colors.background }}
                                ></div>
                                <div 
                                  className="w-3 h-3 rounded-full border border-border"
                                  style={{ backgroundColor: customTheme.colors.surface }}
                                ></div>
                              </div>
                              <div 
                                className="h-8 rounded"
                                style={{ 
                                  background: `linear-gradient(135deg, ${customTheme.colors.primary} 0%, ${customTheme.colors.secondary} 100%)`
                                }}
                              ></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
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

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* App Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Application Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Notifications</Label>
                          <p className="text-sm text-muted-foreground">Enable push notifications</p>
                        </div>
                        <Switch
                          checked={notifications}
                          onCheckedChange={setNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Sound Effects</Label>
                          <p className="text-sm text-muted-foreground">Play sound notifications</p>
                        </div>
                        <Switch
                          checked={soundEnabled}
                          onCheckedChange={setSoundEnabled}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Auto Save</Label>
                          <p className="text-sm text-muted-foreground">Automatically save changes</p>
                        </div>
                        <Switch
                          checked={autoSave}
                          onCheckedChange={setAutoSave}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Performance Mode</Label>
                          <p className="text-sm text-muted-foreground">Optimize for speed</p>
                        </div>
                        <Switch
                          checked={performanceMode}
                          onCheckedChange={setPerformanceMode}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Mobile Optimized</Label>
                          <p className="text-sm text-muted-foreground">Optimize for mobile devices</p>
                        </div>
                        <Switch
                          checked={mobileOptimized}
                          onCheckedChange={setMobileOptimized}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Auto Dark Mode</Label>
                          <p className="text-sm text-muted-foreground">Follow system theme</p>
                        </div>
                        <Switch
                          checked={darkModeAuto}
                          onCheckedChange={setDarkModeAuto}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <RefreshCw className="w-6 h-6" />
                      <span>Reset Settings</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Download className="w-6 h-6" />
                      <span>Export Config</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Upload className="w-6 h-6" />
                      <span>Import Config</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ControlCenter;
