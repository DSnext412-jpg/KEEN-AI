import { useLocation, Link } from "wouter";
import { LayoutDashboard, MessageSquare, User, Settings, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { Avatar } from "./ui/avatar";
import { cn } from "../lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-purple-950/10">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] pointer-events-none" />

      <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-2 border-b border-border/50 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">K</div>
          <span className="font-semibold tracking-tight">KEEN AI</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )} onClick={() => setMobileOpen(false)}>
                  <Icon className="h-4 w-4" /> {item.label}
                </a>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/50 p-4">
          <div className="flex items-center gap-3">
            <Avatar fallback={user?.email?.charAt(0) || "U"} />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{user?.email}</p>
            </div>
            <button onClick={signOut} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border/50 bg-card/80 backdrop-blur-xl px-4">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-muted-foreground cursor-pointer">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">K</div>
          <span className="font-semibold text-sm">KEEN AI</span>
        </div>
        <Avatar fallback={user?.email?.charAt(0) || "U"} className="h-8 w-8" />
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div className="fixed top-14 left-0 right-0 bg-card border-b border-border/50 p-4 space-y-1" onClick={(e) => e.stopPropagation()}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <a className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent",
                  )} onClick={() => setMobileOpen(false)}>
                    <Icon className="h-4 w-4" /> {item.label}
                  </a>
                </Link>
              );
            })}
            <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent cursor-pointer">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </main>
    </div>
  );
}
