import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, productMediaTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/products/:id/media", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const media = await db
    .select()
    .from(productMediaTable)
    .where(eq(productMediaTable.productId, id))
    .orderBy(asc(productMediaTable.sortOrder));
  res.json(media);
});

router.post("/products/:id/media", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { url, type = "image", sortOrder = 0 } = req.body;
  if (!url) { res.status(400).json({ error: "url is required" }); return; }
  const [item] = await db.insert(productMediaTable).values({ productId: id, url, type, sortOrder }).returning();
  res.status(201).json(item);
});

router.delete("/products/:id/media/:mediaId", async (req, res): Promise<void> => {
  const mediaId = parseInt(req.params.mediaId as string, 10);
  if (isNaN(mediaId)) { res.status(400).json({ error: "Invalid mediaId" }); return; }
  await db.delete(productMediaTable).where(eq(productMediaTable.id, mediaId));
  res.sendStatus(204);
});

export default router;
