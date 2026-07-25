import { Link } from "wouter";
import { ArrowRight, Bot, Zap, Lock, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const features = [
  { icon: Bot, title: "AI-Powered Chat", description: "Real-time streaming conversations with Google Gemini." },
  { icon: Zap, title: "Lightning Fast", description: "SSE streaming for zero-latency responses." },
  { icon: Lock, title: "Secure Auth", description: "Supabase authentication with email/password." },
  { icon: MessageSquare, title: "Conversation History", description: "All your chats saved and organized." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] pointer-events-none" />
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">K</div>
          <span className="font-semibold tracking-tight text-lg">KEEN AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"><a className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</a></Link>
          <Link href="/login"><Button size="sm" variant="glow">Get Started</Button></Link>
        </div>
      </nav>

      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-8">
            <Sparkles className="h-3.5 w-3.5" /> Powered by Gemini AI
          </div>
          <h1 className="max-w-3xl text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Think alongside <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground mx-auto">
            A dark, focused command center for builders and creators. Real-time AI conversations, organized thoughts, and intelligent assistance.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/login"><Button size="lg" variant="glow">Start Thinking <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/login"><Button size="lg" variant="outline">Learn More</Button></Link>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
