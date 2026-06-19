import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Loader2 } from "lucide-react";
import { API } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ConciergeWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);     // {role, content}
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  if (!user) return null;

  const send = async () => {
    if (!input.trim() || streaming) return;
    const msg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }, { role: "assistant", content: "" }]);
    setStreaming(true);
    try {
      const resp = await fetch(`${API}/concierge/ask`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const evt = JSON.parse(line.slice(6));
            if (evt.type === "delta") {
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + evt.content };
                return copy;
              });
            }
          } catch {}
        }
      }
    } catch (e) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "Sorry, I'm offline right now. Try again in a moment." };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} data-testid="concierge-fab"
        className="fixed bottom-6 right-44 z-40 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:scale-105 transition flex items-center justify-center">
        <Sparkles className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed bottom-6 right-44 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[80vh] bg-card border border-border rounded-lg shadow-2xl flex flex-col" data-testid="concierge-panel">
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <div>
                <div className="text-sm font-medium">FulxerPro Concierge</div>
                <div className="text-[10px] opacity-70 uppercase tracking-[0.2em]">Claude Sonnet 4.5</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} data-testid="concierge-close"><X className="w-4 h-4" /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" data-testid="concierge-messages">
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-10">
                <Sparkles className="w-8 h-8 mx-auto mb-3 text-accent" />
                <p>I'm your private investment advisor. Ask me anything about plans, ROI, or your portfolio.</p>
                <div className="mt-4 space-y-2 text-xs text-left">
                  {["Which plan suits a $5k investment for 60 days?", "What's my current portfolio status?", "How does KYC verification work?"].map((q) => (
                    <button key={q} onClick={() => setInput(q)} className="block w-full text-left px-3 py-2 border border-border rounded hover:bg-secondary transition">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                  {m.content || (streaming && i === messages.length - 1 ? <Loader2 className="w-3 h-3 animate-spin" /> : "")}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-3 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about plans, KYC, returns…" disabled={streaming} data-testid="concierge-input"
              className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            <button onClick={send} disabled={streaming || !input.trim()} data-testid="concierge-send"
              className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50">
              {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
