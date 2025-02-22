import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChannelSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/channels", async (_req, res) => {
    const channels = await storage.getChannels();
    res.json(channels);
  });

  app.get("/api/channels/:id", async (req, res) => {
    const channel = await storage.getChannel(Number(req.params.id));
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    res.json(channel);
  });

  app.post("/api/channels", async (req, res) => {
    const result = insertChannelSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.message });
    }
    const channel = await storage.createChannel(result.data);
    res.status(201).json(channel);
  });

  app.patch("/api/channels/:id", async (req, res) => {
    const result = insertChannelSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.message });
    }
    try {
      const channel = await storage.updateChannel(
        Number(req.params.id),
        result.data,
      );
      res.json(channel);
    } catch (error) {
      res.status(404).json({ message: "Channel not found" });
    }
  });

  app.delete("/api/channels/:id", async (req, res) => {
    await storage.deleteChannel(Number(req.params.id));
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
