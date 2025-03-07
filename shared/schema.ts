import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  category: varchar("category", { length: 100 }).notNull().default("Other"),
  thumbnail: text("thumbnail").notNull(),
});

export const insertChannelSchema = createInsertSchema(channels, {
  name: z.string().min(1).max(255),
  url: z.string().url(),
  category: z.string().min(1).max(100),
  thumbnail: z.string().url(),
});

export const selectChannelSchema = createSelectSchema(channels);
export type Channel = {
  id: number;
  name: string;
  url: string;
  category: string;
  sourceType?: 'm3u' | 'xtream';
  sourceId?: string;
  thumbnail: string;
};
export type InsertChannel = z.infer<typeof insertChannelSchema>;