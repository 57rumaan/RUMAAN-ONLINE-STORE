import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import ordersRouter from "./orders";
import reviewsRouter from "./reviews";
import adminRouter from "./admin";
import authRouter from "./auth";
import productMediaRouter from "./productMedia";

const router: IRouter = Router();

router.use(authRouter);
router.use(healthRouter);
router.use(productsRouter);
router.use(productMediaRouter);
router.use(categoriesRouter);
router.use(ordersRouter);
router.use(reviewsRouter);
router.use(adminRouter);

export default router;
