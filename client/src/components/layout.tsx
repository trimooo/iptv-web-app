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
    <div className="min-h-screen flex flex-col relative bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] md:top-4 md:bottom-auto md:w-[60%] bg-opacity-20 backdrop-blur-md border border-gray-700 rounded-xl shadow-xl z-50">
        <div className="flex justify-around py-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "flex flex-col items-center px-4 py-2 transition-all duration-300",
                  location === item.href ? "text-blue-400" : "text-gray-300",
                  "hover:text-white hover:scale-105"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>

      {/* Page Content */}
      <main className="container flex-1 pt-20 md:pt-28 px-4 md:px-16">
        {children}
      </main>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {/* Glowing Effect */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
