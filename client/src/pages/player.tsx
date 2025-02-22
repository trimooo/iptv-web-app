import { useQuery } from "@tanstack/react-query";
import {  useRoute  } from "wouter";
import VideoPlayer from "@/components/video-player";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock } from "lucide-react";
import type { Channel } from "@shared/schema";

export default function Player() {
  const [, params] = useRoute("/player/:id");
  const id = params?.id;

  const { data: channel, isLoading } = useQuery<Channel>({
    queryKey: [`/api/channels/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Channel not found</p>
      </div>
    );
  }

  // Simulated EPG data - in a real app, this would come from an API
  const currentProgram = {
    title: "Live Program",
    description: "Currently streaming live content",
    startTime: new Date().toLocaleTimeString(),
    endTime: new Date(Date.now() + 3600000).toLocaleTimeString(),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{channel.name}</h1>
          <Badge>{channel.category}</Badge>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg">
        <VideoPlayer 
          url={channel.url} 
          title={channel.name}
          className="aspect-video w-full"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {currentProgram.startTime} - {currentProgram.endTime}
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{currentProgram.title}</h2>
              <p className="text-muted-foreground">
                {currentProgram.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}