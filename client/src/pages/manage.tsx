import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Edit2, Plus, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Channel } from "@shared/schema";
import ImportM3uDialog from "@/components/import-m3u-dialog";
import AddXtreamDialog from "@/components/add-xtream-dialog";
import AddUrlDialog from "@/components/add-url-dialog";
import EditChannelDialog from "@/components/edit-channel-dialog";
export default function Manage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: channels } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);

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
    <div className="relative z-10 p-3 md:p-6 space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-700 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          🔗 URL Management
        </h1>
        <div className="flex flex-wrap gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ImportM3uDialog />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <AddXtreamDialog />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <AddUrlDialog />
          </motion.div>
        </div>
      </div>

      {/* URL List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-gray-800/50 backdrop-blur-sm shadow-xl p-2 md:p-4 border border-gray-700/50 overflow-x-auto"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-700/50 text-white">
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels?.map((channel) => (
              <TableRow key={channel.id} className="hover:bg-gray-700/30">
                <TableCell className="font-medium">{channel.name}</TableCell>
                <TableCell className="font-mono text-xs truncate max-w-[300px]">
                  {channel.url}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    channel.sourceType === 'm3u' 
                      ? 'bg-orange-500/20 text-orange-400'
                      : channel.sourceType === 'xtream'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {channel.sourceType || 'URL'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingChannel(channel)}
                    className="hover:bg-blue-500 hover:text-white transition-all duration-200"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {editingChannel && (
        <EditChannelDialog
          channel={editingChannel}
          onClose={() => setEditingChannel(null)}
        />
      )}
    </div>
  );
}

