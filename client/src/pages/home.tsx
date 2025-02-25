import { useQuery } from "@tanstack/react-query";
import CategorySidebar from "@/components/category-sidebar";
import ChannelSidebar from "@/components/channel-sidebar";
import VideoPlayer from "@/components/video-player";
import { Skeleton } from "@/components/ui/skeleton";
import type { Channel } from "@shared/schema";
import { useState } from "react";

export default function Home() {
  const { data: channels, isLoading } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  // Filter channels by selected category
  const filteredChannels = selectedCategory
    ? channels?.filter((channel) => channel.category === selectedCategory)
    : channels;

  if (isLoading) {
    return (
      <div className="flex">
        {/* Category Sidebar (First) */}
        <aside className="w-64 h-screen overflow-y-auto bg-gray-800 text-white p-4">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <ul>
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="mb-2">
                <Skeleton className="h-6 w-full max-w-[150px] rounded" />
              </li>
            ))}
          </ul>
        </aside>

        {/* Channel Sidebar (Second) */}
        <aside className="w-64 h-screen overflow-y-auto bg-gray-700 text-white p-4">
          <h2 className="text-xl font-bold mb-4">Channels</h2>
          <ul>
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="mb-2">
                <Skeleton className="h-6 w-full max-w-[180px] rounded" />
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="text-center py-12 text-muted-foreground">
            Loading channels...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Category Sidebar (First) */}
      <CategorySidebar 
        channels={channels} 
        onCategorySelect={setSelectedCategory} 
      />

      {/* Channel Sidebar (Second) */}
      <ChannelSidebar 
        channels={filteredChannels || []} 
        onSelectChannel={setSelectedChannel} 
      />

      {/* Main Content - Video Player */}
      <div className="flex-1 p-6 flex flex-col items-center">
        {selectedChannel ? (
          <div className="w-full max-w-3xl">
            <h2 className="text-xl font-bold mb-4">{selectedChannel.name}</h2>
            <VideoPlayer url={selectedChannel.url} title={selectedChannel.name} />
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Select a channel to start watching.
          </div>
        )}
      </div>
    </div>
  );
}