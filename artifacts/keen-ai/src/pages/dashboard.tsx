import { useAuth } from "@/hooks/use-auth";
import { useGetUserStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Zap, Clock, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const userId = user?.id;

  const { data: stats, isLoading } = useGetUserStats(
    { userId: userId || "" },
    { query: { enabled: !!userId, queryKey: ["/api/user/stats", { userId }] } }
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-4xl font-bold tracking-tight">Good evening.</h1>
        <p className="text-muted-foreground text-lg">Your command center is ready.</p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <Card className="bg-card/40 hover:bg-card/60 transition-colors border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "-" : stats?.totalConversations || 0}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-card/40 hover:bg-card/60 transition-colors border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Messages Exchanged</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "-" : stats?.totalMessages || 0}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-card/40 hover:bg-card/60 transition-colors border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
              <Zap className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500">Optimal</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-card/40 hover:bg-card/60 transition-colors border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Uptime</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono">99.9%</div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card className="col-span-1 bg-card/40 border-border/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader>
            <CardTitle>Start Thinking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">Open a new secure channel with KEEN AI. Your next great idea starts here.</p>
            <Link href="/chat">
              <Button variant="glow" className="w-full sm:w-auto">
                New Conversation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-card/40 border-border/50">
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center">
                <div className="mr-3 p-1 rounded-md bg-muted/50 border border-border/50">
                  <span className="font-mono text-xs">⌘K</span>
                </div>
                Open command palette from anywhere
              </li>
              <li className="flex items-center">
                <div className="mr-3 p-1 rounded-md bg-muted/50 border border-border/50">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                Responses stream in real-time
              </li>
              <li className="flex items-center">
                <div className="mr-3 p-1 rounded-md bg-muted/50 border border-border/50">
                  <Activity className="h-3 w-3 text-primary" />
                </div>
                Your history is securely saved
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
