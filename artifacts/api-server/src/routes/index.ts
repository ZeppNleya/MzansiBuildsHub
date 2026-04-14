import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/projects", projectsRouter);
router.use("/stats", statsRouter);

export default router;
