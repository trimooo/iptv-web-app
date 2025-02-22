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
    <div className="min-h-screen flex flex-col relative">
      <nav className="fixed bottom-0 left-0 w-full border-t md:top-0 md:border-b md:border-t-0  ">
        <div className="container flex h-16 items-center">
          <div className="flex w-full justify-around gap-2 md:justify-start">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={location === item.href ? "default" : "ghost"}
                className="relative z-[41]"
                asChild
              >
                <Link href={item.href} className="flex items-center">
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
      <main className="container flex-1 pb-20 pt-6 md:pb-6 md:pt-20 relative z-[30]">
        {children}
      </main>
    </div>
  );
}