import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarDays, MessageSquare, FileText } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { apiGet } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar } from "../components/ui/avatar";
import { Skeleton } from "../components/ui/skeleton";

interface Profile { id: number; userId: string; displayName?: string; avatarUrl?: string; bio?: string; theme: string; createdAt: string; }
interface Stats { totalConversations: number; totalMessages: number; }

export default function Profile() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => apiGet<Profile | null>(`/user/profile?userId=${user?.id}`),
    enabled: !!user?.id,
  });
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats", user?.id],
    queryFn: () => apiGet<Stats>(`/user/stats?userId=${user?.id}`),
    enabled: !!user?.id,
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div className="relative rounded-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative px-6 pb-6 -mt-12">
          <div className="flex items-end gap-4">
            {profileLoading ? <Skeleton className="h-20 w-20 rounded-full" /> :
              <Avatar src={profile?.avatarUrl} fallback={profile?.displayName || user?.email?.charAt(0) || "U"} className="h-20 w-20 ring-4 ring-background" />}
            <div className="pb-1">
              {profileLoading ? <Skeleton className="h-6 w-40" /> : <h2 className="text-xl font-bold">{profile?.displayName || "User"}</h2>}
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">About</CardTitle></CardHeader>
        <CardContent>
          {profileLoading ? <Skeleton className="h-4 w-full" /> : (
            <p className="text-sm text-muted-foreground">{profile?.bio || <span className="italic">No bio provided</span>}</p>
          )}
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" /> Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "recently"}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            {statsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : <p className="text-3xl font-bold text-primary">{stats?.totalConversations ?? 0}</p>}
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1"><MessageSquare className="h-3 w-3" /> Conversations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            {statsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : <p className="text-3xl font-bold text-primary">{stats?.totalMessages ?? 0}</p>}
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1"><FileText className="h-3 w-3" /> Messages</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
