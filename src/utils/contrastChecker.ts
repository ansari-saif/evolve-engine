/**
 * Contrast Checker Utility
 * 
 * Provides utilities for calculating color contrast ratios and checking WCAG compliance.
 * Implements WCAG 2.1 algorithms for accessibility compliance checking.
 */

export type WCAGLevel = 'AA' | 'AAA';
export type TextSize = 'normal' | 'large';

export interface ContrastResult {
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  score: 'fail' | 'aa' | 'aaa';
}

export interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  luminance: number;
}

/**
 * Converts HSL color string to RGB values
 */
export function hslToRgb(hsl: string): { r: number; g: number; b: number } | null {
  // Handle HSL strings like "220 13% 6%" or "hsl(220, 13%, 6%)"
  const match = hsl.match(/(\d+(?:\.\d+)?)\s*,?\s*(\d+(?:\.\d+)?)%\s*,?\s*(\d+(?:\.\d+)?)%/);
  if (!match) return null;

  const h = parseFloat(match[1]) / 360;
  const s = parseFloat(match[2]) / 100;
  const l = parseFloat(match[3]) / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Converts hex color string to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Converts RGB values to hex string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Parses various color formats to RGB
 */
export function parseColor(color: string): { r: number; g: number; b: number } | null {
  // Remove CSS functions and spaces
  const cleanColor = color.replace(/var\(--[^)]+\)|\s/g, '').trim();
  
  // Try HSL format first (most common in our theme system)
  if (cleanColor.includes('%')) {
    return hslToRgb(cleanColor);
  }
  
  // Try hex format
  if (cleanColor.startsWith('#')) {
    return hexToRgb(cleanColor);
  }
  
  // Try rgb format
  const rgbMatch = cleanColor.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3])
    };
  }
  
  return null;
}

/**
 * Calculates the relative luminance of an RGB color
 * Based on WCAG 2.1 formula
 */
export function calculateLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  
  // Convert RGB to sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;
  
  // Apply gamma correction
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculates the contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function calculateContrast(color1: string, color2: string): number {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);
  
  if (!rgb1 || !rgb2) {
    return 1; // Worst case if we can't parse colors
  }
  
  const lum1 = calculateLuminance(rgb1);
  const lum2 = calculateLuminance(rgb2);
  
  // Ensure lighter color is in numerator
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if a color combination meets WCAG standards
 */
export function isAccessible(
  foreground: string, 
  background: string, 
  level: WCAGLevel = 'AA',
  textSize: TextSize = 'normal'
): boolean {
  const contrast = calculateContrast(foreground, background);
  
  if (level === 'AAA') {
    return textSize === 'large' ? contrast >= 4.5 : contrast >= 7;
  } else {
    return textSize === 'large' ? contrast >= 3 : contrast >= 4.5;
  }
}

/**
 * Gets detailed contrast analysis for a color pair
 */
export function analyzeContrast(
  foreground: string,
  background: string,
  textSize: TextSize = 'normal'
): ContrastResult {
  const ratio = calculateContrast(foreground, background);
  
  // WCAG AA requirements
  const aaThreshold = textSize === 'large' ? 3 : 4.5;
  // WCAG AAA requirements  
  const aaaThreshold = textSize === 'large' ? 4.5 : 7;
  
  const wcagAA = ratio >= aaThreshold;
  const wcagAAA = ratio >= aaaThreshold;
  
  let score: 'fail' | 'aa' | 'aaa';
  if (wcagAAA) {
    score = 'aaa';
  } else if (wcagAA) {
    score = 'aa';
  } else {
    score = 'fail';
  }
  
  return {
    ratio: Math.round(ratio * 100) / 100, // Round to 2 decimal places
    wcagAA,
    wcagAAA,
    score
  };
}

/**
 * Gets color information including luminance
 */
export function getColorInfo(color: string): ColorInfo | null {
  const rgb = parseColor(color);
  if (!rgb) return null;
  
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb,
    luminance: calculateLuminance(rgb)
  };
}

/**
 * Finds the closest accessible color by adjusting lightness
 */
export function findAccessibleColor(
  foreground: string,
  background: string,
  level: WCAGLevel = 'AA',
  textSize: TextSize = 'normal'
): string | null {
  const targetRatio = level === 'AAA' 
    ? (textSize === 'large' ? 4.5 : 7)
    : (textSize === 'large' ? 3 : 4.5);
    
  const bgRgb = parseColor(background);
  const fgRgb = parseColor(foreground);
  
  if (!bgRgb || !fgRgb) return null;
  
  const bgLuminance = calculateLuminance(bgRgb);
  
  // Calculate required luminance for foreground
  let requiredLuminance: number;
  if (bgLuminance > 0.5) {
    // Light background, need darker foreground
    requiredLuminance = (bgLuminance + 0.05) / targetRatio - 0.05;
  } else {
    // Dark background, need lighter foreground  
    requiredLuminance = targetRatio * (bgLuminance + 0.05) - 0.05;
  }
  
  // Clamp luminance to valid range
  requiredLuminance = Math.max(0, Math.min(1, requiredLuminance));
  
  // Simple approximation: adjust RGB values proportionally
  const currentLuminance = calculateLuminance(fgRgb);
  const factor = Math.sqrt(requiredLuminance / Math.max(currentLuminance, 0.001));
  
  const newR = Math.round(Math.min(255, Math.max(0, fgRgb.r * factor)));
  const newG = Math.round(Math.min(255, Math.max(0, fgRgb.g * factor)));
  const newB = Math.round(Math.min(255, Math.max(0, fgRgb.b * factor)));
  
  return rgbToHex(newR, newG, newB);
}

/**
 * Predefined WCAG compliant color pairs
 */
export const ACCESSIBLE_COLOR_PAIRS = {
  light: {
    background: '#ffffff',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#0066cc',
    success: '#008000',
    warning: '#cc6600',
    danger: '#cc0000'
  },
  dark: {
    background: '#000000', 
    text: '#ffffff',
    textSecondary: '#cccccc',
    primary: '#4d94ff',
    success: '#00cc00',
    warning: '#ffaa00',
    danger: '#ff4444'
  }
} as const;