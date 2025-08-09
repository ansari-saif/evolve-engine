import { useCallback, useMemo, useState } from 'react';

export type NotifyOptions = NotificationOptions;

/**
 * useNotification
 * - Thin wrapper around the Web Notifications API.
 * - Handles permission flow and exposes a simple notify() helper.
 * Note: Requires secure context (HTTPS) or localhost.
 */
export function useNotification() {
  const isSupported = useMemo(
    () => typeof window !== 'undefined' && 'Notification' in window,
    []
  );

  const [permission, setPermission] = useState<NotificationPermission>(
    isSupported ? Notification.permission : 'denied'
  );

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) return 'denied';
    if (Notification.permission === 'granted') {
      setPermission('granted');
      return 'granted';
    }
    if (Notification.permission === 'denied') {
      setPermission('denied');
      return 'denied';
    }
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      return res;
    } catch {
      setPermission('denied');
      return 'denied';
    }
  }, [isSupported]);

  const notify = useCallback(
    async (title: string, options?: NotifyOptions): Promise<boolean> => {
      if (!isSupported) return false;

      const perm = Notification.permission;
      if (perm !== 'granted') {
        // Do not auto-request here; this should be behind a user gesture usually
        // Caller can explicitly requestPermission first.
        return false;
      }

      const icon = options?.icon ?? '/favicon.ico';
      try {
        const n = new Notification(title, { icon, ...options });
        n.onclick = () => {
          try { window.focus(); } catch (e) { void e; }
          n.close();
        };
        n.onshow = () => console.info('[notify] shown:', title);
        n.onerror = (e) => console.error('[notify] error:', e);
        n.onclose = () => console.info('[notify] closed:', title);
        return true;
      } catch (e) {
        console.error('[notify] exception creating Notification:', e);
        return false;
      }
    },
    [isSupported]
  );

  return {
    isSupported,
    permission,
    requestPermission,
    notify,
  } as const;
}
