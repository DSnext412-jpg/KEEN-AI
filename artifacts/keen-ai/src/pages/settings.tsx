import { useAuth } from "@/hooks/use-auth";
import { useGetUserProfile, useUpsertUserProfile, getGetUserProfileQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { Moon, Sun, Monitor, Loader2, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  const { user } = useAuth();
  const userId = user?.id;
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useGetUserProfile(
    { userId: userId || "" },
    { query: { enabled: !!userId, queryKey: getGetUserProfileQueryKey({ userId: userId || "" }) } }
  );

  const upsertProfile = useUpsertUserProfile();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatarUrl || "");
    }
  }, [profile]);

  const handleSave = () => {
    if (!userId) return;
    upsertProfile.mutate({
      data: {
        userId,
        displayName,
        bio,
        avatarUrl,
        theme: profile?.theme || "system"
      }
    }, {
      onSuccess: () => {
        toast({ title: "Profile updated successfully" });
        queryClient.invalidateQueries({ queryKey: getGetUserProfileQueryKey({ userId }) });
      },
      onError: () => {
        toast({ title: "Error updating profile", variant: "destructive" });
      }
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and preferences.</p>
      </motion.div>

      <div className="grid gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your public profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user?.email || ""} disabled className="bg-muted/50" />
                    <p className="text-xs text-muted-foreground">Your email is managed by your authentication provider.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input 
                      id="displayName" 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)} 
                      placeholder="e.g. Alex"
                      className="bg-background/50 focus-visible:ring-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input 
                      id="avatarUrl" 
                      value={avatarUrl} 
                      onChange={(e) => setAvatarUrl(e.target.value)} 
                      placeholder="https://..."
                      className="bg-background/50 focus-visible:ring-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)} 
                      placeholder="A short bio about yourself..."
                      className="bg-background/50 focus-visible:ring-primary/50 min-h-[100px]"
                    />
                  </div>

                  <Button 
                    onClick={handleSave} 
                    disabled={upsertProfile.isPending}
                    variant="default"
                    className="w-full sm:w-auto"
                  >
                    {upsertProfile.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how KEEN AI looks on your device.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="flex-1 justify-start h-14 bg-background/50 border-border/50 hover:bg-muted"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="mr-2 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Light</div>
                    <div className="text-xs text-muted-foreground font-normal">Bright and clear</div>
                  </div>
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="flex-1 justify-start h-14 bg-background/50 border-border/50 hover:bg-muted"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="mr-2 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Dark</div>
                    <div className="text-xs text-muted-foreground font-normal">Deep and focused</div>
                  </div>
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  className="flex-1 justify-start h-14 bg-background/50 border-border/50 hover:bg-muted"
                  onClick={() => setTheme("system")}
                >
                  <Monitor className="mr-2 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">System</div>
                    <div className="text-xs text-muted-foreground font-normal">Matches device</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
