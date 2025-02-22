import { type InsertChannel } from "@shared/schema";
import { DEFAULT_THUMBNAILS } from "./constants";

export async function parseM3uUrl(url: string): Promise<InsertChannel[]> {
  try {
    const response = await fetch("/api/channels/parse-m3u", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error("Failed to parse M3U file");
    }

    return await response.json();
  } catch (error) {
    console.error("Error parsing M3U:", error);
    throw error;
  }
}
