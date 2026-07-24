import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { ThemeProvider } from 'next-themes';
import { Shell } from '@/components/layout/shell';
import { CommandPalette } from '@/components/command-palette';

// Pages
import Landing from '@/pages/landing';
import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import Chat from '@/pages/chat';
import Settings from '@/pages/settings';
import Profile from '@/pages/profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ component: Component, ...rest }: { component: any, path: string }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex space-x-2 items-center">
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <div className="h-3 w-3 bg-primary rounded-full delay-75"></div>
          <div className="h-3 w-3 bg-primary rounded-full delay-150"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Route {...rest} component={() => {
      window.location.href = `${import.meta.env.BASE_URL}login`;
      return null;
    }} />;
  }

  return (
    <Route {...rest}>
      <Shell>
        <Component />
      </Shell>
    </Route>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/chat" component={Chat} />
      <ProtectedRoute path="/settings" component={Settings} />
      <ProtectedRoute path="/profile" component={Profile} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AuthProvider>
            <TooltipProvider>
              <CommandPalette />
              <Router />
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </WouterRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
