/**
 * Theme Accessibility Auditor
 * 
 * Analyzes built-in themes for WCAG compliance and provides accessibility reports.
 * Helps ensure all theme colors meet accessibility standards.
 */

import { analyzeContrast, ContrastResult, isAccessible } from './contrastChecker';
import { getThemeVariables } from './themeManager';
import { Theme } from '../theme';

export interface ColorPair {
  foreground: string;
  background: string;
  usage: string;
  required?: boolean; // If this combination is critical for accessibility
}

export interface ThemeAuditResult {
  theme: Theme;
  score: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  totalPairs: number;
  passingPairs: number;
  failingPairs: number;
  results: Array<{
    pair: ColorPair;
    contrast: ContrastResult;
    passes: boolean;
  }>;
  recommendations: string[];
}

export interface AccessibilityReport {
  themes: ThemeAuditResult[];
  overallScore: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  summary: {
    totalThemes: number;
    compliantThemes: number;
    issuesFound: number;
  };
  recommendations: string[];
}

/**
 * Define critical color pairs that should be checked in each theme
 */
const CRITICAL_COLOR_PAIRS: Array<{
  foregroundKey: string;
  backgroundKey: string;
  usage: string;
  required?: boolean;
}> = [
  // Primary text combinations
  { foregroundKey: '--foreground', backgroundKey: '--background', usage: 'Primary text on main background', required: true },
  { foregroundKey: '--text-primary', backgroundKey: '--background', usage: 'Primary text on main background', required: true },
  { foregroundKey: '--card-foreground', backgroundKey: '--card', usage: 'Text on card backgrounds', required: true },
  { foregroundKey: '--popover-foreground', backgroundKey: '--popover', usage: 'Text in popovers', required: true },
  
  // Interactive elements
  { foregroundKey: '--primary-foreground', backgroundKey: '--primary', usage: 'Primary button text', required: true },
  { foregroundKey: '--secondary-foreground', backgroundKey: '--secondary', usage: 'Secondary button text', required: true },
  { foregroundKey: '--destructive-foreground', backgroundKey: '--destructive', usage: 'Destructive button text', required: true },
  
  // Status indicators
  { foregroundKey: '--success-foreground', backgroundKey: '--success', usage: 'Success message text', required: true },
  { foregroundKey: '--warning-foreground', backgroundKey: '--warning', usage: 'Warning message text', required: true },
  { foregroundKey: '--danger-foreground', backgroundKey: '--danger', usage: 'Error message text', required: true },
  
  // Secondary text
  { foregroundKey: '--text-secondary', backgroundKey: '--background', usage: 'Secondary text on main background' },
  { foregroundKey: '--muted-foreground', backgroundKey: '--muted', usage: 'Muted text on muted background' },
  { foregroundKey: '--muted-foreground', backgroundKey: '--background', usage: 'Muted text on main background' },
  
  // Accent elements  
  { foregroundKey: '--accent-foreground', backgroundKey: '--accent', usage: 'Accent text on accent background' },
  
  // Form elements
  { foregroundKey: '--foreground', backgroundKey: '--input', usage: 'Input field text' },
];

/**
 * Resolves CSS variable references to actual color values
 */
function resolveColorValue(value: string, variables: Record<string, string>): string {
  // If it's already a resolved value, return it
  if (!value.includes('var(')) {
    return value;
  }
  
  // Extract variable name from var(--variable-name)
  const match = value.match(/var\(([^)]+)\)/);
  if (match) {
    const varName = match[1];
    return variables[varName] || value;
  }
  
  return value;
}

/**
 * Converts HSL values to proper HSL string format
 */
function normalizeHslValue(value: string): string {
  // If it's already properly formatted, return as-is
  if (value.startsWith('hsl(') || value.startsWith('#')) {
    return value;
  }
  
  // Convert space-separated HSL values to proper format
  if (/^\d+\s+\d+%\s+\d+%$/.test(value.trim())) {
    return `hsl(${value.replace(/\s+/g, ', ')})`;
  }
  
  return value;
}

/**
 * Audits a single theme for accessibility compliance
 */
