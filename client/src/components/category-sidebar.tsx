import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { Channel } from "@shared/schema";

interface CategorySidebarProps {
  channels?: Channel[];
  onCategorySelect?: (category: string | null) => void;
}

export default function CategorySidebar({ channels = [], onCategorySelect }: CategorySidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories from IPTV channels
  const categories = Array.from(new Set(channels.map((c) => c.category).filter(Boolean))); // Remove empty categories

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white border-r border-gray-700 flex flex-col p-4 space-y-4 fixed top-0 left-20">
      {/* Sidebar Title */}
      <h2 className="text-lg font-semibold">Categories</h2>

      {/* Category List */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="w-full cursor-pointer p-2 text-center hover:bg-primary/90"
          onClick={() => {
            setSelectedCategory(null);
            onCategorySelect?.(null);
          }}
        >
          All
        </Badge>
        {categories.length > 0 ? (
          categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="w-full cursor-pointer p-2 text-center hover:bg-primary/90"
              onClick={() => {
                setSelectedCategory(category);
                onCategorySelect?.(category);
              }}
            >
              {category}
            </Badge>
          ))
        ) : (
          <p className="text-gray-400 text-sm text-center">No categories found</p>
        )}
      </div>
    </aside>
  );
}