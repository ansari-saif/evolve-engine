import React from 'react';
import { Keyboard } from 'lucide-react';
import { cn } from '../../lib/utils';

interface KeyboardShortcut {
  key: string;
  action: string;
}

interface KeyboardShortcutsDisplayProps {
  shortcuts: KeyboardShortcut[];
  className?: string;
}

const KeyboardShortcutsDisplay: React.FC<KeyboardShortcutsDisplayProps> = ({ 
  shortcuts, 
  className 
}) => {
  if (shortcuts.length === 0) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 text-xs text-muted-foreground",
      className
    )}>
      <Keyboard className="h-3 w-3" />
      <span className="font-medium">Shortcuts:</span>
      <div className="flex items-center gap-2">
        {shortcuts.map((shortcut, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted border border-border rounded">
                {shortcut.key}
              </kbd>
              <span>{shortcut.action}</span>
            </div>
            {index < shortcuts.length - 1 && (
              <span className="text-muted-foreground/50">•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default KeyboardShortcutsDisplay;
