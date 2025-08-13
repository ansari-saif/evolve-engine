import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Palette, 
  Plus, 
  Trash2, 
  Edit3,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

interface CustomTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
  };
}

interface ThemesTabProps {
  availableThemes: string[];
  customThemes: CustomTheme[];
  activeCustomTheme: string | null;
  onCreateCustomTheme: () => void;
  onDeleteCustomTheme: (themeId: string) => void;
  onApplyCustomTheme: (themeId: string) => void;
  onResetToDefault: () => void;
  onExportConfiguration: () => void;
  onImportConfiguration: () => void;
}

export const ThemesTab: React.FC<ThemesTabProps> = ({
  availableThemes,
  customThemes,
  activeCustomTheme,
  onCreateCustomTheme,
  onDeleteCustomTheme,
  onApplyCustomTheme,
  onResetToDefault,
  onExportConfiguration,
  onImportConfiguration,
}) => {
  return (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableThemes.map((theme, index) => (
              <motion.div
                key={theme}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{theme}</h4>
                  <Badge variant="secondary">Built-in</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pre-configured theme with optimized colors and spacing
                </p>
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
              <Palette className="w-5 h-5" />
              Custom Themes
            </CardTitle>
            <Button onClick={onCreateCustomTheme} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Theme
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {customThemes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No custom themes yet</p>
              <p className="text-sm">Create your first custom theme to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customThemes.map((theme, index) => (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{theme.name}</h4>
                    <div className="flex items-center gap-1">
                      {activeCustomTheme === theme.id && (
                        <Badge variant="default" className="text-xs">Active</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteCustomTheme(theme.id)}
                        className="h-6 w-6 p-0 text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Color Preview */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary"
                    />
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary"
                    />
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: theme.colors.background }}
                      title="Background"
                    />
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: theme.colors.surface }}
                      title="Surface"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApplyCustomTheme(theme.id)}
                      className="flex-1"
                      disabled={activeCustomTheme === theme.id}
                    >
                      {activeCustomTheme === theme.id ? 'Active' : 'Apply'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Theme Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={onResetToDefault}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Default
            </Button>
            <Button
              variant="outline"
              onClick={onExportConfiguration}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Themes
            </Button>
            <Button
              variant="outline"
              onClick={onImportConfiguration}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import Themes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
