import { useState } from 'react';

export type ControlCenterTab = 'overview' | 'tokens' | 'themes' | 'components' | 'settings';

export const useControlCenterState = () => {
  const [activeTab, setActiveTab] = useState<ControlCenterTab>('overview');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = async (text: string, tokenName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToken(tokenName);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: 'BarChart3' },
    { id: 'tokens' as const, label: 'Design Tokens', icon: 'Code' },
    { id: 'themes' as const, label: 'Theme Management', icon: 'Palette' },
    { id: 'components' as const, label: 'Components', icon: 'Layers' },
    { id: 'settings' as const, label: 'App Settings', icon: 'Settings' },
  ];

  return {
    activeTab,
    setActiveTab,
    copiedToken,
    copyToClipboard,
    tabs,
  };
};
