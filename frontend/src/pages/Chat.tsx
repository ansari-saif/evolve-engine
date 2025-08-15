import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { performanceMetrics } from "../utils/performance";
import { useUserPrompts } from "../hooks/useChat";
import { GlassIconButton } from "../components/ui/glass-icon-button";
import { useNotification } from "@/hooks/use-notification";
import { useUserId } from "../hooks/redux/useAppConfig";
import { webSocketService } from "@/services/websocketService";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  loading?: boolean;
}

// Fallback UUID generation for browsers that don't support crypto.randomUUID()
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
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
  const startTime = performance.now();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateUUID(),
      role: "assistant",
      content: "Hi! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const userId = useUserId();
  const queryClient = useQueryClient();
  const awaitingResponseIdRef = useRef<string | null>(null);
  
  // Fetch previous user prompts
  const { data: userPrompts, isLoading: isLoadingPrompts } = useUserPrompts(userId);
  
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

  // Performance tracking
  useEffect(() => {
    performanceMetrics.componentRender('Chat', startTime);
  }, [startTime]);

  // Try to request permission early (non-blocking)
  useEffect(() => {
    if (isSupported && permission === "default") {
      // Fire and forget; users may still deny
      void requestPermission();
    }
  }, [isSupported, permission, requestPermission]);

  // Load previous messages when userPrompts data is available
  useEffect(() => {
    if (userPrompts && userPrompts.length > 0) {
      const previousMessages: Message[] = [];
      
      // Convert prompts to messages (reverse order to show oldest first)
      userPrompts.reverse().forEach((prompt) => {
        // Add user message
        previousMessages.push({
          id: `user-${prompt.prompt_id}`,
          role: "user" as const,
          content: prompt.prompt_text,
        });
        
        // Add assistant response if available
        if (prompt.response_text) {
          previousMessages.push({
            id: `assistant-${prompt.prompt_id}`,
            role: "assistant" as const,
            content: prompt.response_text,
          });
        }
      });
      
      // Replace the welcome message with previous messages if we have any
      if (previousMessages.length > 0) {
        setMessages(previousMessages);
      }
    }
  }, [userPrompts]);

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

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  // Attach a WebSocket message listener without re-subscribing/connecting
  useEffect(() => {
    const handleWsMessage = (wsMsg: { message: string; type?: string; data?: unknown }) => {
      const answer = wsMsg?.message ?? "";
      const pendingId = awaitingResponseIdRef.current;
      if (pendingId) {
        setMessages((m) =>
          m.map((msg) => (msg.id === pendingId ? { ...msg, loading: false, content: answer || "(No answer received)" } : msg))
        );
        awaitingResponseIdRef.current = null;
      } else {
        setMessages((m) => [
          ...m,
          { id: generateUUID(), role: "assistant" as const, content: answer || "(No answer received)" },
        ]);
      }

      // Invalidate and refetch user prompts to include the new message (if backend persists it)
      queryClient.invalidateQueries({ queryKey: ['userPrompts', userId] });

      // Native notification on successful reply (only if allowed)
      const canNotify = permission === "granted" || Notification.permission === "granted";
      if (canNotify) {
        void notify("Reply received", {
          body: answer ? "The assistant has responded." : "No content returned.",
          icon: "/favicon.svg",
        });
        // Fallback cue in case OS delivers quietly
        playBeep();
        flashTitle("Reply received");
      } else {
        console.warn("Notification not shown: permission=", permission);
      }
    };

    // Register listener
    webSocketService.addEventListener(handleWsMessage);
    return () => {
      webSocketService.removeEventListener(handleWsMessage);
    };
  }, [flashTitle, notify, permission, playBeep, queryClient, userId]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    // Ensure we prompt for notification permission during a user gesture
    if (isSupported && permission === "default") {
      await requestPermission();
    }

    const userMsg: Message = { id: generateUUID(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    const thinkingId = generateUUID();
    setMessages((m) => [
      ...m,
      { id: thinkingId, role: "assistant", content: "", loading: true },
    ]);

    try {
      // Mark this message as awaiting a response to update the loading bubble on next WS event
      awaitingResponseIdRef.current = thinkingId;
      const ok = webSocketService.send({ message: text });
      if (!ok) {
        // If send failed immediately, surface an error in the thinking bubble
        setMessages((m) =>
          m.map((msg) =>
            msg.id === thinkingId
              ? { ...msg, loading: false, content: "Error: WebSocket not connected" }
              : msg
          )
        );
        awaitingResponseIdRef.current = null;
      }
    } catch (err: unknown) {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === thinkingId
            ? {
                ...msg,
                loading: false,
                content: "Error: " + (err instanceof Error ? err.message : String(err) || "Failed to send message"),
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
  }, [input, notify, permission, isSupported, requestPermission, playBeep, flashTitle]);

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
    <div className="mx-auto max-w-3xl h-[calc(100vh-6rem)] sm:h-[calc(100vh-7rem)] flex flex-col px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6" role="main" aria-label="AI Chat Interface">
      {/* Header */}
      <div className="pb-2 sm:pb-3">
        <h1 className="text-lg sm:text-xl font-semibold">Chat</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">You personal Ai companion</p>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-auto rounded-lg border bg-background/50 p-2 sm:p-4 space-y-3 sm:space-y-4"
      >
        {isLoadingPrompts ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-primary"></div>
              <span className="text-xs sm:text-sm">Loading previous messages...</span>
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={
                "flex gap-2 sm:gap-3 items-end " + (m.role === "user" ? "justify-end" : "justify-start")
              }
            >
              {/* Assistant on the left */}
              {m.role === "assistant" && (
                <div
                  className="h-6 w-6 sm:h-8 sm:w-8 shrink-0 rounded-full flex items-center justify-center text-xs sm:text-sm bg-primary/10 text-primary"
                  aria-hidden
                >
                  🤖
                </div>
              )}

              <div className="min-w-0 max-w-[85%] sm:max-w-[80%]">
                <div
                  className={
                    "rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 whitespace-pre-wrap leading-relaxed text-xs sm:text-sm " +
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
                  className="h-6 w-6 sm:h-8 sm:w-8 shrink-0 rounded-full flex items-center justify-center text-xs sm:text-sm bg-muted text-foreground"
                  aria-hidden
                >
                  🧑
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Composer */}
      <div className="mt-3 sm:mt-4">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Send a message…"
            rows={2}
            className="flex-1 resize-none rounded-md border bg-background px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <GlassIconButton
            onClick={sendMessage}
            ariaLabel="Send message"
            title="Send"
            disabled={!canSend}
            className="min-h-[36px] sm:min-h-[40px] min-w-[36px] sm:min-w-[40px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 sm:h-5 sm:w-5"
              aria-hidden
            >
              <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2 .01 7z" />
            </svg>
          </GlassIconButton>
        </div>
        <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">Press Enter to send, Shift+Enter for a new line.</p>
      </div>
      {/* Add bottom padding so the fixed tab bar doesn't overlap */}
      <div className="h-16" />
    </div>
  );
}
