import { useQuery } from "@tanstack/react-query";
import ChannelGrid from "@/components/channel-grid";
import { Skeleton } from "@/components/ui/skeleton";
import type { Channel } from "@shared/schema";

export default function Home() {
  const { data: channels, isLoading } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        ))}
      </div>
    );
  }

  return <ChannelGrid channels={channels || []} />;
}
