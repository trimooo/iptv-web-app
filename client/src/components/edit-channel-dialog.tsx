import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Channel } from "@shared/schema";

interface Props {
  channel: Channel;
  onClose: () => void;
}

export default function EditChannelDialog({ channel, onClose }: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: channel.name,
    url: channel.url,
  });

  async function handleSubmit() {
    try {
      await apiRequest("PATCH", `/api/channels/${channel.id}`, form);
      queryClient.invalidateQueries({ queryKey: ["/api/channels"] });
      toast({ title: "Channel updated successfully" });
      onClose();
    } catch (error) {
      toast({
        title: "Failed to update channel",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Channel</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label>Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label>URL</label>
            <Input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
