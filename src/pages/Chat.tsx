import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useChatCompletion } from "../hooks/useChat";
import { GlassIconButton } from "../components/ui/glass-icon-button";
import { useNotification } from "@/hooks/use-notification";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  loading?: boolean;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1" aria-label="Assistant is typing" aria-live="polite">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Hi! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Initialize chat client hook (base URL is centralized in OpenAPI.BASE)
  const { ask } = useChatCompletion();
  // Native notifications
  const { notify, permission, isSupported, requestPermission } = useNotification();

  // Fallback alerts: beep and flash title
  const playBeep = useCallback(() => {
    try {
      type WindowWithWebkitAudio = Window & { webkitAudioContext?: typeof AudioContext };
      const w = window as WindowWithWebkitAudio;
      const Ctx = window.AudioContext ?? w.webkitAudioContext;
      if (!Ctx) return; // audio not supported
      const ctx = new Ctx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880; // A5
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      o.start();
      o.stop(ctx.currentTime + 0.32);
    } catch (e) {
      // ignore audio failures
    }
  }, []);

  const flashTitle = useCallback((msg: string) => {
    const original = document.title;
    let on = false;
    const id = setInterval(() => {
      document.title = on ? original : `✦ ${msg}`;
      on = !on;
    }, 600);
    const clear = () => {
      clearInterval(id);
      document.title = original;
      window.removeEventListener('focus', clear);
      document.removeEventListener('visibilitychange', clear);
    };
    window.addEventListener('focus', clear);
    document.addEventListener('visibilitychange', clear);
    // auto clear after 8s
    setTimeout(clear, 8000);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  // Try to request permission early (non-blocking)
  useEffect(() => {
    if (isSupported && permission === "default") {
      // Fire and forget; users may still deny
      void requestPermission();
    }
  }, [isSupported, permission, requestPermission]);

  const handleEnableNotifications = useCallback(async () => {
    const res = await requestPermission();
    if (res === "granted") {
      void notify("Notifications enabled", {
        body: "You will receive chat updates here.",
      });
    }
  }, [notify, requestPermission]);

  const handleTestNotification = useCallback(async () => {
    if (permission === "granted") {
      const ok = await notify("Test notification", {
        body: "If you see this, notifications work.",
        requireInteraction: true,
        tag: "chat-test",
      });
      if (!ok) {
        console.warn("notify() returned false even though permission is granted");
      }
    }
  }, [notify, permission]);

  // Backward compat: keep types, but delegate to hook
  const { mutateAsync: askApi, isPending } = useMutation<{ answer?: string }, Error, { prompt: string }>(
    {
      mutationFn: async ({ prompt }) => ask({ prompt }),
    }
  );

  const canSend = useMemo(() => input.trim().length > 0 && !isPending, [input, isPending]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    // Ensure we prompt for notification permission during a user gesture
    if (isSupported && permission === "default") {
      await requestPermission();
    }

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    const thinkingId = crypto.randomUUID();
    setMessages((m) => [
      ...m,
      { id: thinkingId, role: "assistant", content: "", loading: true },
    ]);

    try {
      const data = await askApi({ prompt: text });
      const answer = data?.answer ?? "";
      setMessages((m) =>
        m.map((msg) =>
          msg.id === thinkingId
            ? { ...msg, loading: false, content: answer || "(No answer received)" }
            : msg
        )
      );
      // Native notification on successful reply (only if allowed)
      const canNotify = permission === "granted" || Notification.permission === "granted";
      if (canNotify) {
        void notify("Reply received", {
          body: answer ? "The assistant has responded." : "No content returned.",
          icon: "/favicon.ico",
        });
        // Fallback cue in case OS delivers quietly
        playBeep();
        flashTitle("Reply received");
      } else {
        console.warn("Notification not shown: permission=", permission);
      }
    } catch (err: unknown) {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === thinkingId
            ? {
                ...msg,
                loading: false,
                content:
                  "Error: " +
                  (err instanceof Error ? err.message : String(err) || "Failed to get response"),
              }
            : msg
        )
      );
      // Native notification on error (only if allowed)
      const canNotifyErr = permission === "granted" || Notification.permission === "granted";
      if (canNotifyErr) {
        void notify("Failed to get response", {
          body:
            err instanceof Error ? err.message : String(err) || "Unknown error occurred",
          icon: "/favicon.ico",
        });
        // Fallback cue in case OS delivers quietly
        playBeep();
        flashTitle("Chat error");
      } else {
        console.warn("Notification not shown: permission=", permission);
      }
    } finally {
      // Return focus for faster typing
      inputRef.current?.focus();
    }
  }, [askApi, input, notify, permission, isSupported, requestPermission, playBeep, flashTitle]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (canSend) void sendMessage();
      }
    },
    [canSend, sendMessage]
  );

  return (
    <div className="mx-auto max-w-3xl h-[calc(100vh-6rem)] sm:h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
      <div className="pb-2">
        <h1 className="text-xl font-semibold">Chat</h1>
        <p className="text-sm text-muted-foreground">ChatGPT-like interface</p>
        {isSupported ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Permission: {permission}</span>
            {permission !== "granted" ? (
              <>
                <button
                  type="button"
                  onClick={handleEnableNotifications}
                  className="px-2 py-1 text-xs rounded-md border bg-background hover:bg-muted"
                >
                  Enable notifications
                </button>
                {permission === "denied" && (
                  <span className="text-xs text-muted-foreground">
                    Unblock in browser site settings (lock icon → Site settings → Notifications → Allow).
                  </span>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={handleTestNotification}
                className="px-2 py-1 text-xs rounded-md border bg-background hover:bg-muted"
              >
                Test notification
              </button>
            )}
          </div>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">Notifications not supported in this browser.</p>
        )}
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-auto rounded-lg border bg-background/50 p-4 space-y-4"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              "flex gap-3 items-end " + (m.role === "user" ? "justify-end" : "justify-start")
            }
          >
            {/* Assistant on the left */}
            {m.role === "assistant" && (
              <div
                className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-sm bg-primary/10 text-primary"
                aria-hidden
              >
                🤖
              </div>
            )}

            <div className="min-w-0 max-w-[80%]">
              <div
                className={
                  "rounded-lg px-3 py-2 whitespace-pre-wrap leading-relaxed " +
                  (m.role === "user"
                    ? "bg-primary text-primary-foreground text-right"
                    : "bg-muted/50 text-foreground text-left")
                }
              >
                {m.loading ? <TypingDots /> : m.content}
              </div>
            </div>

            {/* User on the right */}
            {m.role === "user" && (
              <div
                className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-sm bg-muted text-foreground"
                aria-hidden
              >
                🧑
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="mt-4">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Send a message…"
            rows={2}
            className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <GlassIconButton
            onClick={sendMessage}
            ariaLabel="Send message"
            title="Send"
            disabled={!canSend}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2 .01 7z" />
            </svg>
          </GlassIconButton>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Press Enter to send, Shift+Enter for a new line.</p>
      </div>
      {/* Add bottom padding so the fixed tab bar doesn't overlap */}
      <div className="h-16" />
    </div>
  );
}
