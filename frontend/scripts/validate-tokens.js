#!/usr/bin/env node

/**
 * Token Validation Script
 * Validates design system tokens for completeness and usage
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Design token definitions from our theme
const DESIGN_TOKENS = {
  colors: {
    primary: ['DEFAULT', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
    secondary: ['DEFAULT', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
    accent: ['DEFAULT', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
    success: ['DEFAULT', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
    warning: ['DEFAULT', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
    error: ['DEFAULT', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
    neutral: ['DEFAULT', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
    background: ['DEFAULT', 'secondary', 'tertiary'],
    foreground: ['DEFAULT', 'secondary', 'tertiary', 'muted'],
    border: ['DEFAULT', 'secondary', 'tertiary'],
    input: ['DEFAULT', 'secondary', 'tertiary'],
    ring: ['DEFAULT'],
    chart: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  gradients: {
    primary: ['DEFAULT', 'secondary', 'tertiary'],
    secondary: ['DEFAULT', 'secondary', 'tertiary'],
    accent: ['DEFAULT', 'secondary', 'tertiary'],
    success: ['DEFAULT', 'secondary', 'tertiary'],
    warning: ['DEFAULT', 'secondary', 'tertiary'],
    error: ['DEFAULT', 'secondary', 'tertiary']
  },
  shadows: {
    sm: ['DEFAULT'],
    md: ['DEFAULT'],
    lg: ['DEFAULT'],
    xl: ['DEFAULT'],
    '2xl': ['DEFAULT'],
    inner: ['DEFAULT'],
    none: ['DEFAULT']
  },
  animations: {
    spin: ['DEFAULT'],
    ping: ['DEFAULT'],
    pulse: ['DEFAULT'],
    bounce: ['DEFAULT'],
    fadeIn: ['DEFAULT'],
    fadeOut: ['DEFAULT'],
    slideInFromTop: ['DEFAULT'],
    slideInFromBottom: ['DEFAULT'],
    slideInFromLeft: ['DEFAULT'],
    slideInFromRight: ['DEFAULT'],
    slideOutToTop: ['DEFAULT'],
    slideOutToBottom: ['DEFAULT'],
    slideOutToLeft: ['DEFAULT'],
    slideOutToRight: ['DEFAULT'],
    zoomIn: ['DEFAULT'],
    zoomOut: ['DEFAULT'],
    scaleIn: ['DEFAULT'],
    scaleOut: ['DEFAULT'],
    rotateIn: ['DEFAULT'],
    rotateOut: ['DEFAULT']
  },
  spacing: {
    '0': ['DEFAULT'],
    '1': ['DEFAULT'],
    '2': ['DEFAULT'],
    '3': ['DEFAULT'],
    '4': ['DEFAULT'],
    '5': ['DEFAULT'],
    '6': ['DEFAULT'],
    '7': ['DEFAULT'],
    '8': ['DEFAULT'],
    '9': ['DEFAULT'],
    '10': ['DEFAULT'],
    '11': ['DEFAULT'],
    '12': ['DEFAULT'],
    '14': ['DEFAULT'],
    '16': ['DEFAULT'],
    '20': ['DEFAULT'],
    '24': ['DEFAULT'],
    '28': ['DEFAULT'],
    '32': ['DEFAULT'],
    '36': ['DEFAULT'],
    '40': ['DEFAULT'],
    '44': ['DEFAULT'],
    '48': ['DEFAULT'],
    '52': ['DEFAULT'],
    '56': ['DEFAULT'],
    '60': ['DEFAULT'],
    '64': ['DEFAULT'],
    '72': ['DEFAULT'],
    '80': ['DEFAULT'],
    '96': ['DEFAULT']
  },
  borderRadius: {
    none: ['DEFAULT'],
    sm: ['DEFAULT'],
    md: ['DEFAULT'],
    lg: ['DEFAULT'],
    xl: ['DEFAULT'],
    '2xl': ['DEFAULT'],
    '3xl': ['DEFAULT'],
    full: ['DEFAULT']
  }
};

// CSS custom properties from index.css
const CSS_CUSTOM_PROPERTIES = [
  '--background', '--foreground', '--card', '--card-foreground',
  '--popover', '--popover-foreground', '--primary', '--primary-foreground',
  '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
  '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
  '--border', '--input', '--ring', '--radius',
  '--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5',
  '--chart-6', '--chart-7', '--chart-8', '--chart-9', '--chart-10',
  '--chart-11', '--chart-12'
];

class TokenValidator {
  constructor() {
    this.usedTokens = new Set();
    this.unusedTokens = new Set();
    this.missingTokens = new Set();
    this.hardcodedValues = [];
  }

  // Scan all TypeScript/JavaScript files for token usage
  scanFiles() {
    const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', { ignore: ['node_modules/**'] });
    
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      this.scanFileForTokens(content, file);
      this.scanFileForHardcodedValues(content, file);
    });
  }

  // Scan for token usage patterns
  scanFileForTokens(content, filePath) {
    // Look for tokens.colors.* usage
    const tokenPatterns = [
      /tokens\.colors\.(\w+)\.(\w+)/g,
      /tokens\.gradients\.(\w+)\.(\w+)/g,
      /tokens\.shadows\.(\w+)\.(\w+)/g,
      /tokens\.animations\.(\w+)\.(\w+)/g,
      /tokens\.spacing\.(\w+)\.(\w+)/g,
      /tokens\.borderRadius\.(\w+)\.(\w+)/g
    ];

    tokenPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const category = match[1];
        const key = match[2];
        this.usedTokens.add(`${category}.${key}`);
      }
    });

    // Look for CSS custom property usage
    CSS_CUSTOM_PROPERTIES.forEach(prop => {
      if (content.includes(prop)) {
        this.usedTokens.add(prop);
      }
    });
  }

  // Scan for hardcoded values
  scanFileForHardcodedValues(content, filePath) {
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Check for hex colors
      const hexColors = line.match(/#[0-9a-fA-F]{3,6}/g);
      if (hexColors) {
        hexColors.forEach(color => {
          this.hardcodedValues.push({
            file: filePath,
            line: index + 1,
            value: color,
            type: 'hex-color'
          });
        });
      }

      // Check for rgb/rgba colors
      const rgbColors = line.match(/rgba?\([^)]+\)/g);
      if (rgbColors) {
        rgbColors.forEach(color => {
          this.hardcodedValues.push({
            file: filePath,
            line: index + 1,
            value: color,
            type: 'rgb-color'
          });
        });
      }

      // Check for common spacing values
      const spacingValues = line.match(/(\d+(?:\.\d+)?)(px|rem|em)/g);
      if (spacingValues) {
        spacingValues.forEach(spacing => {
          this.hardcodedValues.push({
            file: filePath,
            line: index + 1,
            value: spacing,
            type: 'spacing'
          });
        });
      }
    });
  }

  // Generate all possible token combinations
  generateAllTokens() {
    Object.entries(DESIGN_TOKENS).forEach(([category, subcategories]) => {
      Object.entries(subcategories).forEach(([subcategory, variants]) => {
        variants.forEach(variant => {
          const tokenName = `${category}.${subcategory}.${variant}`;
          this.unusedTokens.add(tokenName);
        });
      });
    });

    // Add CSS custom properties
    CSS_CUSTOM_PROPERTIES.forEach(prop => {
      this.unusedTokens.add(prop);
    });
  }

  // Calculate unused and missing tokens
  calculateTokenStats() {
    this.generateAllTokens();
    
    // Remove used tokens from unused set
    this.usedTokens.forEach(token => {
      this.unusedTokens.delete(token);
    });

    // Check for missing tokens (used but not defined)
    this.usedTokens.forEach(token => {
      if (!this.isTokenDefined(token)) {
        this.missingTokens.add(token);
      }
    });
  }

  // Check if a token is defined in our design system
  isTokenDefined(token) {
    // Check if it's a CSS custom property
    if (CSS_CUSTOM_PROPERTIES.includes(token)) {
      return true;
    }

    // Check if it's a design token
    const parts = token.split('.');
    if (parts.length === 3) {
      const [category, subcategory, variant] = parts;
      return DESIGN_TOKENS[category]?.[subcategory]?.includes(variant);
    }

    return false;
  }

  // Generate validation report
  generateReport() {
    this.calculateTokenStats();

    console.log('\n🎨 Design System Token Validation Report\n');
    console.log('=' .repeat(50));

    // Token usage statistics
    console.log('\n📊 Token Usage Statistics:');
    console.log(`✅ Used tokens: ${this.usedTokens.size}`);
    console.log(`❌ Unused tokens: ${this.unusedTokens.size}`);
    console.log(`⚠️  Missing tokens: ${this.missingTokens.size}`);
    console.log(`🚨 Hardcoded values: ${this.hardcodedValues.length}`);

    // Unused tokens
    if (this.unusedTokens.size > 0) {
      console.log('\n❌ Unused Tokens:');
      Array.from(this.unusedTokens).sort().forEach(token => {
        console.log(`   - ${token}`);
      });
    }

    // Missing tokens
    if (this.missingTokens.size > 0) {
      console.log('\n⚠️  Missing Tokens:');
      Array.from(this.missingTokens).sort().forEach(token => {
        console.log(`   - ${token}`);
      });
    }

    // Hardcoded values
    if (this.hardcodedValues.length > 0) {
      console.log('\n🚨 Hardcoded Values Found:');
      this.hardcodedValues.forEach(item => {
        console.log(`   - ${item.file}:${item.line} - ${item.value} (${item.type})`);
      });
    }

    // Recommendations
    console.log('\n💡 Recommendations:');
    if (this.unusedTokens.size > 0) {
      console.log(`   - Consider removing ${this.unusedTokens.size} unused tokens to reduce bundle size`);
    }
    if (this.missingTokens.size > 0) {
      console.log(`   - Add ${this.missingTokens.size} missing tokens to the design system`);
    }
    if (this.hardcodedValues.length > 0) {
      console.log(`   - Replace ${this.hardcodedValues.length} hardcoded values with design tokens`);
    }

    // Success/failure status
    const hasIssues = this.unusedTokens.size > 0 || this.missingTokens.size > 0 || this.hardcodedValues.length > 0;
    
    if (!hasIssues) {
      console.log('\n🎉 All tokens are properly defined and used!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Issues found. Please address the recommendations above.');
      process.exit(1);
    }
  }
}

// Run validation
const validator = new TokenValidator();
validator.scanFiles();
validator.generateReport();

export default TokenValidator;
