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

router.get("/admin/analytics", async (_req, res): Promise<void> => {
  const revenueResult = await db.execute(sql`
    SELECT COALESCE(SUM(p.price), 0)::float as total
    FROM orders o
    LEFT JOIN products p ON o.product_id = p.id
    WHERE o.status != 'cancelled'
  `);
  const totalRevenue = (revenueResult.rows[0] as any)?.total ?? 0;

  const ordersPerDay = await db.execute(sql`
    SELECT 
      TO_CHAR(o.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') as date,
      COUNT(*)::int as count,
      COALESCE(SUM(p.price), 0)::float as revenue
    FROM orders o
    LEFT JOIN products p ON o.product_id = p.id
    WHERE o.created_at >= NOW() - INTERVAL '7 days'
    GROUP BY TO_CHAR(o.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD')
    ORDER BY date ASC
  `);

  const topProducts = await db.execute(sql`
    SELECT 
      p.id as "productId",
      p.name as "productName",
      COUNT(o.id)::int as "orderCount",
      COALESCE(SUM(p.price), 0)::float as revenue
    FROM orders o
    LEFT JOIN products p ON o.product_id = p.id
    WHERE o.status != 'cancelled'
    GROUP BY p.id, p.name
    ORDER BY COUNT(o.id) DESC
    LIMIT 5
  `);

  const statusBreakdown = await db.execute(sql`
    SELECT status, COUNT(*)::int as count
    FROM orders
    GROUP BY status
  `);

  res.json({
    totalRevenue,
    ordersPerDay: ordersPerDay.rows,
    topProducts: topProducts.rows,
    statusBreakdown: statusBreakdown.rows,
  });
});

export default router;
