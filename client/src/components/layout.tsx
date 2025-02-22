import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, PlayCircle, Settings } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Channels" },
    { href: "/player", icon: PlayCircle, label: "Player" },
    { href: "/manage", icon: Settings, label: "Manage" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:top-0 md:border-b md:border-t-0">
        <div className="container flex h-16 items-center">
          <div className="flex w-full justify-around gap-2 md:justify-start">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={location === item.href ? "default" : "ghost"}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="ml-2 hidden md:inline-block">
                    {item.label}
                  </span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </nav>
      <main className="container pb-20 pt-6 md:pb-6 md:pt-20">{children}</main>
    </div>
  );
}
