import { Router, type IRouter } from "express";
import healthRouter from "./health";
import conversationsRouter from "./gemini/conversations";
import messagesRouter from "./gemini/messages";
import userRouter from "./user/index";

const router: IRouter = Router();

router.use(healthRouter);

// Gemini routes
router.use("/gemini/conversations", conversationsRouter);
router.use("/gemini/conversations/:id/messages", messagesRouter);

// User routes
router.use("/user", userRouter);

export default router;
