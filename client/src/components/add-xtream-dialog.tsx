import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AddXtreamDialog() {
  const { toast } = useToast();
  const [form, setForm] = useState({ username: "", password: "", host: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await apiRequest("POST", "/api/xtream/add", form);
      toast({ title: "Xtream account added successfully" });
    } catch (error) {
      toast({ title: "Failed to add Xtream account", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Xtream Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Xtream Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Host (e.g., http://example.com)" name="host" value={form.host} onChange={handleChange} />
          <Input placeholder="Username" name="username" value={form.username} onChange={handleChange} />
          <Input type="password" placeholder="Password" name="password" value={form.password} onChange={handleChange} />
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
