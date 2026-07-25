import { Route, Switch, useLocation } from "wouter";
import { useAuth } from "./hooks/use-auth";
import { Shell } from "./components/shell";
import { CommandPalette } from "./components/command-palette";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Chat from "./pages/chat";
import Settings from "./pages/settings";
import Profile from "./pages/profile";
import NotFound from "./pages/not-found";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  if (!user) { navigate("/login"); return null; }

  return (
    <>
      <CommandPalette />
      <Shell>{children}</Shell>
    </>
  );
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard"><ProtectedRoute><Dashboard /></ProtectedRoute></Route>
      <Route path="/chat"><ProtectedRoute><Chat /></ProtectedRoute></Route>
      <Route path="/settings"><ProtectedRoute><Settings /></ProtectedRoute></Route>
      <Route path="/profile"><ProtectedRoute><Profile /></ProtectedRoute></Route>
      <Route component={NotFound} />
    </Switch>
  );
}
