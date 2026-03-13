import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, categoriesTable, productsTable } from "@workspace/db";
import {
  GetCategoriesResponse,
  CreateCategoryBody,
  UpdateCategoryParams,
  UpdateCategoryBody,
  UpdateCategoryResponse,
  DeleteCategoryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const categories = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      imageUrl: categoriesTable.imageUrl,
      allowOnlinePurchase: categoriesTable.allowOnlinePurchase,
      showPrices: categoriesTable.showPrices,
      productCount: sql<number>`COUNT(${productsTable.id})::int`,
    })
    .from(categoriesTable)
    .leftJoin(productsTable, eq(categoriesTable.id, productsTable.categoryId))
    .groupBy(categoriesTable.id)
    .orderBy(categoriesTable.id);

  res.json(GetCategoriesResponse.parse(categories));
});

router.post("/categories", async (req, res): Promise<void> => {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [category] = await db
    .insert(categoriesTable)
    .values({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      imageUrl: parsed.data.imageUrl,
      allowOnlinePurchase: parsed.data.allowOnlinePurchase ?? false,
      showPrices: parsed.data.showPrices ?? true,
    })
    .returning();

  const result = { ...category, productCount: 0 };

  res.status(201).json(result);
});

router.put("/categories/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = UpdateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(categoriesTable)
    .set({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      imageUrl: parsed.data.imageUrl,
      allowOnlinePurchase: parsed.data.allowOnlinePurchase ?? false,
      showPrices: parsed.data.showPrices ?? true,
    })
    .where(eq(categoriesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  const result = { ...updated, productCount: 0 };
  res.json(UpdateCategoryResponse.parse(result));
});

router.delete("/categories/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .delete(categoriesTable)
    .where(eq(categoriesTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
