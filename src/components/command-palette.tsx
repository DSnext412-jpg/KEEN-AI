import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useTheme } from "next-themes";
import { LayoutDashboard, MessageSquare, User, Settings, Sun, Moon, LogOut } from "lucide-react";
import { useAuth } from "../hooks/use-auth";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape" && open) { setOpen(false); }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  useEffect(() => {
    if (open) { setQuery(""); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const run = (action: () => void) => { setOpen(false); action(); };

  const items = [
    { group: "Navigation", items: [
      { label: "Dashboard", icon: LayoutDashboard, action: () => navigate("/dashboard") },
      { label: "New Chat", icon: MessageSquare, action: () => navigate("/chat") },
      { label: "Profile", icon: User, action: () => navigate("/profile") },
      { label: "Settings", icon: Settings, action: () => navigate("/settings") },
    ]},
    { group: "Actions", items: [
      { label: theme === "dark" ? "Light Mode" : "Dark Mode", icon: theme === "dark" ? Sun : Moon, action: () => setTheme(theme === "dark" ? "light" : "dark") },
      { label: "Sign Out", icon: LogOut, action: () => signOut() },
    ]},
  ];

  if (!open) return null;

  const filtered = items.map((g) => ({
    ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase())),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setOpen(false)} />
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50">
        <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="w-full border-b border-border bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <div className="max-h-64 overflow-y-auto p-2">
            {filtered.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">No results found.</div>
            )}
            {filtered.map((group) => (
              <div key={group.group}>
                <div className="text-xs text-muted-foreground px-2 py-1.5">{group.group}</div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} onClick={() => run(item.action)}
                      className="flex items-center rounded-lg px-2 py-2 text-sm cursor-pointer hover:bg-accent transition-colors">
                      <Icon className="mr-2 h-4 w-4" /> {item.label}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
