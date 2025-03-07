import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function AddUrlDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", url: "" });

  async function handleSubmit() {
    try {
      await apiRequest("POST", "/api/channels", form);
      queryClient.invalidateQueries({ queryKey: ["/api/channels"] });
      toast({ title: "URL added successfully" });
      setOpen(false);
      setForm({ name: "", url: "" });
    } catch (error) {
      toast({
        title: "Failed to add URL",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Link className="mr-2 h-4 w-4" />
          Add URL
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New URL</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter channel name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">URL</label>
            <Input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="Enter stream URL"
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Add URL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
