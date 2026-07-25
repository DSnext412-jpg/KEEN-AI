import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { MessageSquare, FileText, Activity, Shield, ArrowRight, Sparkles, Command, History } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { apiGet } from "../lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
} as const;

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats", user?.id],
    queryFn: () => apiGet<{ totalConversations: number; totalMessages: number }>(`/user/stats?userId=${user?.id}`),
    enabled: !!user?.id,
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const statCards = [
    { title: "Conversations", value: stats?.totalConversations ?? 0, icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Messages", value: stats?.totalMessages ?? 0, icon: FileText, color: "text-purple-400", bg: "bg-purple-500/10" },
    { title: "System Status", value: "Optimal", icon: Activity, color: "text-green-400", bg: "bg-green-500/10", badge: "success" as const },
    { title: "Uptime", value: "99.9%", icon: Shield, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight">{greeting}.</h1>
        <p className="text-muted-foreground mt-1">Your command center is ready.</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return isLoading ? (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ) : (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${s.bg}`}><Icon className={`h-5 w-5 ${s.color}`} /></div>
                  {s.badge && <Badge variant={s.badge}>{s.value}</Badge>}
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Start Thinking</CardTitle>
            <CardDescription>Begin a new AI-powered conversation</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chat"><Button variant="glow">New Conversation <ArrowRight className="h-4 w-4" /></Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Command className="h-5 w-5 text-primary" /> Quick Tips</CardTitle>
            <CardDescription>Get the most out of KEEN AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><kbd className="rounded border border-border px-1.5 py-0.5 text-xs">Ctrl+K</kbd> Open command palette</p>
            <p className="flex items-center gap-2"><History className="h-3.5 w-3.5" /> Conversations saved automatically</p>
            <p className="flex items-center gap-2"><Activity className="h-3.5 w-3.5" /> Real-time AI streaming</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
