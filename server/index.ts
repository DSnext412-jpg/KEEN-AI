import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { eq, sql, desc } from "drizzle-orm";
import { getDb, conversations, messages, userProfiles } from "./db.js";
import { getGemini } from "./gemini.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "..", "dist");

const app = express();
app.use(cors());
app.use(express.json());

const rawPort = process.env.PORT;
if (!rawPort) throw new Error("PORT environment variable is required");
const port = Number(rawPort);

// Health
app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

// Conversations
app.get("/api/gemini/conversations", async (_req, res) => {
  try {
    const result = await getDb().select().from(conversations).orderBy(desc(conversations.createdAt));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post("/api/gemini/conversations", async (req, res) => {
  try {
    const { title } = req.body;
    const [result] = await getDb().insert(conversations).values({ title }).returning();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get("/api/gemini/conversations/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [conv] = await getDb().select().from(conversations).where(eq(conversations.id, id));
    if (!conv) return res.status(404).json({ error: "Conversation not found" });
    const msgs = await getDb().select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
    res.json({ ...conv, messages: msgs });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.delete("/api/gemini/conversations/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await getDb().delete(conversations).where(eq(conversations.id, id));
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Messages
app.get("/api/gemini/conversations/:id/messages", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const msgs = await getDb().select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post("/api/gemini/conversations/:id/messages", async (req, res) => {
  try {
    const conversationId = Number(req.params.id);
    const { content } = req.body;

    const [conv] = await getDb().select().from(conversations).where(eq(conversations.id, conversationId));
    if (!conv) return res.status(404).json({ error: "Conversation not found" });

    await getDb().insert(messages).values({ conversationId, role: "user", content });

    const history = await getDb().select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);

    if (history.length === 1) {
      const title = content.length > 50 ? content.slice(0, 50) + "..." : content;
      await getDb().update(conversations).set({ title }).where(eq(conversations.id, conversationId));
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const ai = getGemini();
    let fullResponse = "";
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: history.map((m) => ({
        role: m.role === "assistant" ? "model" as const : "user" as const,
        parts: [{ text: m.content }],
      })),
      config: { systemInstruction: "You are KEEN AI, an intelligent assistant. Be concise, helpful, and thoughtful." },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      }
    }

    await getDb().insert(messages).values({ conversationId, role: "assistant", content: fullResponse });
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: String(err) })}\n\n`);
    res.end();
  }
});

// User routes
app.get("/api/user/profile", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") return res.status(400).json({ error: "userId is required" });
    const [profile] = await getDb().select().from(userProfiles).where(eq(userProfiles.userId, userId));
    res.json(profile || null);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.put("/api/user/profile", async (req, res) => {
  try {
    const { userId, displayName, avatarUrl, bio, theme } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const [profile] = await getDb().insert(userProfiles).values({
      userId, displayName, avatarUrl, bio, theme: theme || "system",
    }).onConflictDoUpdate({
      target: userProfiles.userId,
      set: { displayName, avatarUrl, bio, theme: theme || "system", updatedAt: sql`now()` },
    }).returning();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get("/api/user/stats", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") return res.status(400).json({ error: "userId is required" });
    const [convCount] = await getDb().select({ count: sql<number>`count(*)` }).from(conversations);
    const [msgCount] = await getDb().select({ count: sql<number>`count(*)` }).from(messages);
    res.json({ totalConversations: Number(convCount?.count || 0), totalMessages: Number(msgCount?.count || 0) });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));

  // SPA fallback
  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
