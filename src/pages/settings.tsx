import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor, Save } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { apiGet, apiPut } from "../lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "../lib/utils";

interface Profile {
  id: number; userId: string; displayName?: string; avatarUrl?: string; bio?: string; theme: string;
}

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => apiGet<Profile | null>(`/user/profile?userId=${user?.id}`),
    enabled: !!user?.id,
  });

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (profile) { setDisplayName(profile.displayName || ""); setAvatarUrl(profile.avatarUrl || ""); setBio(profile.bio || ""); }
  }, [profile]);

  const upsertProfile = useMutation({
    mutationFn: (data: { userId: string; displayName?: string; avatarUrl?: string; bio?: string; theme?: string }) => apiPut<Profile>("/user/profile", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["profile"] }); toast.success("Settings saved"); },
    onError: () => toast.error("Failed to save settings"),
  });

  const handleSave = () => { if (user?.id) upsertProfile.mutate({ userId: user.id, displayName, avatarUrl, bio, theme }); };

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your preferences</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-20 w-full" /></div>
          ) : (
            <>
              <div className="space-y-2"><Label>Email</Label><Input value={user?.email || ""} disabled /></div>
              <div className="space-y-2"><Label htmlFor="displayName">Display Name</Label><Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your display name" /></div>
              <div className="space-y-2"><Label htmlFor="avatarUrl">Avatar URL</Label><Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.jpg" /></div>
              <div className="space-y-2"><Label htmlFor="bio">Bio</Label><Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself" /></div>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose your theme preference</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {themes.map((t) => {
              const Icon = t.icon;
              const active = theme === t.value;
              return (
                <button key={t.value} onClick={() => setTheme(t.value)}
                  className={cn("flex flex-1 items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all cursor-pointer",
                    active ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50")}>
                  <Icon className="h-4 w-4" /> {t.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Button onClick={handleSave} loading={upsertProfile.isPending} className="w-full">
        <Save className="h-4 w-4" /> Save Changes
      </Button>
    </motion.div>
  );
}
