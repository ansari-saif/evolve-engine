/**
 * Token Usage Example Component
 * 
 * Demonstrates the proper usage of typed design tokens vs hardcoded values.
 * This component shows both approaches for comparison and serves as documentation.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { tokens } from '../../theme';

const TokenUsageExample: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Design Token Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Example 1: Color Tokens */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Color Tokens</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Using Tailwind classes (existing approach) */}
              <div className="p-4 rounded-lg bg-primary text-primary-foreground">
                <p className="text-sm font-medium">Primary (Tailwind)</p>
                <p className="text-xs opacity-80">bg-primary</p>
              </div>
              
              {/* Using typed tokens (new approach) */}
              <div 
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: tokens.colors.primary.DEFAULT,
                  color: tokens.colors.primary.foreground
                }}
              >
                <p className="text-sm font-medium">Primary (Tokens)</p>
                <p className="text-xs opacity-80">tokens.colors.primary</p>
              </div>
              
              <div className="p-4 rounded-lg bg-secondary text-secondary-foreground">
                <p className="text-sm font-medium">Secondary</p>
                <p className="text-xs opacity-80">bg-secondary</p>
              </div>
              
              <div className="p-4 rounded-lg bg-success text-success-foreground">
                <p className="text-sm font-medium">Success</p>
                <p className="text-xs opacity-80">bg-success</p>
              </div>
            </div>
          </div>

          {/* Example 2: Gradient Tokens */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Gradient Tokens</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className="p-6 rounded-lg text-white"
                style={{ background: tokens.gradients.primary }}
              >
                <p className="font-medium">Primary Gradient</p>
                <p className="text-sm opacity-80">tokens.gradients.primary</p>
              </div>
              
              <div 
                className="p-6 rounded-lg text-white"
                style={{ background: tokens.gradients.motivation }}
              >
                <p className="font-medium">Motivation Gradient</p>
                <p className="text-sm opacity-80">tokens.gradients.motivation</p>
              </div>
              
              <div 
                className="p-6 rounded-lg text-white"
                style={{ background: tokens.gradients.success }}
              >
                <p className="font-medium">Success Gradient</p>
                <p className="text-sm opacity-80">tokens.gradients.success</p>
              </div>
            </div>
          </div>

          {/* Example 3: Shadow Tokens */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Shadow Tokens</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className="p-6 rounded-lg bg-card"
                style={{ boxShadow: tokens.shadows.elegant }}
              >
                <p className="font-medium">Elegant Shadow</p>
                <p className="text-sm text-muted-foreground">tokens.shadows.elegant</p>
              </div>
              
              <div 
                className="p-6 rounded-lg bg-card"
                style={{ boxShadow: tokens.shadows.glow }}
              >
                <p className="font-medium">Glow Shadow</p>
                <p className="text-sm text-muted-foreground">tokens.shadows.glow</p>
              </div>
              
              <div 
                className="p-6 rounded-lg bg-card"
                style={{ boxShadow: tokens.shadows.card }}
              >
                <p className="font-medium">Card Shadow</p>
                <p className="text-sm text-muted-foreground">tokens.shadows.card</p>
              </div>
            </div>
          </div>

          {/* Example 4: Animation Tokens */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Animation Tokens</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="w-full"
                style={{ transition: tokens.animations.smooth }}
              >
                Smooth Animation
              </Button>
              
              <Button 
                className="w-full"
                style={{ transition: tokens.animations.spring }}
              >
                Spring Animation
              </Button>
            </div>
          </div>

          {/* Example 5: Token Access Utilities */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Token Access Utilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: tokens.colors.primary.DEFAULT,
                  color: tokens.colors.primary.foreground
                }}
              >
                <p className="font-medium">Using Direct Access</p>
                <p className="text-sm opacity-80">tokens.colors.primary.DEFAULT</p>
              </div>
              
              <div 
                className="p-4 rounded-lg"
                style={{ background: tokens.gradients.primary }}
              >
                <p className="font-medium text-white">Using Direct Access</p>
                <p className="text-sm opacity-80">tokens.gradients.primary</p>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default TokenUsageExample;
