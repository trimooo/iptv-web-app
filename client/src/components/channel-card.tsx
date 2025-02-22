import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock } from "lucide-react";
import type { Channel } from "@shared/schema";

interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  // Simulated EPG data - in a real app, this would come from an API
  const currentProgram = {
    title: "Live Program",
    startTime: new Date().toLocaleTimeString(),
    endTime: new Date(Date.now() + 3600000).toLocaleTimeString(),
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={channel.thumbnail}
            alt={channel.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Link href={`/player?id=${channel.id}`}>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button variant="secondary" className="gap-2">
                <PlayCircle className="h-5 w-5" />
                Watch Now
              </Button>
            </div>
          </Link>
        </div>
      </CardContent>
      <CardFooter className="p-4 space-y-3">
        <div className="space-y-2 w-full">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold tracking-tight line-clamp-1">
              {channel.name}
            </h3>
            <Badge variant="secondary" className="ml-2">
              {channel.category}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {currentProgram.startTime} - {currentProgram.endTime}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {currentProgram.title}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}