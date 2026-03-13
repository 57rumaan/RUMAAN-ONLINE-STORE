import { pgTable, text, serial, boolean, timestamp, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  imageUrl: text("image_url").notNull().default(""),
  categoryId: integer("category_id").notNull(),
  featured: boolean("featured").notNull().default(false),
  inStock: boolean("in_stock").notNull().default(true),
  whatsappNumber: text("whatsapp_number").notNull().default("+923001234567"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
