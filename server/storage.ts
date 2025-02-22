import { channels, type Channel, type InsertChannel } from "@shared/schema";

export interface IStorage {
  getChannels(): Promise<Channel[]>;
  getChannel(id: number): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  updateChannel(id: number, channel: Partial<InsertChannel>): Promise<Channel>;
  deleteChannel(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private channels: Map<number, Channel>;
  private currentId: number;

  constructor() {
    this.channels = new Map();
    this.currentId = 1;
  }

  async getChannels(): Promise<Channel[]> {
    return Array.from(this.channels.values());
  }

  async getChannel(id: number): Promise<Channel | undefined> {
    return this.channels.get(id);
  }

  async createChannel(insertChannel: InsertChannel): Promise<Channel> {
    const id = this.currentId++;
    const channel: Channel = {
      ...insertChannel,
      id,
      createdAt: new Date(),
    };
    this.channels.set(id, channel);
    return channel;
  }

  async updateChannel(
    id: number,
    updateData: Partial<InsertChannel>,
  ): Promise<Channel> {
    const existing = await this.getChannel(id);
    if (!existing) {
      throw new Error("Channel not found");
    }
    const updated = { ...existing, ...updateData };
    this.channels.set(id, updated);
    return updated;
  }

  async deleteChannel(id: number): Promise<void> {
    this.channels.delete(id);
  }
}

export const storage = new MemStorage();
