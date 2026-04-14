import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable, commentsTable, milestonesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

// GET /api/stats/summary — platform-wide stats
router.get("/summary", async (req, res) => {
  try {
    const [totalProjects] = await db.select({ count: sql<number>`count(*)` }).from(projectsTable);
    const [completedProjects] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectsTable)
      .where(eq(projectsTable.stage, "Completed"));
    const [totalComments] = await db.select({ count: sql<number>`count(*)` }).from(commentsTable);
    const [totalMilestones] = await db.select({ count: sql<number>`count(*)` }).from(milestonesTable);

    res.json({
      totalProjects: Number(totalProjects?.count ?? 0),
      completedProjects: Number(completedProjects?.count ?? 0),
      totalComments: Number(totalComments?.count ?? 0),
      totalMilestones: Number(totalMilestones?.count ?? 0),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/stats/stages — project count by stage
router.get("/stages", async (req, res) => {
  try {
    const stages = ["Planning", "Building", "Review", "Completed"];
    const result = await Promise.all(
      stages.map(async (stage) => {
        const [row] = await db
          .select({ count: sql<number>`count(*)` })
          .from(projectsTable)
          .where(eq(projectsTable.stage, stage));
        return { stage, count: Number(row?.count ?? 0) };
      })
    );
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to get stage breakdown");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
