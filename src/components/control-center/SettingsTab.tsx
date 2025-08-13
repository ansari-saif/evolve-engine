import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Slider } from '../../components/ui/slider';
import { 
  Settings, 
  Bell, 
  Volume2, 
  VolumeX,
  Save,
  Zap,
  Smartphone,
  Sun,
  Moon,
  RefreshCw
} from 'lucide-react';
import { useAppSettings } from '../../hooks/useAppSettings';

export const SettingsTab: React.FC = () => {
  const { 
    settings, 
    updateSetting, 
    resetToDefaults, 
    getSettingsSummary 
  } = useAppSettings();

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for important events
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSetting('notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound">Sound Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Play sounds for notifications
              </p>
            </div>
            <Switch
              id="sound"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
              disabled={!settings.notifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="performance-mode">Performance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Optimize for better performance (may reduce visual effects)
              </p>
            </div>
            <Switch
              id="performance-mode"
              checked={settings.performanceMode}
              onCheckedChange={(checked) => updateSetting('performanceMode', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-save">Auto Save</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save changes
              </p>
            </div>
            <Switch
              id="auto-save"
              checked={settings.autoSave}
              onCheckedChange={(checked) => updateSetting('autoSave', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Display
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="mobile-optimized">Mobile Optimized</Label>
              <p className="text-sm text-muted-foreground">
                Optimize layout for mobile devices
              </p>
            </div>
            <Switch
              id="mobile-optimized"
              checked={settings.mobileOptimized}
              onCheckedChange={(checked) => updateSetting('mobileOptimized', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode-auto">Auto Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Automatically switch to dark mode based on system preference
              </p>
            </div>
            <Switch
              id="dark-mode-auto"
              checked={settings.darkModeAuto}
              onCheckedChange={(checked) => updateSetting('darkModeAuto', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{getSettingsSummary()}</p>
              <p className="text-sm text-muted-foreground">
                {Object.values(settings).filter(Boolean).length} of {Object.keys(settings).length} settings are enabled
              </p>
            </div>
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
