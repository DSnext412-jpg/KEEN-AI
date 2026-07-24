import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { 
  useListGeminiConversations, 
  useCreateGeminiConversation, 
  useGetGeminiConversation,
  useDeleteGeminiConversation,
  getGetGeminiConversationQueryKey,
  getListGeminiConversationsQueryKey,
  getListGeminiMessagesQueryKey
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MessageSquare, Trash2, Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: conversations, isLoading: isConversationsLoading } = useListGeminiConversations({
    query: { queryKey: getListGeminiConversationsQueryKey() }
  });

  const createConv = useCreateGeminiConversation();
  const deleteConv = useDeleteGeminiConversation();

  const { data: activeConv, isLoading: isConvLoading } = useGetGeminiConversation(
    activeId!, 
    { query: { enabled: !!activeId, queryKey: getGetGeminiConversationQueryKey(activeId!) } }
  );

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages, streamingContent]);

  const handleNewChat = () => {
    createConv.mutate({ data: { title: "New Conversation" } }, {
      onSuccess: (conv) => {
        queryClient.invalidateQueries({ queryKey: getListGeminiConversationsQueryKey() });
        setActiveId(conv.id);
      }
    });
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConv.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListGeminiConversationsQueryKey() });
        if (activeId === id) setActiveId(null);
        toast({ title: "Conversation deleted" });
      }
    });
  };

  const handleSend = async () => {
    if (!input.trim() || !activeId) return;

    const messageContent = input.trim();
    setInput("");
    
    // Optimistic UI update
    queryClient.setQueryData(getGetGeminiConversationQueryKey(activeId), (old: any) => {
      if (!old) return old;
      return {
        ...old,
        messages: [...old.messages, { id: Date.now(), conversationId: activeId, role: "user", content: messageContent, createdAt: new Date().toISOString() }]
      };
    });

    setIsStreaming(true);
    setStreamingContent("");

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/gemini/conversations/${activeId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageContent }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                accumulatedContent += data.text;
                setStreamingContent(accumulatedContent);
              }
            } catch (e) {
              // ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch (error) {
      toast({ title: "Error sending message", variant: "destructive" });
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
      queryClient.invalidateQueries({ queryKey: getGetGeminiConversationQueryKey(activeId) });
      queryClient.invalidateQueries({ queryKey: getListGeminiMessagesQueryKey(activeId) });
    }
  };

  return (
    <div className="flex h-full border border-border/50 m-4 rounded-xl overflow-hidden bg-card/30 backdrop-blur-xl shadow-2xl">
      {/* Sidebar */}
      <div className="w-64 border-r border-border/50 bg-background/50 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-border/50">
          <Button onClick={handleNewChat} className="w-full justify-start" variant="secondary">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {isConversationsLoading ? (
              <div className="p-4 flex justify-center"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
            ) : conversations?.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No conversations yet</div>
            ) : (
              conversations?.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm transition-colors group",
                    activeId === conv.id ? "bg-primary/20 text-primary" : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  <div className="flex items-center truncate">
                    <MessageSquare className="h-4 w-4 mr-2 shrink-0 opacity-70" />
                    <span className="truncate">{conv.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={(e) => handleDelete(conv.id, e)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-card/20">
        {!activeId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 ring-1 ring-primary/20">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">KEEN AI Terminal</h3>
            <p className="text-sm max-w-sm text-center mb-6">Select a conversation or start a new one to begin interaction.</p>
            <Button onClick={handleNewChat} variant="glow">Start New Conversation</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4 md:p-6">
              <div className="space-y-6 max-w-3xl mx-auto pb-4">
                {isConvLoading ? (
                  <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : (
                  <>
                    <AnimatePresence initial={false}>
                      {activeConv?.messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "flex gap-4",
                            msg.role === "user" ? "flex-row-reverse" : "flex-row"
                          )}
                        >
                          <div className={cn(
                            "h-8 w-8 rounded-md flex items-center justify-center shrink-0",
                            msg.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-primary/20 text-primary ring-1 ring-primary/30"
                          )}>
                            {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                          </div>
                          <div className={cn(
                            "px-4 py-3 rounded-2xl max-w-[80%] text-sm",
                            msg.role === "user" 
                              ? "bg-secondary text-secondary-foreground rounded-tr-sm" 
                              : "bg-background border border-border/50 rounded-tl-sm text-foreground prose dark:prose-invert prose-sm"
                          )}>
                            {msg.content}
                          </div>
                        </motion.div>
                      ))}
                      
                      {isStreaming && streamingContent && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-4 flex-row"
                        >
                          <div className="h-8 w-8 rounded-md bg-primary/20 text-primary ring-1 ring-primary/30 flex items-center justify-center shrink-0">
                            <Bot className="h-5 w-5" />
                          </div>
                          <div className="px-4 py-3 rounded-2xl max-w-[80%] text-sm bg-background border border-border/50 rounded-tl-sm text-foreground flex items-center">
                            {streamingContent}
                            <span className="w-1.5 h-4 bg-primary ml-1 animate-pulse" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 bg-background/80 backdrop-blur-sm border-t border-border/50">
              <div className="max-w-3xl mx-auto relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message..."
                  className="pr-12 py-6 bg-card border-border/50 focus-visible:ring-primary/50 text-base shadow-sm rounded-xl"
                  disabled={isStreaming}
                />
                <Button
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={handleSend}
                  disabled={!input.trim() || isStreaming}
                >
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
