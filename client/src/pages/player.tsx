import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import VideoPlayer from "@/components/video-player";
import { Skeleton } from "@/components/ui/skeleton";
import type { Channel } from "@shared/schema";

export default function Player() {
  const [location] = useLocation();
  const id = new URLSearchParams(location.split("?")[1]).get("id");

  const { data: channel, isLoading } = useQuery<Channel>({
    queryKey: [`/api/channels/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return <Skeleton className="aspect-video w-full" />;
  }

  if (!channel) {
    return <div>Channel not found</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{channel.name}</h1>
      <VideoPlayer url={channel.url} className="aspect-video w-full" />
    </div>
  );
}
