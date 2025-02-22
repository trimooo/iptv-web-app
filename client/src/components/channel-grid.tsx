import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import ChannelCard from "./channel-card";
import type { Channel } from "@shared/schema";

interface ChannelGridProps {
  channels: Channel[];
}

export default function ChannelGrid({ channels }: ChannelGridProps) {
  const [search, setSearch] = useState("");

  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search channels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex space-x-2 p-4">
          {Array.from(new Set(channels.map((c) => c.category))).map(
            (category) => (
              <div
                key={category}
                className="rounded-full px-3 py-1 text-sm bg-secondary"
              >
                {category}
              </div>
            ),
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredChannels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
}
