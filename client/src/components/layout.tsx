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
    <div className=" min-h-screen flex bg-gray-900 text-white">
      {/* Navigation Sidebar */}
      <div className="w-20 h-screen bg-gray-800 border-r border-gray-700 flex flex-col items-center p-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="mb-6">
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center px-2 py-2 transition-all duration-300",
                location === item.href ? "text-blue-400" : "text-gray-300",
                "hover:text-white hover:scale-110"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        <main className="flex-1 pt-10 md:pt-16 px-4 md:px-16 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
