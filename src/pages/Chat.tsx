import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useChatCompletion } from "../hooks/useChat";

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

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

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
    } finally {
      // Return focus for faster typing
      inputRef.current?.focus();
    }
  }, [askApi, input]);

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
          <button
            onClick={sendMessage}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90 disabled:opacity-50"
            disabled={!canSend}
          >
            <span>Send</span>
            <span aria-hidden>↩︎</span>
          </button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Press Enter to send, Shift+Enter for a new line.</p>
      </div>
      {/* Add bottom padding so the fixed tab bar doesn't overlap */}
      <div className="h-16" />
    </div>
  );
}
