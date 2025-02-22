import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { parseM3uUrl } from "@/lib/m3u";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

const importSchema = z.object({
  url: z.string().url("Please enter a valid M3U URL"),
});

type ImportFormData = z.infer<typeof importSchema>;

export default function ImportM3uDialog() {
  const [open, setOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ImportFormData>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      url: "",
    },
  });

  async function onSubmit(data: ImportFormData) {
    try {
      setImporting(true);
      const channels = await parseM3uUrl(data.url);
      
      // Import channels one by one
      for (const channel of channels) {
        await apiRequest("POST", "/api/channels", channel);
      }

      queryClient.invalidateQueries({ queryKey: ["/api/channels"] });
      toast({ title: `Successfully imported ${channels.length} channels` });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to import channels",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Import M3U
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Channels from M3U</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>M3U URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="http://example.com/playlist.m3u" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={importing}>
              {importing ? "Importing..." : "Import Channels"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
