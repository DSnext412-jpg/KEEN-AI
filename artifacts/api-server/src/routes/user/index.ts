import { Router } from "express";
import { db } from "@workspace/db";
import { userProfilesTable, conversations, messages } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { UpsertUserProfileBody, GetUserProfileQueryParams, GetUserStatsQueryParams } from "@workspace/api-zod";

const router = Router();

// GET /user/profile?userId=...
router.get("/profile", async (req, res) => {
  const params = GetUserProfileQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "userId is required" });
    return;
  }
  try {
    const [profile] = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.userId, params.data.userId));
    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    res.json({
      id: profile.id,
      userId: profile.userId,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      theme: profile.theme,
      createdAt: profile.createdAt,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get profile" });
  }
});

// PUT /user/profile
router.put("/profile", async (req, res) => {
  const parsed = UpsertUserProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [profile] = await db
      .insert(userProfilesTable)
      .values({
        userId: parsed.data.userId,
        displayName: parsed.data.displayName ?? null,
        avatarUrl: parsed.data.avatarUrl ?? null,
        bio: parsed.data.bio ?? null,
        theme: parsed.data.theme ?? "system",
      })
      .onConflictDoUpdate({
        target: userProfilesTable.userId,
        set: {
          displayName: parsed.data.displayName ?? null,
          avatarUrl: parsed.data.avatarUrl ?? null,
          bio: parsed.data.bio ?? null,
          theme: parsed.data.theme ?? "system",
          updatedAt: new Date(),
        },
      })
      .returning();
    res.json({
      id: profile.id,
      userId: profile.userId,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      theme: profile.theme,
      createdAt: profile.createdAt,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to upsert profile" });
  }
});

// GET /user/stats?userId=...
router.get("/stats", async (req, res) => {
  const params = GetUserStatsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "userId is required" });
    return;
  }
  try {
    const [convCount] = await db.select({ count: count() }).from(conversations);
    const [msgCount] = await db.select({ count: count() }).from(messages);
    res.json({
      totalConversations: Number(convCount?.count ?? 0),
      totalMessages: Number(msgCount?.count ?? 0),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get stats" });
  }
});

export default router;
