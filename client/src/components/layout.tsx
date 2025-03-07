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
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Mobile-friendly Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:relative md:w-20 h-16 md:h-screen bg-gray-800 border-t md:border-r border-gray-700 flex md:flex-col items-center justify-around md:justify-start p-2 md:p-4 z-50">
        <div className="flex md:flex-col items-center justify-around md:space-y-6 w-full">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "flex flex-col items-center p-1 md:p-2 transition-all duration-300",
                  location === item.href ? "text-blue-400" : "text-gray-300",
                  "hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-[10px] md:text-xs mt-1">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content with proper spacing for mobile navigation */}
      <div className="flex-1 flex flex-col relative pb-16 md:pb-0">
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
