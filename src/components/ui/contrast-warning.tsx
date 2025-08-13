/**
 * Contrast Warning Component
 * 
 * Displays accessibility warnings for color combinations that don't meet WCAG standards.
 * Integrates with the contrast checker utility to provide real-time feedback.
 */

import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from './alert';
import { Badge } from './badge';
import { analyzeContrast, ContrastResult, TextSize, WCAGLevel, parseColor } from '../../utils/contrastChecker';

interface ContrastWarningProps {
  foreground: string;
  background: string;
  textSize?: TextSize;
  className?: string;
  showDetails?: boolean;
}

const ScoreBadge: React.FC<{ score: ContrastResult['score']; ratio: number }> = ({ score, ratio }) => {
  const configs = {
    fail: {
      variant: 'destructive' as const,
      icon: <AlertTriangle className="w-3 h-3" />,
      label: 'Fail',
      color: 'text-red-500'
    },
    aa: {
      variant: 'secondary' as const,
      icon: <Info className="w-3 h-3" />,
      label: 'AA',
      color: 'text-yellow-600'
    },
    aaa: {
      variant: 'default' as const,
      icon: <CheckCircle className="w-3 h-3" />,
      label: 'AAA',
      color: 'text-green-500'
    }
  };

  const config = configs[score];
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      {config.icon}
      {config.label} ({ratio})
    </Badge>
  );
};

export const ContrastWarning: React.FC<ContrastWarningProps> = ({
  foreground,
  background,
  textSize = 'normal',
  className,
  showDetails = true
}) => {
  const result = analyzeContrast(foreground, background, textSize);
  
  // Debug logging for development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Contrast Analysis:', {
        foreground,
        background,
        result,
        foregroundRgb: parseColor(foreground),
        backgroundRgb: parseColor(background)
      });
    }
  }, [foreground, background, result]);
  
  // Don't show anything if contrast is perfect
  if (result.score === 'aaa') {
    return showDetails ? (
      <div className={`flex items-center gap-2 text-sm text-green-600 ${className}`}>
        <CheckCircle className="w-4 h-4" />
        <span>Excellent contrast</span>
        <ScoreBadge score={result.score} ratio={result.ratio} />
      </div>
    ) : null;
  }
  
  // Show warning for AA or fail
  const isWarning = result.score === 'fail';
  const title = isWarning ? 'Accessibility Issue' : 'Good Contrast';
  
  let description: string;
  if (result.score === 'fail') {
    description = `This color combination has a contrast ratio of ${result.ratio}:1, which fails WCAG AA standards. Consider using colors with higher contrast for better accessibility.`;
  } else {
    description = `This color combination meets WCAG AA standards with a ratio of ${result.ratio}:1, but consider higher contrast for AAA compliance.`;
  }
  
  const recommendations: string[] = [];
  if (result.score === 'fail') {
    recommendations.push('Use darker text on light backgrounds or lighter text on dark backgrounds');
    recommendations.push('Ensure a minimum 4.5:1 ratio for normal text (3:1 for large text)');
  } else if (result.score === 'aa') {
    recommendations.push('Consider increasing contrast for AAA compliance (7:1 for normal text, 4.5:1 for large text)');
  }

  return (
    <Alert className={className} variant={isWarning ? 'destructive' : 'default'}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {isWarning ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <Info className="w-4 h-4" />
          )}
          <div>
            <h4 className="font-medium text-sm">{title}</h4>
            {showDetails && (
              <AlertDescription className="mt-1">
                {description}
                {recommendations.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-xs space-y-1">
                    {recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                )}
              </AlertDescription>
            )}
          </div>
        </div>
        <ScoreBadge score={result.score} ratio={result.ratio} />
      </div>
      
      {showDetails && (
        <div className="mt-3 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: foreground }}
              title="Foreground color"
            />
            <span className="font-mono">{foreground}</span>
          </div>
          <span className="text-muted-foreground">on</span>
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: background }}
              title="Background color"
            />
            <span className="font-mono">{background}</span>
          </div>
        </div>
      )}
    </Alert>
  );
};

/**
 * Compact contrast indicator for inline use
 */
export const ContrastIndicator: React.FC<{
  foreground: string;
  background: string;
  textSize?: TextSize;
  className?: string;
}> = ({ foreground, background, textSize = 'normal', className }) => {
  const result = analyzeContrast(foreground, background, textSize);
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <ScoreBadge score={result.score} ratio={result.ratio} />
    </div>
  );
};

/**
 * Hook for getting contrast analysis
 */
export const useContrastAnalysis = (
  foreground: string,
  background: string,
  textSize: TextSize = 'normal'
) => {
  return React.useMemo(() => 
    analyzeContrast(foreground, background, textSize), 
    [foreground, background, textSize]
  );
};

export default ContrastWarning;