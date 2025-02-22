import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle } from "lucide-react";
import type { Channel } from "@shared/schema";

interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  return (
    <Card className="group overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={channel.thumbnail}
            alt={channel.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
          <Link href={`/player?id=${channel.id}`}>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <PlayCircle className="h-12 w-12 text-white" />
            </div>
          </Link>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <div className="space-y-2 w-full">
          <h3 className="font-semibold leading-none tracking-tight">
            {channel.name}
          </h3>
          <Badge variant="secondary">{channel.category}</Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
