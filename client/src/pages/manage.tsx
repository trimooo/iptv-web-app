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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Channels</h1>
        <AddChannelDialog />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels?.map((channel) => (
              <TableRow key={channel.id}>
                <TableCell>{channel.name}</TableCell>
                <TableCell>{channel.category}</TableCell>
                <TableCell className="font-mono text-sm">{channel.url}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteChannel(channel.id)}
                  >
                    <Trash2 className="h-4 w-4" />
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
