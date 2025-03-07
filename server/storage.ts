import { channels, type Channel, type InsertChannel } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getChannels(): Promise<Channel[]>;
  getChannel(id: number): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  updateChannel(id: number, channel: Partial<InsertChannel>): Promise<Channel>;
  deleteChannel(id: number): Promise<void>;
  addM3uPlaylist(url: string): Promise<Channel[]>;
  addXtreamCredentials(host: string, username: string, password: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getChannels(): Promise<Channel[]> {
    return await db.select().from(channels);
  }

  async getChannel(id: number): Promise<Channel | undefined> {
    const [channel] = await db.select().from(channels).where(eq(channels.id, id));
    return channel;
  }

  async createChannel(insertChannel: InsertChannel): Promise<Channel> {
    const [channel] = await db
      .insert(channels)
      .values(insertChannel)
      .returning();
    return channel;
  }

  async updateChannel(
    id: number,
    updateData: Partial<InsertChannel>,
  ): Promise<Channel> {
    const [updated] = await db
      .update(channels)
      .set(updateData)
      .where(eq(channels.id, id))
      .returning();

    if (!updated) {
      throw new Error("Channel not found");
    }

    return updated;
  }

  async deleteChannel(id: number): Promise<void> {
    await db.delete(channels).where(eq(channels.id, id));
  }

  async addM3uPlaylist(url: string): Promise<Channel[]> {
    const response = await fetch(url);
    const m3uContent = await response.text();
    const parser = await import("iptv-playlist-parser");
    const result = parser.parse(m3uContent);
    
    const channels = await Promise.all(
      result.items.map(async (item) => {
        const channel = await this.createChannel({
          name: item.name || "Unknown Channel",
          url: item.url,
          category: item.group.title || "Other",
          thumbnail: item.tvg.logo || "https://images.unsplash.com/photo-1501626438835-4be53d940ff8"
        });
        return channel;
      })
    );

    return channels;
  }

  async addXtreamCredentials(host: string, username: string, password: string): Promise<void> {
    const authUrl = `${host}/player_api.php?username=${username}&password=${password}`;
    const response = await fetch(authUrl);
    
    if (!response.ok) {
      throw new Error("Invalid Xtream credentials");
    }

    const data = await response.json();
    
    // Store channels from Xtream
    if (data.available_channels) {
      await Promise.all(
        data.available_channels.map((channel: any) =>
          this.createChannel({
            name: channel.name,
            url: `${host}/live/${username}/${password}/${channel.stream_id}`,
            category: channel.category_name || "Xtream",
            thumbnail: channel.stream_icon || "https://images.unsplash.com/photo-1501626438835-4be53d940ff8"
          })
        )
      );
    }
  }
}

export const storage = new DatabaseStorage();