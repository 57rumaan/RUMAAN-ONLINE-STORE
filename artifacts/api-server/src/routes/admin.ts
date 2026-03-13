import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, productsTable, ordersTable, reviewsTable, categoriesTable } from "@workspace/db";
import { GetAdminStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [totalProducts] = await db.select({ count: sql<number>`COUNT(*)::int` }).from(productsTable);
  const [totalOrders] = await db.select({ count: sql<number>`COUNT(*)::int` }).from(ordersTable);
  const [pendingOrders] = await db.select({ count: sql<number>`COUNT(*)::int` }).from(ordersTable).where(sql`status = 'pending'`);
  const [totalReviews] = await db.select({ count: sql<number>`COUNT(*)::int` }).from(reviewsTable);
  const [totalCategories] = await db.select({ count: sql<number>`COUNT(*)::int` }).from(categoriesTable);

  const stats = {
    totalProducts: totalProducts?.count ?? 0,
    totalOrders: totalOrders?.count ?? 0,
    totalReviews: totalReviews?.count ?? 0,
    pendingOrders: pendingOrders?.count ?? 0,
    totalCategories: totalCategories?.count ?? 0,
  };

  res.json(GetAdminStatsResponse.parse(stats));
});

export default router;
