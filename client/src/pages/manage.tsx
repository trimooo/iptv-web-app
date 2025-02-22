import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import AddChannelDialog from "@/components/add-channel-dialog";
import ImportM3uDialog from "@/components/import-m3u-dialog";
import AddXtreamDialog from "@/components/add-xtream-dialog"; // New Xtream Dialog
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Channel } from "@shared/schema";

export default function Manage() {
  const { toast } = useToast();
  const { data: channels } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  async function deleteChannel(id: number) {
    try {
      await apiRequest("DELETE", `/api/channels/${id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/channels"] });
      toast({ title: "Channel deleted successfully" });
    } catch (error) {
      toast({
        title: "Failed to delete channel",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="relative z-10 p-6 space-y-6 bg-gray-900 min-h-screen text-white">
      {/* Header Section */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-700">
        <h1 className="text-3xl font-bold">📺 Manage Channels</h1>
        <div className="flex gap-3">
          <ImportM3uDialog />
          <AddXtreamDialog /> {/* New Xtream Button */}
          <AddChannelDialog />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg bg-gray-800 shadow-lg p-4 border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-700 text-white">
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="w-[100px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels?.map((channel) => (
              <TableRow key={channel.id} className="hover:bg-gray-700">
                <TableCell>{channel.name}</TableCell>
                <TableCell>{channel.category}</TableCell>
                <TableCell className="font-mono text-sm truncate max-w-[200px]">
                  {channel.url}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteChannel(channel.id)}
                    className="hover:bg-red-500 hover:text-white transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
