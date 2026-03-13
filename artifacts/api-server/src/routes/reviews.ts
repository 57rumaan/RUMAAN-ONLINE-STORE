import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, reviewsTable, productsTable } from "@workspace/db";
import {
  GetReviewsQueryParams,
  GetReviewsResponse,
  CreateReviewBody,
  DeleteReviewParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reviews", async (req, res): Promise<void> => {
  const query = GetReviewsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const baseQuery = db
    .select({
      id: reviewsTable.id,
      productId: reviewsTable.productId,
      productName: productsTable.name,
      reviewerName: reviewsTable.reviewerName,
      rating: reviewsTable.rating,
      comment: reviewsTable.comment,
      imageUrls: reviewsTable.imageUrls,
      createdAt: reviewsTable.createdAt,
    })
    .from(reviewsTable)
    .leftJoin(productsTable, eq(reviewsTable.productId, productsTable.id));

  const reviews = query.data.productId
    ? await baseQuery.where(eq(reviewsTable.productId, query.data.productId))
    : await baseQuery;

  const mapped = reviews.map((r) => ({
    ...r,
    productName: r.productName ?? "Unknown Product",
    imageUrls: r.imageUrls ?? [],
    createdAt: r.createdAt?.toISOString() ?? new Date().toISOString(),
  }));

  res.json(GetReviewsResponse.parse(mapped));
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
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

  const [review] = await db
    .insert(reviewsTable)
    .values({
      productId: parsed.data.productId,
      reviewerName: parsed.data.reviewerName,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      imageUrls: parsed.data.imageUrls ?? [],
    })
    .returning();

  const result = {
    ...review,
    productName: product.name,
    imageUrls: review.imageUrls ?? [],
    createdAt: review.createdAt?.toISOString() ?? new Date().toISOString(),
  };

  res.status(201).json(result);
});

router.delete("/reviews/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .delete(reviewsTable)
    .where(eq(reviewsTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Review not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
