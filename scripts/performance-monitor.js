#!/usr/bin/env node

/**
 * Performance Monitoring Script
 * Monitors design system performance impact
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      bundleSize: 0,
      cssVariables: 0,
      tokenUsage: 0,
      themeSwitches: 0,
      renderTime: 0
    };
    this.recommendations = [];
  }

  // Analyze bundle size impact
  analyzeBundleSize() {
    const distPath = path.join(process.cwd(), 'dist');
    
    if (!fs.existsSync(distPath)) {
      console.log('⚠️  No dist folder found. Run "yarn build" first.');
      return;
    }

    const files = glob.sync('dist/**/*.{js,css}', { absolute: true });
    let totalSize = 0;

    files.forEach(file => {
      const stats = fs.statSync(file);
      totalSize += stats.size;
    });

    this.metrics.bundleSize = totalSize;
    
    // Check if bundle size is reasonable (under 2MB for a typical React app)
    if (totalSize > 2 * 1024 * 1024) {
      this.recommendations.push('Bundle size is large. Consider tree-shaking unused tokens.');
    }
  }

  // Count CSS custom properties
  countCSSVariables() {
    const cssFiles = glob.sync('src/**/*.css', { absolute: true });
    let variableCount = 0;

    cssFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.match(/--[a-zA-Z0-9-]+/g);
      if (matches) {
        variableCount += matches.length;
      }
    });

    this.metrics.cssVariables = variableCount;
    
    if (variableCount > 100) {
      this.recommendations.push('Many CSS variables detected. Consider grouping related variables.');
    }
  }

  // Count token usage
  countTokenUsage() {
    const tsFiles = glob.sync('src/**/*.{ts,tsx}', { absolute: true });
    let tokenCount = 0;

    tsFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.match(/tokens\.[a-zA-Z0-9.]+/g);
      if (matches) {
        tokenCount += matches.length;
      }
    });

    this.metrics.tokenUsage = tokenCount;
    
    if (tokenCount === 0) {
      this.recommendations.push('No token usage detected. Consider migrating to design tokens.');
    }
  }

  // Check for performance anti-patterns
  checkPerformancePatterns() {
    const files = glob.sync('src/**/*.{ts,tsx}', { absolute: true });
    
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for inline styles with calculations
      const inlineStylePatterns = [
        /style=\{\{[^}]*\+\s*[^}]*\}/g,
        /style=\{\{[^}]*\*\s*[^}]*\}/g,
        /style=\{\{[^}]*\/\s*[^}]*\}/g
      ];

      inlineStylePatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          this.recommendations.push(`Avoid calculations in inline styles: ${file}`);
        }
      });

      // Check for expensive CSS operations
      const expensivePatterns = [
        /filter:\s*blur/g,
        /backdrop-filter/g,
        /transform:\s*translate3d/g
      ];

      expensivePatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          this.recommendations.push(`Consider optimizing expensive CSS operations: ${file}`);
        }
      });
    });
  }

  // Generate performance report
  generateReport() {
    console.log('\n🚀 Design System Performance Report\n');
    console.log('=' .repeat(50));

    // Metrics
    console.log('\n📊 Performance Metrics:');
    console.log(`📦 Bundle Size: ${(this.metrics.bundleSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🎨 CSS Variables: ${this.metrics.cssVariables}`);
    console.log(`🏷️  Token Usage: ${this.metrics.tokenUsage}`);
    console.log(`⚡ Theme Switches: ${this.metrics.themeSwitches}`);

    // Performance score
    const score = this.calculatePerformanceScore();
    console.log(`📈 Performance Score: ${score}/100`);

    // Recommendations
    if (this.recommendations.length > 0) {
      console.log('\n💡 Performance Recommendations:');
      this.recommendations.forEach(rec => {
        console.log(`   - ${rec}`);
      });
    } else {
      console.log('\n✅ No performance issues detected!');
    }

    // Best practices
    console.log('\n🔧 Performance Best Practices:');
    console.log('   - Use CSS custom properties for runtime updates');
    console.log('   - Avoid calculations in inline styles');
    console.log('   - Implement proper tree-shaking for unused tokens');
    console.log('   - Use CSS containment for isolated components');
    console.log('   - Optimize critical rendering path');

    // Success/failure status
    if (score >= 80) {
      console.log('\n🎉 Excellent performance! Your design system is optimized.');
      process.exit(0);
    } else if (score >= 60) {
      console.log('\n⚠️  Good performance with room for improvement.');
      process.exit(0);
    } else {
      console.log('\n🚨 Performance issues detected. Please address recommendations.');
      process.exit(1);
    }
  }

  // Calculate performance score
  calculatePerformanceScore() {
    let score = 100;

    // Bundle size penalty
    if (this.metrics.bundleSize > 2 * 1024 * 1024) {
      score -= 20;
    } else if (this.metrics.bundleSize > 1 * 1024 * 1024) {
      score -= 10;
    }

    // CSS variables penalty
    if (this.metrics.cssVariables > 100) {
      score -= 15;
    } else if (this.metrics.cssVariables > 50) {
      score -= 5;
    }

    // Token usage bonus
    if (this.metrics.tokenUsage > 50) {
      score += 10;
    } else if (this.metrics.tokenUsage === 0) {
      score -= 20;
    }

    // Recommendations penalty
    score -= this.recommendations.length * 5;

    return Math.max(0, Math.min(100, score));
  }

  // Run all analysis
  run() {
    this.analyzeBundleSize();
    this.countCSSVariables();
    this.countTokenUsage();
    this.checkPerformancePatterns();
    this.generateReport();
  }
}

// Run performance monitoring
const monitor = new PerformanceMonitor();
monitor.run();

export default PerformanceMonitor;