export function auditTheme(theme: Theme): ThemeAuditResult {
  if (theme === 'system') {
    // System theme resolves to other themes, so we can't audit it directly
    return {
      theme,
      score: 'good',
      totalPairs: 0,
      passingPairs: 0,
      failingPairs: 0,
      results: [],
      recommendations: ['System theme follows OS preferences and inherits accessibility from light/dark themes']
    };
  }

  const variables = getThemeVariables(theme);
  const results: ThemeAuditResult['results'] = [];
  const recommendations: string[] = [];
  
  // Check each critical color pair
  for (const pairDef of CRITICAL_COLOR_PAIRS) {
    const foregroundRaw = variables[pairDef.foregroundKey];
    const backgroundRaw = variables[pairDef.backgroundKey];
    
    if (!foregroundRaw || !backgroundRaw) {
      continue; // Skip if colors aren't defined
    }
    
    // Resolve any CSS variable references
    const foreground = normalizeHslValue(resolveColorValue(foregroundRaw, variables));
    const background = normalizeHslValue(resolveColorValue(backgroundRaw, variables));
    
    const pair: ColorPair = {
      foreground,
      background,
      usage: pairDef.usage,
      required: pairDef.required
    };
    
    const contrast = analyzeContrast(foreground, background);
    const passes = contrast.wcagAA;
    
    results.push({
      pair,
      contrast,
      passes
    });
    
    // Add specific recommendations for failing required pairs
    if (!passes && pairDef.required) {
      recommendations.push(
        `Improve contrast for ${pairDef.usage.toLowerCase()} (currently ${contrast.ratio}:1, needs 4.5:1)`
      );
    }
  }
  
  const totalPairs = results.length;
  const passingPairs = results.filter(r => r.passes).length;
  const failingPairs = totalPairs - passingPairs;
  const requiredPairs = results.filter(r => r.pair.required);
  const failingRequiredPairs = requiredPairs.filter(r => !r.passes);
  
  // Calculate score based on compliance
  let score: ThemeAuditResult['score'];
  if (failingRequiredPairs.length === 0 && failingPairs === 0) {
    score = 'excellent';
  } else if (failingRequiredPairs.length === 0 && failingPairs <= 2) {
    score = 'good';
  } else if (failingRequiredPairs.length <= 1) {
    score = 'needs-improvement';
  } else {
    score = 'poor';
  }
  
  // Add general recommendations based on score
  if (score === 'poor' || score === 'needs-improvement') {
    recommendations.unshift('This theme has accessibility issues that should be addressed');
  }
  
  return {
    theme,
    score,
    totalPairs,
    passingPairs,
    failingPairs,
    results,
    recommendations
  };
}

/**
 * Audits all built-in themes for accessibility
 */
export function auditAllThemes(): AccessibilityReport {
  const themes: Theme[] = ['dark', 'light', 'startup', 'enterprise'];
  const results = themes.map(auditTheme);
  
  const compliantThemes = results.filter(r => r.score === 'excellent' || r.score === 'good').length;
  const totalIssues = results.reduce((sum, r) => sum + r.failingPairs, 0);
  
  let overallScore: AccessibilityReport['overallScore'];
  if (compliantThemes === themes.length && totalIssues === 0) {
    overallScore = 'excellent';
  } else if (compliantThemes >= themes.length * 0.75) {
    overallScore = 'good';
  } else if (compliantThemes >= themes.length * 0.5) {
    overallScore = 'needs-improvement';
  } else {
    overallScore = 'poor';
  }
  
  const recommendations: string[] = [];
  if (overallScore !== 'excellent') {
    recommendations.push('Consider improving contrast ratios in failing themes');
    recommendations.push('Test themes with users who have visual impairments');
    recommendations.push('Ensure all interactive elements meet minimum contrast requirements');
  }
  
  return {
    themes: results,
    overallScore,
    summary: {
      totalThemes: themes.length,
      compliantThemes,
      issuesFound: totalIssues
    },
    recommendations
  };
}

/**
 * Generates a human-readable accessibility report
 */
export function generateAccessibilityReport(): string {
  const report = auditAllThemes();
  const lines: string[] = [];
  
  lines.push('# Theme Accessibility Audit Report\n');
  lines.push(`**Overall Score:** ${report.overallScore.toUpperCase()}`);
  lines.push(`**Themes Audited:** ${report.summary.totalThemes}`);
  lines.push(`**Compliant Themes:** ${report.summary.compliantThemes}/${report.summary.totalThemes}`);
  lines.push(`**Issues Found:** ${report.summary.issuesFound}\n`);
  
  // Individual theme results
  lines.push('## Theme Analysis\n');
  for (const theme of report.themes) {
    lines.push(`### ${theme.theme.charAt(0).toUpperCase() + theme.theme.slice(1)} Theme`);
    lines.push(`- **Score:** ${theme.score.toUpperCase()}`);
    lines.push(`- **Compliance:** ${theme.passingPairs}/${theme.totalPairs} color pairs pass WCAG AA`);
    
    if (theme.failingPairs > 0) {
      lines.push(`- **Issues:** ${theme.failingPairs} failing combinations`);
      const failingResults = theme.results.filter(r => !r.passes);
      for (const result of failingResults) {
        lines.push(`  - ${result.pair.usage}: ${result.contrast.ratio}:1 ratio`);
      }
    }
    
    if (theme.recommendations.length > 0) {
      lines.push('- **Recommendations:**');
      for (const rec of theme.recommendations) {
        lines.push(`  - ${rec}`);
      }
    }
    lines.push('');
  }
  
  // Overall recommendations
  if (report.recommendations.length > 0) {
    lines.push('## General Recommendations\n');
    for (const rec of report.recommendations) {
      lines.push(`- ${rec}`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Gets the accessibility status for a specific theme
 */
export function getThemeAccessibilityStatus(theme: Theme): 'compliant' | 'issues' | 'unknown' {
  const result = auditTheme(theme);
  if (result.score === 'excellent' || result.score === 'good') {
    return 'compliant';
  } else if (result.score === 'needs-improvement' || result.score === 'poor') {
    return 'issues';
  }
  return 'unknown';
}