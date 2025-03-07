import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface Props {
  source: {
    id: string;
    name: string;
    url: string;
    type: string;
    username?: string;
    password?: string;
  };
  onClose: () => void;
}

export default function EditSourceDialog({ source, onClose }: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: source.name,
    url: source.url,
    username: source.username || '',
    password: source.type === 'xtream' ? '********' : '',
  });

  async function handleSubmit() {
    try {
      await apiRequest("PATCH", `/api/sources/${source.type}/${source.id}`, form);
      queryClient.invalidateQueries({ queryKey: ["/api/sources"] });
      toast({ title: "Source updated successfully" });
      onClose();
    } catch (error) {
      toast({
        title: "Failed to update source",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {source.type.toUpperCase()} Source</DialogTitle>
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
            <label className="text-sm font-medium">URL/Host</label>
            <Input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </div>
          {source.type === 'xtream' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Leave blank to keep unchanged"
                />
              </div>
            </>
          )}
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
