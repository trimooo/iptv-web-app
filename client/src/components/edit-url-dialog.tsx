import { useState } from "react";
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

export default function EditUrlDialog({ channel, onClose }: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: channel.name,
    url: channel.url,
  });

  async function handleSubmit() {
    try {
      await apiRequest("PATCH", `/api/channels/${channel.id}`, form);
      queryClient.invalidateQueries({ queryKey: ["/api/channels"] });
      toast({ title: "URL updated successfully" });
      onClose();
    } catch (error) {
      toast({
        title: "Failed to update URL",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit URL</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">URL</label>
            <Input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
