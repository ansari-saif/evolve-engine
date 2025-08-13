/**
 * Theme Selector Component
 * 
 * Provides a dropdown interface for switching between available themes.
 * Integrates with the ThemeProvider for dynamic theme switching.
 */

import React from 'react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Moon, Sun, Palette, Building2 } from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';
import { Theme } from '../../theme';
import { getThemeLabel } from '../../utils/themeRegistry';

const themeIcons: Record<Theme, React.ReactNode> = {
  dark: <Moon className="w-4 h-4" />,
  light: <Sun className="w-4 h-4" />,
  startup: <Palette className="w-4 h-4" />,
  enterprise: <Building2 className="w-4 h-4" />
};

const themeLabels: Record<Theme, string> = {
  dark: 'Dark',
  light: 'Light',
  startup: 'Startup',
  enterprise: 'Enterprise'
};

interface ThemeSelectorProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  className,
  variant = 'outline',
  size = 'default'
}) => {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          aria-label="Switch theme"
        >
          {themeIcons[theme]}
          {size !== 'icon' && (
            <span className="ml-2">{themeLabels[theme]}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {availableThemes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption}
            onClick={() => setTheme(themeOption)}
            className="flex items-center gap-2 cursor-pointer"
          >
            {themeIcons[themeOption]}
            <span>{getThemeLabel(themeOption)}</span>
            {themeOption === theme && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
