import { Router, type IRouter } from "express";
import { eq, and, gte, lte, like, sql } from "drizzle-orm";
import { db, productsTable, categoriesTable } from "@workspace/db";
import {
  GetProductsQueryParams,
  GetProductsResponse,
  CreateProductBody,
  GetProductParams,
  GetProductResponse,
  UpdateProductParams,
  UpdateProductBody,
  UpdateProductResponse,
  DeleteProductParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  const query = GetProductsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { categoryId, search, minPrice, maxPrice, featured } = query.data;

  const conditions = [];
  if (categoryId !== undefined) conditions.push(eq(productsTable.categoryId, categoryId));
  if (minPrice !== undefined) conditions.push(gte(productsTable.price, String(minPrice)));
  if (maxPrice !== undefined) conditions.push(lte(productsTable.price, String(maxPrice)));
  if (featured !== undefined) conditions.push(eq(productsTable.featured, featured));
  if (search) conditions.push(like(productsTable.name, `%${search}%`));

  const products = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      imageUrl: productsTable.imageUrl,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      featured: productsTable.featured,
      inStock: productsTable.inStock,
      whatsappNumber: productsTable.whatsappNumber,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(productsTable.createdAt);

  const mapped = products.map((p) => ({
    ...p,
    price: parseFloat(p.price ?? "0"),
    categoryName: p.categoryName ?? "",
    createdAt: p.createdAt?.toISOString() ?? new Date().toISOString(),
  }));

  res.json(GetProductsResponse.parse(mapped));
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const category = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, parsed.data.categoryId))
    .limit(1);

  if (!category[0]) {
    res.status(400).json({ error: "Category not found" });
    return;
  }

  const [product] = await db
    .insert(productsTable)
    .values({
      name: parsed.data.name,
      description: parsed.data.description,
      price: String(parsed.data.price),
      imageUrl: parsed.data.imageUrl,
      categoryId: parsed.data.categoryId,
      featured: parsed.data.featured ?? false,
      inStock: parsed.data.inStock ?? true,
      whatsappNumber: parsed.data.whatsappNumber,
    })
    .returning();

  const result = {
    ...product,
    price: parseFloat(product.price ?? "0"),
    categoryName: category[0].name,
    createdAt: product.createdAt?.toISOString() ?? new Date().toISOString(),
  };

  res.status(201).json(GetProductResponse.parse(result));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [product] = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      imageUrl: productsTable.imageUrl,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      featured: productsTable.featured,
      inStock: productsTable.inStock,
      whatsappNumber: productsTable.whatsappNumber,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const result = {
    ...product,
    price: parseFloat(product.price ?? "0"),
    categoryName: product.categoryName ?? "",
    createdAt: product.createdAt?.toISOString() ?? new Date().toISOString(),
  };

  res.json(GetProductResponse.parse(result));
});

router.put("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(productsTable)
    .set({
      name: parsed.data.name,
      description: parsed.data.description,
      price: String(parsed.data.price),
      imageUrl: parsed.data.imageUrl,
      categoryId: parsed.data.categoryId,
      featured: parsed.data.featured ?? false,
      inStock: parsed.data.inStock ?? true,
      whatsappNumber: parsed.data.whatsappNumber,
    })
    .where(eq(productsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const [category] = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, updated.categoryId));

  const result = {
    ...updated,
    price: parseFloat(updated.price ?? "0"),
    categoryName: category?.name ?? "",
    createdAt: updated.createdAt?.toISOString() ?? new Date().toISOString(),
  };

  res.json(UpdateProductResponse.parse(result));
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
