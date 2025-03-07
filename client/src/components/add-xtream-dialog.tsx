import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AddXtreamDialog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    host: "",
    username: "",
    password: ""
  });

  const handleSubmit = async () => {
    if (!form.host || !form.username || !form.password) {
      toast({ 
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    try {
      // Add debug logging
      console.log("Submitting Xtream form:", { ...form, password: '***' });

      const response = await apiRequest("POST", "/api/sources/xtream", {
        ...form,
        name: form.name || `Xtream - ${form.username}`,
      });

      console.log("Xtream response:", response);

      // Invalidate queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/api/sources"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/channels"] })
      ]);
      
      toast({ 
        title: "Xtream account added successfully",
        description: "Your channels will be available shortly"
      });
      setOpen(false);
      setForm({ name: "", host: "", username: "", password: "" });
    } catch (error: any) {
      console.error("Xtream add error:", error);
      toast({ 
        title: "Failed to add Xtream account",
        description: error.message || "Please check your credentials",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Xtream Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Xtream Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name (Optional)</label>
            <Input
              placeholder="Custom name for this account"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Host URL</label>
            <Input
              placeholder="http://example.com:port"
              value={form.host}
              onChange={(e) => setForm({ ...form, host: e.target.value })}
            />
          </div>
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
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="w-full"
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin mr-2" />
                Adding...
              </span>
            ) : (
              "Add Account"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
