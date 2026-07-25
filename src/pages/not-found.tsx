import { Link } from "wouter";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="text-8xl font-extrabold text-primary/20">404</div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/"><Button variant="outline"><ArrowLeft className="h-4 w-4" /> Go Home</Button></Link>
          <Link href="/dashboard"><Button variant="glow"><Home className="h-4 w-4" /> Dashboard</Button></Link>
        </div>
      </div>
    </div>
  );
}
