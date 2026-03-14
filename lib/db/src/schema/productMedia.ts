import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productMediaTable = pgTable("product_media", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull().default("image"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertProductMediaSchema = createInsertSchema(productMediaTable).omit({ id: true });
export type InsertProductMedia = z.infer<typeof insertProductMediaSchema>;
export type ProductMedia = typeof productMediaTable.$inferSelect;
