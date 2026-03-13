import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, ordersTable, productsTable } from "@workspace/db";
import {
  GetOrdersResponse,
  CreateOrderBody,
  GetOrderParams,
  GetOrderResponse,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
  UpdateOrderStatusResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/orders", async (_req, res): Promise<void> => {
  const orders = await db
    .select({
      id: ordersTable.id,
      productId: ordersTable.productId,
      productName: productsTable.name,
      productPrice: productsTable.price,
      receiptId: ordersTable.receiptId,
      customerName: ordersTable.customerName,
      customerPhone: ordersTable.customerPhone,
      customerAddress: ordersTable.customerAddress,
      status: ordersTable.status,
      createdAt: ordersTable.createdAt,
    })
    .from(ordersTable)
    .leftJoin(productsTable, eq(ordersTable.productId, productsTable.id))
    .orderBy(ordersTable.createdAt);

  const mapped = orders.map((o) => ({
    ...o,
    productName: o.productName ?? "Unknown Product",
    productPrice: parseFloat(o.productPrice ?? "0"),
    createdAt: o.createdAt?.toISOString() ?? new Date().toISOString(),
  }));

  res.json(GetOrdersResponse.parse(mapped));
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, parsed.data.productId));

  if (!product) {
    res.status(400).json({ error: "Product not found" });
    return;
  }

  const [order] = await db
    .insert(ordersTable)
    .values({
      productId: parsed.data.productId,
      receiptId: parsed.data.receiptId,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      customerAddress: parsed.data.customerAddress,
      status: "pending",
    })
    .returning();

  const result = {
    ...order,
    productName: product.name,
    productPrice: parseFloat(product.price ?? "0"),
    createdAt: order.createdAt?.toISOString() ?? new Date().toISOString(),
  };

  res.status(201).json(GetOrderResponse.parse(result));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [order] = await db
    .select({
      id: ordersTable.id,
      productId: ordersTable.productId,
      productName: productsTable.name,
      productPrice: productsTable.price,
      receiptId: ordersTable.receiptId,
      customerName: ordersTable.customerName,
      customerPhone: ordersTable.customerPhone,
      customerAddress: ordersTable.customerAddress,
      status: ordersTable.status,
      createdAt: ordersTable.createdAt,
    })
    .from(ordersTable)
    .leftJoin(productsTable, eq(ordersTable.productId, productsTable.id))
    .where(eq(ordersTable.id, id));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const result = {
    ...order,
    productName: order.productName ?? "Unknown Product",
    productPrice: parseFloat(order.productPrice ?? "0"),
    createdAt: order.createdAt?.toISOString() ?? new Date().toISOString(),
  };

  res.json(GetOrderResponse.parse(result));
});

router.put("/orders/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(ordersTable)
    .set({ status: parsed.data.status })
    .where(eq(ordersTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, updated.productId));

  const result = {
    ...updated,
    productName: product?.name ?? "Unknown Product",
    productPrice: parseFloat(product?.price ?? "0"),
    createdAt: updated.createdAt?.toISOString() ?? new Date().toISOString(),
  };

  res.json(UpdateOrderStatusResponse.parse(result));
});

export default router;
