import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ContrastWarning, ContrastIndicator } from '../../components/ui/contrast-warning';
import { useTheme } from '../../providers/ThemeProvider';
import { getThemeVariables } from '../../utils/themeManager';
import { 
  Palette, 
  Layers, 
  Eye, 
  Zap,
  Copy,
  Check,
  Edit3
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

interface TokensTabProps {
  tokenCategories: TokenCategory[];
  copiedToken: string | null;
  selectedToken: string | null;
  tokenValue: string;
  onCopyToken: (text: string, tokenName: string) => void;
  onSelectToken: (tokenName: string, value: string) => void;
  onUpdateToken: (tokenName: string, newValue: string) => void;
  onTokenValueChange: (value: string) => void;
}

export const TokensTab: React.FC<TokensTabProps> = ({
  tokenCategories,
  copiedToken,
  selectedToken,
  tokenValue,
  onCopyToken,
  onSelectToken,
  onUpdateToken,
  onTokenValueChange,
}) => {
  const { theme } = useTheme();
  
  // Helper to determine if we should show contrast warnings
  const shouldCheckContrast = (tokenName: string, value: string) => {
    const isColor = tokenName.toLowerCase().includes('color') || 
                   ['Primary', 'Secondary', 'Success', 'Warning', 'Danger', 'Background', 'Surface', 'Foreground'].some(type => 
                     tokenName.includes(type)
                   );
    return isColor && !tokenName.toLowerCase().includes('gradient') && !tokenName.toLowerCase().includes('shadow');
  };

  // Get actual color values from theme manager as fallback
  const getActualColorValue = (tokenName: string, fallbackValue: string) => {
    try {
      const themeVars = getThemeVariables(theme);
      
      // Map token names to CSS variable names
      const cssVarMap: Record<string, string> = {
        'primary': '--primary',
        'secondary': '--secondary',
        'success': '--success',
        'warning': '--warning',
        'danger': '--danger',
        'background': '--background',
        'surface': '--surface',
        'foreground': '--foreground'
      };
      
      const lowerName = tokenName.toLowerCase();
      for (const [key, cssVar] of Object.entries(cssVarMap)) {
        if (lowerName.includes(key)) {
          const actualValue = themeVars[cssVar];
          if (actualValue) {
            // Convert HSL values to proper format
            if (/^\d+\s+\d+%\s+\d+%$/.test(actualValue)) {
              const resolved = `hsl(${actualValue})`;
              console.log(`Resolved ${tokenName} (${fallbackValue}) -> ${resolved}`);
              return resolved;
            }
            console.log(`Using direct value for ${tokenName}: ${actualValue}`);
            return actualValue;
          }
        }
      }
      
      console.log(`No mapping found for ${tokenName}, using fallback: ${fallbackValue}`);
    } catch (error) {
      console.warn('Failed to get actual color value:', error);
    }
    
    return fallbackValue;
  };

  // Get background color for contrast checking (fallback to a default)
  const getBackgroundColor = () => {
    try {
      // Use theme manager to get the actual background value
      const themeVars = getThemeVariables(theme);
      const backgroundValue = themeVars['--background'];
      
      if (backgroundValue) {
        // Convert HSL values to proper format
        if (/^\d+\s+\d+%\s+\d+%$/.test(backgroundValue)) {
          const resolved = `hsl(${backgroundValue})`;
          console.log(`Background resolved to: ${resolved}`);
          return resolved;
        }
        return backgroundValue;
      }
    } catch (error) {
      console.warn('Failed to get background from theme manager:', error);
    }
    
    // Fallback to reading the actual CSS variable value
    try {
      const computedStyle = getComputedStyle(document.documentElement);
      const bgValue = computedStyle.getPropertyValue('--background').trim();
      if (bgValue) {
        if (/^\d+\s+\d+%\s+\d+%$/.test(bgValue)) {
          return `hsl(${bgValue})`;
        }
        return bgValue;
      }
    } catch (error) {
      console.warn('Failed to read background CSS variable:', error);
    }
    
    return 'hsl(220, 13%, 6%)'; // Default dark background
  };

  const backgroundColor = getBackgroundColor();

  const renderTokenPreview = (tokenName: string, value: string) => {
    if (tokenName.toLowerCase().includes('color') || 
        ['Primary', 'Secondary', 'Success', 'Warning', 'Danger', 'Background', 'Surface'].includes(tokenName)) {
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
                    className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{token.name}</h4>
                      <div className="flex items-center gap-1">
                        {token.preview || renderTokenPreview(token.name, token.value)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCopyToken(token.value, token.name)}
                          className="h-6 w-6 p-0"
                        >
                          {copiedToken === token.name ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                        {token.editable && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSelectToken(token.name, token.value)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-mono break-all">
                        {token.value}
                      </p>
                      {shouldCheckContrast(token.name, token.value) && !token.name.toLowerCase().includes('background') && (
                        <ContrastIndicator
                          foreground={getActualColorValue(token.name, token.value)}
                          background={backgroundColor}
                          className="self-start"
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Token Editor */}
      {selectedToken && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Edit Token: {selectedToken}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="token-value">Value</Label>
                <Input
                  id="token-value"
                  value={tokenValue}
                  onChange={(e) => onTokenValueChange(e.target.value)}
                  placeholder="Enter new value..."
                />
              </div>
              
              {/* Show contrast warning for color tokens */}
              {shouldCheckContrast(selectedToken, tokenValue) && !selectedToken.toLowerCase().includes('background') && tokenValue && (
                <ContrastWarning
                  foreground={getActualColorValue(selectedToken, tokenValue)}
                  background={backgroundColor}
                  className="mt-3"
                  showDetails={true}
                />
              )}
              
              <div className="flex gap-2">
                <Button
                  onClick={() => onUpdateToken(selectedToken, tokenValue)}
                  className="flex-1"
                >
                  Update
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onSelectToken('', '')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
