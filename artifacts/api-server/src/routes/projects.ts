import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { projectsTable, commentsTable, milestonesTable } from "@workspace/db";
import { eq, sql, and } from "drizzle-orm";
import {
  ListProjectsQueryParams,
  CreateProjectBody,
  GetProjectParams,
  AddMilestoneParams,
  AddMilestoneBody,
  AddCommentParams,
  AddCommentBody,
} from "@workspace/api-zod";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = userId;
  next();
};

function formatProject(project: any, commentCount: number, milestoneCount: number) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    stage: project.stage,
    supportNeeded: project.supportNeeded,
    ownerClerkId: project.ownerClerkId,
    ownerName: project.ownerName,
    createdAt: project.createdAt,
    commentCount,
    milestoneCount,
  };
}

// GET /api/projects — list all projects (public feed)
router.get("/", async (req, res) => {
  try {
    const parseResult = ListProjectsQueryParams.safeParse(req.query);
    const params = parseResult.success ? parseResult.data : {};

    let query = db.select().from(projectsTable);
    const conditions = [];

    if (params.stage) {
      conditions.push(eq(projectsTable.stage, params.stage));
    }

    const projects = conditions.length > 0
      ? await db.select().from(projectsTable).where(and(...conditions)).orderBy(sql`${projectsTable.createdAt} DESC`)
      : await db.select().from(projectsTable).orderBy(sql`${projectsTable.createdAt} DESC`);

    const result = await Promise.all(
      projects.map(async (project) => {
        const [commentResult] = await db
          .select({ count: sql<number>`count(*)` })
          .from(commentsTable)
          .where(eq(commentsTable.projectId, project.id));
        const [milestoneResult] = await db
          .select({ count: sql<number>`count(*)` })
          .from(milestonesTable)
          .where(eq(milestonesTable.projectId, project.id));
        return formatProject(project, Number(commentResult?.count ?? 0), Number(milestoneResult?.count ?? 0));
      })
    );

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to list projects");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/projects/my — current user's projects (auth required)
router.get("/my", requireAuth, async (req: any, res) => {
  try {
    const projects = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.ownerClerkId, req.userId))
      .orderBy(sql`${projectsTable.createdAt} DESC`);

    const result = await Promise.all(
      projects.map(async (project) => {
        const [commentResult] = await db
          .select({ count: sql<number>`count(*)` })
          .from(commentsTable)
          .where(eq(commentsTable.projectId, project.id));
        const [milestoneResult] = await db
          .select({ count: sql<number>`count(*)` })
          .from(milestonesTable)
          .where(eq(milestonesTable.projectId, project.id));
        return formatProject(project, Number(commentResult?.count ?? 0), Number(milestoneResult?.count ?? 0));
      })
    );

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to list my projects");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/projects/completed — completed projects (celebration wall)
router.get("/completed", async (req, res) => {
  try {
    const projects = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.stage, "Completed"))
      .orderBy(sql`${projectsTable.createdAt} DESC`);

    const result = await Promise.all(
      projects.map(async (project) => {
        const [commentResult] = await db
          .select({ count: sql<number>`count(*)` })
          .from(commentsTable)
          .where(eq(commentsTable.projectId, project.id));
        const [milestoneResult] = await db
          .select({ count: sql<number>`count(*)` })
          .from(milestonesTable)
          .where(eq(milestonesTable.projectId, project.id));
        return formatProject(project, Number(commentResult?.count ?? 0), Number(milestoneResult?.count ?? 0));
      })
    );

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to list completed projects");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/projects — create project
router.post("/", requireAuth, async (req: any, res) => {
  try {
    const parseResult = CreateProjectBody.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: "Invalid request body", details: parseResult.error });
    }

    const { title, description, stage, supportNeeded, ownerName } = parseResult.data;

    const [project] = await db
      .insert(projectsTable)
      .values({
        title,
        description,
        stage,
        supportNeeded,
        ownerClerkId: req.userId,
        ownerName,
      })
      .returning();

    res.status(201).json(formatProject(project, 0, 0));
  } catch (err) {
    req.log.error({ err }, "Failed to create project");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/projects/:id — get single project with comments + milestones
router.get("/:id", async (req, res) => {
  try {
    const parseResult = GetProjectParams.safeParse({ id: Number(req.params.id) });
    if (!parseResult.success) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const { id } = parseResult.data;

    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const comments = await db
      .select()
      .from(commentsTable)
      .where(eq(commentsTable.projectId, id))
      .orderBy(sql`${commentsTable.createdAt} ASC`);

    const milestones = await db
      .select()
      .from(milestonesTable)
      .where(eq(milestonesTable.projectId, id))
      .orderBy(sql`${milestonesTable.createdAt} ASC`);

    res.json({
      ...formatProject(project, comments.length, milestones.length),
      comments: comments.map((c) => ({
        id: c.id,
        projectId: c.projectId,
        authorClerkId: c.authorClerkId,
        authorName: c.authorName,
        content: c.content,
        createdAt: c.createdAt,
      })),
      milestones: milestones.map((m) => ({
        id: m.id,
        projectId: m.projectId,
        description: m.description,
        createdAt: m.createdAt,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get project");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/projects/:id/milestones — add milestone (owner only)
router.post("/:id/milestones", requireAuth, async (req: any, res) => {
  try {
    const paramsResult = AddMilestoneParams.safeParse({ id: Number(req.params.id) });
    if (!paramsResult.success) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const bodyResult = AddMilestoneBody.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const { id } = paramsResult.data;
    const { description } = bodyResult.data;

    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.ownerClerkId !== req.userId) {
      return res.status(403).json({ error: "Forbidden — only the project owner can add milestones" });
    }

    const [milestone] = await db
      .insert(milestonesTable)
      .values({ projectId: id, description })
      .returning();

    res.status(201).json({
      id: milestone.id,
      projectId: milestone.projectId,
      description: milestone.description,
      createdAt: milestone.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to add milestone");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/projects/:id/comments — add comment
router.post("/:id/comments", requireAuth, async (req: any, res) => {
  try {
    const paramsResult = AddCommentParams.safeParse({ id: Number(req.params.id) });
    if (!paramsResult.success) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const bodyResult = AddCommentBody.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const { id } = paramsResult.data;
    const { content, authorName } = bodyResult.data;

    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const [comment] = await db
      .insert(commentsTable)
      .values({ projectId: id, authorClerkId: req.userId, authorName, content })
      .returning();

    res.status(201).json({
      id: comment.id,
      projectId: comment.projectId,
      authorClerkId: comment.authorClerkId,
      authorName: comment.authorName,
      content: comment.content,
      createdAt: comment.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to add comment");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
