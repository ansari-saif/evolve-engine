import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Sparkles } from 'lucide-react';
import type { PhaseEnum } from '../../client/models';

interface GenerateDailyTasksDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (params: { energyLevel: number; currentPhase: PhaseEnum | null }) => void;
  isLoading?: boolean;
}

const GenerateDailyTasksDialog: React.FC<GenerateDailyTasksDialogProps> = ({
  open,
  onClose,
  onGenerate,
  isLoading = false
}) => {
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [currentPhase, setCurrentPhase] = useState<PhaseEnum | null>(null);

  const handleGenerate = () => {
    onGenerate({ energyLevel, currentPhase });
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const phases: { value: PhaseEnum; label: string }[] = [
    { value: 'Research', label: 'Research' },
    { value: 'MVP', label: 'MVP' },
    { value: 'Growth', label: 'Growth' },
    { value: 'Scale', label: 'Scale' },
    { value: 'Transition', label: 'Transition' }
  ];

  const getEnergyLabel = (level: number) => {
    if (level <= 2) return 'Very Low';
    if (level <= 4) return 'Low';
    if (level <= 6) return 'Medium';
    if (level <= 8) return 'High';
    return 'Very High';
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Daily Tasks
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Energy Level Slider */}
          <div className="space-y-3">
            <Label htmlFor="energy-level">
              Energy Level: {energyLevel}/10 ({getEnergyLabel(energyLevel)})
            </Label>
            <Slider
              id="energy-level"
              value={[energyLevel]}
              onValueChange={(value) => setEnergyLevel(value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very Low</span>
              <span>Very High</span>
            </div>
          </div>

          {/* Phase Selection */}
          <div className="space-y-3">
            <Label htmlFor="current-phase">Current Phase (Optional)</Label>
            <Select
              value={currentPhase || 'none'}
              onValueChange={(value) => setCurrentPhase(value === 'none' ? null : (value as PhaseEnum))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your current phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {phases.map((phase) => (
                  <SelectItem key={phase.value} value={phase.value}>
                    {phase.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Tasks
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateDailyTasksDialog;


