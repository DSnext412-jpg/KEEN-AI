import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, MessageSquare, Settings, UserCircle, LogOut, TerminalSquare } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function Shell({ children }: LayoutProps) {
  const [location] = useLocation();
  const { signOut, user } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: UserCircle },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col border-r border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="flex h-16 items-center px-6">
          <TerminalSquare className="h-6 w-6 text-primary mr-2" />
          <span className="text-lg font-bold tracking-tight">KEEN AI</span>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-shrink-0 border-t border-border/50 p-4">
          <div className="flex w-full items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-foreground">{user?.email}</p>
              <button
                onClick={signOut}
                className="text-xs font-medium text-muted-foreground hover:text-destructive transition-colors flex items-center mt-1"
              >
                <LogOut className="h-3 w-3 mr-1" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none -z-10" />
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none -z-10 mix-blend-overlay" />
        
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between h-14 border-b border-border/50 bg-background/50 backdrop-blur-md px-4">
          <div className="flex items-center">
            <TerminalSquare className="h-5 w-5 text-primary mr-2" />
            <span className="font-bold tracking-tight">KEEN AI</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto w-full max-w-6xl mx-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
