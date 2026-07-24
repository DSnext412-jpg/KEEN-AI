import { useAuth } from "@/hooks/use-auth";
import { useGetUserProfile, useGetUserStats, getGetUserProfileQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Calendar, MessageSquare, Activity, UserCircle } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Profile() {
  const { user } = useAuth();
  const userId = user?.id;

  const { data: profile, isLoading: isProfileLoading } = useGetUserProfile(
    { userId: userId || "" },
    { query: { enabled: !!userId, queryKey: getGetUserProfileQueryKey({ userId: userId || "" }) } }
  );

  const { data: stats, isLoading: isStatsLoading } = useGetUserStats(
    { userId: userId || "" },
    { query: { enabled: !!userId, queryKey: ["/api/user/stats", { userId }] } }
  );

  const initials = profile?.displayName 
    ? profile.displayName.substring(0, 2).toUpperCase() 
    : user?.email?.substring(0, 2).toUpperCase() || "KA";

  const joinDate = profile?.createdAt ? format(new Date(profile.createdAt), "MMMM yyyy") : "Recently";

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative rounded-2xl overflow-hidden mb-8 h-48 bg-gradient-to-r from-primary/20 via-background to-secondary border border-border/50">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
        </div>

        <div className="relative -mt-24 px-6 flex flex-col md:flex-row items-center md:items-end gap-6 pb-6 border-b border-border/50">
          <div className="rounded-full p-2 bg-background border border-border/50 shadow-xl relative z-10">
            <Avatar className="h-32 w-32 ring-1 ring-border/50">
              <AvatarImage src={profile?.avatarUrl || ""} alt="Avatar" className="object-cover" />
              <AvatarFallback className="text-3xl bg-secondary font-mono">{initials}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-3xl font-bold">{profile?.displayName || "Anonymous User"}</h1>
            <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
              <Mail className="h-4 w-4" />
              {user?.email}
            </p>
          </div>
          
          <div className="mb-2 text-sm text-muted-foreground flex items-center bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            Joined {joinDate}
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 space-y-6"
        >
          <Card className="bg-card/40 border-border/50">
            <CardContent className="p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4 text-lg">
                <UserCircle className="h-5 w-5 text-primary" />
                About
              </h3>
              {profile?.bio ? (
                <p className="text-muted-foreground leading-relaxed">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-muted-foreground/60 italic">No bio provided. Update your settings to add one.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <Card className="bg-card/40 border-border/50">
            <CardContent className="p-6 space-y-6">
              <h3 className="font-semibold text-lg border-b border-border/50 pb-2">Activity Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-muted-foreground">
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Conversations</span>
                  </div>
                  <span className="font-bold font-mono">{isStatsLoading ? "-" : stats?.totalConversations || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-muted-foreground">
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Messages</span>
                  </div>
                  <span className="font-bold font-mono">{isStatsLoading ? "-" : stats?.totalMessages || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
