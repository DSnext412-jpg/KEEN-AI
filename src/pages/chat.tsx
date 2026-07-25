import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, Trash2, Send, User, Bot, Menu, X } from "lucide-react";
import { apiGet, apiPost, apiDelete } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";

interface Conversation {
  id: number;
  title: string;
  createdAt: string;
}

interface Message {
  id: number;
  conversationId: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export default function Chat() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => apiGet<Conversation[]>("/gemini/conversations"),
  });

  const { data: activeConv, refetch: refetchConv } = useQuery({
    queryKey: ["conversation", activeId],
    queryFn: () => apiGet<Conversation & { messages: Message[] }>(`/gemini/conversations/${activeId}`),
    enabled: activeId !== null,
  });

  const createConv = useMutation({
    mutationFn: () => apiPost<Conversation>("/gemini/conversations", { title: "New Conversation" }),
    onSuccess: (conv) => { queryClient.invalidateQueries({ queryKey: ["conversations"] }); setActiveId(conv.id); },
  });

  const deleteConv = useMutation({
    mutationFn: (id: number) => apiDelete(`/gemini/conversations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (activeId) queryClient.invalidateQueries({ queryKey: ["conversation", activeId] });
      setActiveId(null);
    },
  });

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeConv?.messages, streamingContent]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !activeId || isStreaming) return;
    const msgContent = input.trim();
    setInput("");
    setIsStreaming(true);
    setStreamingContent("");

    const prevData = queryClient.getQueryData<Conversation & { messages: Message[] }>(["conversation", activeId]);
    if (prevData) {
      queryClient.setQueryData(["conversation", activeId], {
        ...prevData, messages: [...prevData.messages, { id: -Date.now(), conversationId: activeId, role: "user" as const, content: msgContent, createdAt: new Date().toISOString() }],
      });
    }

    try {
      const res = await fetch(`/api/gemini/conversations/${activeId}/messages`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: msgContent }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader available");
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) { setIsStreaming(false); refetchConv(); }
              else if (data.content) setStreamingContent((prev) => prev + data.content);
              else if (data.error) { console.error(data.error); setIsStreaming(false); }
            } catch { }
          }
        }
      }
    } catch (err) { console.error(err); setIsStreaming(false); }
  }, [input, activeId, isStreaming, queryClient, refetchConv]);

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-4">
      <div className={cn(
        "w-72 shrink-0 flex flex-col border border-border/50 rounded-xl bg-card/50 backdrop-blur-sm overflow-hidden transition-all",
        sidebarOpen ? "block" : "hidden md:hidden",
      )}>
        <div className="p-3 border-b border-border/50">
          <Button onClick={() => createConv.mutate()} className="w-full" variant="glow" size="sm" loading={createConv.isPending}>
            <Plus className="h-4 w-4" /> New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations?.map((conv) => (
            <div key={conv.id} className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors group",
              activeId === conv.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent",
            )} onClick={() => setActiveId(conv.id)}>
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate flex-1">{conv.title}</span>
              <button onClick={(e) => { e.stopPropagation(); deleteConv.mutate(conv.id); }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all cursor-pointer">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden fixed bottom-4 left-4 z-10 bg-primary text-primary-foreground p-3 rounded-full shadow-lg cursor-pointer">
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className="flex-1 flex flex-col rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        {!activeId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">KEEN AI Terminal</h2>
              <p className="text-muted-foreground text-sm max-w-sm">Select a conversation or start a new one</p>
              <Button onClick={() => createConv.mutate()} variant="glow" loading={createConv.isPending}>
                <Plus className="h-4 w-4" /> Start New Conversation
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {activeConv?.messages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                    {msg.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    <div className={cn("max-w-[75%] rounded-xl px-4 py-2.5 text-sm", msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isStreaming && streamingContent && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 justify-start">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="max-w-[75%] rounded-xl px-4 py-2.5 text-sm bg-muted">
                      {streamingContent}<span className="animate-pulse">▊</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-border/50 p-4">
              <div className="flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type your message..." disabled={isStreaming} className="flex-1" />
                <Button onClick={sendMessage} disabled={!input.trim() || isStreaming} loading={isStreaming} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
