import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
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
  // Updater for color values (required)
  updateCustomThemeColor: (themeId: string, key: keyof CustomTheme['colors'], value: string) => void;
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
  updateCustomThemeColor,
}) => {
  const hslToCss = (value: string) => {
    // Accepts either "H S% L%" or "hsl(H S% L%)"
    const trimmed = value?.toString().trim() || '';
    if (/^hsl\(/i.test(trimmed)) return trimmed;
    if (/^\d+\s+\d+%\s+\d+%$/.test(trimmed)) return `hsl(${trimmed})`;
    return trimmed;
  };
  const hslNumbersToHex = (value: string) => {
    // value: "H S% L%"
    const m = value.match(/^(\d+)\s+(\d+)%\s+(\d+)%$/);
    if (!m) return '#000000';
    const h = parseInt(m[1], 10);
    const s = parseInt(m[2], 10) / 100;
    const l = parseInt(m[3], 10) / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m0 = l - c / 2;
    let r1 = 0, g1 = 0, b1 = 0;
    if (h < 60) { r1 = c; g1 = x; b1 = 0; }
    else if (h < 120) { r1 = x; g1 = c; b1 = 0; }
    else if (h < 180) { r1 = 0; g1 = c; b1 = x; }
    else if (h < 240) { r1 = 0; g1 = x; b1 = c; }
    else if (h < 300) { r1 = x; g1 = 0; b1 = c; }
    else { r1 = c; g1 = 0; b1 = x; }
    const r = Math.round((r1 + m0) * 255);
    const g = Math.round((g1 + m0) * 255);
    const b = Math.round((b1 + m0) * 255);
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  const cssToHex = (value: string) => {
    const trimmed = value?.toString().trim() || '';
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) return trimmed;
    const m = trimmed.match(/^hsl\(\s*(\d+)\s*,?\s*(\d+)%\s*,?\s*(\d+)%\s*\)$/i);
    if (m) return hslNumbersToHex(`${m[1]} ${m[2]}% ${m[3]}%`);
    // Fallback: try to parse H S% L% directly
    if (/^\d+\s+\d+%\s+\d+%$/.test(trimmed)) return hslNumbersToHex(trimmed);
    return '#000000';
  };
  const cssToHslNumbers = (value: string) => {
    const trimmed = value?.toString().trim() || '';
    const m = trimmed.match(/^hsl\(\s*(\d+)\s*,?\s*(\d+)%\s*,?\s*(\d+)%\s*\)$/i);
    if (m) return `${m[1]} ${m[2]}% ${m[3]}%`;
    return trimmed;
  };
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
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <Input
                      value={theme.name}
                      onChange={(e) => updateCustomThemeColor(theme.id, 'background', cssToHslNumbers(hslToCss(theme.colors.background))) /* placeholder to keep spacing */}
                      onBlur={(e) => {
                        const name = e.target.value.trim();
                        if (!name) return;
                        // Update theme name in storage/state
                        try {
                          const themes = JSON.parse(localStorage.getItem('evolve-custom-themes') || '[]');
                          const idx = themes.findIndex((t: any) => t.id === theme.id);
                          if (idx !== -1) {
                            themes[idx].name = name;
                            localStorage.setItem('evolve-custom-themes', JSON.stringify(themes));
                          }
                        } catch {}
                      }}
                      className="h-8 px-2 py-1 text-sm flex-1"
                    />
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
                  
                  {/* Color Preview + Inputs */}
                  <div className="grid grid-cols-4 gap-3 mb-3 items-center">
                    <div className="flex flex-col gap-1">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: hslToCss(theme.colors.primary) }}
                        title="Primary"
                      />
                       <input
                        type="color"
                        aria-label="Primary color picker"
                        className="h-6 w-full cursor-pointer bg-transparent border border-border rounded"
                        value={cssToHex(hslToCss(theme.colors.primary))}
                         onChange={(e) => updateCustomThemeColor(theme.id, 'primary', e.target.value)}
                      />
                       <input
                        aria-label="Primary color"
                        className="bg-background text-foreground border rounded px-1 py-0.5 text-xs"
                        value={cssToHslNumbers(hslToCss(theme.colors.primary))}
                         onChange={(e) => updateCustomThemeColor(theme.id, 'primary', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: hslToCss(theme.colors.secondary) }}
                        title="Secondary"
                      />
                       <input
                        type="color"
                        aria-label="Secondary color picker"
                        className="h-6 w-full cursor-pointer bg-transparent border border-border rounded"
                        value={cssToHex(hslToCss(theme.colors.secondary))}
                         onChange={(e) => updateCustomThemeColor(theme.id, 'secondary', e.target.value)}
                      />
                       <input
                        aria-label="Secondary color"
                        className="bg-background text-foreground border rounded px-1 py-0.5 text-xs"
                        value={cssToHslNumbers(hslToCss(theme.colors.secondary))}
                         onChange={(e) => updateCustomThemeColor(theme.id, 'secondary', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: hslToCss(theme.colors.background) }}
                        title="Background"
                      />
                       <input
                        type="color"
                        aria-label="Background color picker"
                        className="h-6 w-full cursor-pointer bg-transparent border border-border rounded"
                        value={cssToHex(hslToCss(theme.colors.background))}
                         onChange={(e) => updateCustomThemeColor(theme.id, 'background', e.target.value)}
                      />
                       <input
                        aria-label="Background color"
                        className="bg-background text-foreground border rounded px-1 py-0.5 text-xs"
                        value={cssToHslNumbers(hslToCss(theme.colors.background))}
                         onChange={(e) => updateCustomThemeColor(theme.id, 'background', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: hslToCss(theme.colors.surface) }}
                        title="Surface"
                      />
                       <input
                        type="color"
                        aria-label="Surface color picker"
                        className="h-6 w-full cursor-pointer bg-transparent border border-border rounded"
                        value={cssToHex(hslToCss(theme.colors.surface))}
                         onChange={(e) => updateCustomThemeColor(theme.id, 'surface', e.target.value)}
                      />
                       <input
                        aria-label="Surface color"
                        className="bg-background text-foreground border rounded px-1 py-0.5 text-xs"
                        value={cssToHslNumbers(hslToCss(theme.colors.surface))}
                         onChange={(e) => updateCustomThemeColor(theme.id, 'surface', e.target.value)}
                      />
                    </div>
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
