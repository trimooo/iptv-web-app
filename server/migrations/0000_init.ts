import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  category: varchar("category", { length: 100 }).notNull().default("Other"),
  thumbnail: text("thumbnail").notNull(),
});
