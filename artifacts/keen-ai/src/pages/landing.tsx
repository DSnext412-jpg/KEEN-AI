import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { TerminalSquare, Zap, Shield, Cpu, ArrowRight, Code, Layers } from "lucide-react";
import { useRef } from "react";

export default function Landing() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TerminalSquare className="h-6 w-6 text-primary" />
            <span className="font-bold tracking-tight text-lg">KEEN AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button variant="glow" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main ref={targetRef} className="relative z-10 pt-32 pb-24">
        {/* Hero Section */}
        <section className="px-6 min-h-[80vh] flex items-center justify-center relative">
          <motion.div 
            style={{ y, opacity }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-4 backdrop-blur-sm"
            >
              <Zap className="mr-2 h-4 w-4" />
              <span>v1.0 Now Available</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/50 pb-4">
              Ambient intelligence for <br className="hidden md:block"/>
              <span className="text-primary italic font-mono pr-2">builders</span> & <span className="text-primary italic font-mono">creators.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Not a template. Not a toy. A dark, focused command center where your thoughts collide with cutting-edge AI. Experience the future of interaction.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/login">
                <Button size="lg" variant="glow" className="h-14 px-8 text-base font-medium">
                  Open Terminal <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-background/50 backdrop-blur-sm border-border/50 hover:bg-muted">
                View Documentation
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Mockup Section */}
        <section className="px-6 py-24 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="rounded-xl border border-border/50 bg-card/20 p-2 backdrop-blur-xl shadow-2xl ring-1 ring-white/10"
            >
              <div className="rounded-lg overflow-hidden border border-border/50 bg-background flex flex-col aspect-video relative">
                {/* Mockup Header */}
                <div className="h-12 border-b border-border/50 flex items-center px-4 bg-muted/30">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="mx-auto px-4 py-1 text-xs font-mono text-muted-foreground bg-background rounded border border-border/50">
                    ~/workspace/keen-ai
                  </div>
                </div>
                {/* Mockup Body */}
                <div className="flex-1 p-8 font-mono text-sm leading-relaxed text-muted-foreground relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10" />
                  <p><span className="text-primary">keen</span> initialize --workspace</p>
                  <p className="text-emerald-500">✔ Workspace configured successfully.</p>
                  <p className="mt-4"><span className="text-primary">keen</span> connect --model gemini-pro</p>
                  <p className="text-emerald-500">✔ Neural link established.</p>
                  <p className="mt-4 text-foreground animate-pulse">Awaiting input_</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-24 bg-card/10 border-y border-border/50 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Engineered for precision.</h2>
              <p className="text-muted-foreground">Every surface has purpose. No fluff, just pure utility.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Cpu,
                  title: "Real-time Streams",
                  desc: "Zero perceived latency. Watch responses generate instantly via optimized Server-Sent Events."
                },
                {
                  icon: Layers,
                  title: "Dark Ambient Design",
                  desc: "A meticulous dark-first aesthetic that reduces eye strain and increases focus during long sessions."
                },
                {
                  icon: Code,
                  title: "Developer Centric",
                  desc: "Built with code in mind. Monospace typography where it matters, prose where it counts."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-background/50 border border-border/50 hover:bg-card/40 transition-colors backdrop-blur-sm group"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ring-1 ring-primary/20">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-32 text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto relative z-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Ready to upgrade your workflow?</h2>
            <p className="text-xl text-muted-foreground mb-8">Join the developers and creators already building the future with KEEN AI.</p>
            <Link href="/login">
              <Button size="lg" variant="glow" className="h-14 px-10 text-lg">
                Create Account
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TerminalSquare className="h-5 w-5" />
            <span className="font-semibold">KEEN AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for the bold.
          </p>
        </div>
      </footer>
    </div>
  );
}
