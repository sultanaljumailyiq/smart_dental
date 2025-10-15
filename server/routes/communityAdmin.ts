import { Router } from "express";
import { db } from "../storage";
import {
  communityModerators,
  communityEvents,
  communityTrustedSources,
  community3DModels,
  communityEducationalContent,
} from "../../shared/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// =============== Validation Schemas ===============
const moderatorSchema = z.object({
  userId: z.number().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  province: z.string().min(1),
  role: z.enum(["moderator", "elite"]),
  specialties: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
});

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["internal", "external"]),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  location: z.string().optional(),
  externalLink: z.string().url().optional(),
  coverImage: z.string().url().optional(),
  organizer: z.string().optional(),
  maxAttendees: z.number().optional(),
  isActive: z.boolean().optional().default(true),
});

const trustedSourceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  url: z.string().url(),
  logo: z.string().url().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

const model3DSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  sketchfabUrl: z.string().url(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
});

const educationalContentSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  authorId: z.number(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().url().optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional().default("pending"),
});

// =============== Community Stats ===============
router.get("/stats", async (req, res) => {
  try {
    // This would be calculated from actual data
    const stats = {
      totalMembers: 2847,
      activePosts: 1234,
      totalModerators: 24,
      totalEvents: 18,
      totalEducationalContent: 156,
      totalEngagement: 45623,
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// =============== Moderators/Elite Management ===============
router.get("/moderators", async (req, res) => {
  try {
    const moderators = await db.select().from(communityModerators).orderBy(desc(communityModerators.createdAt));
    res.json(moderators);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch moderators" });
  }
});

router.get("/moderators/:id", async (req, res) => {
  try {
    const [moderator] = await db
      .select()
      .from(communityModerators)
      .where(eq(communityModerators.id, parseInt(req.params.id)));
    
    if (!moderator) {
      return res.status(404).json({ error: "Moderator not found" });
    }
    
    res.json(moderator);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch moderator" });
  }
});

router.post("/moderators", async (req, res) => {
  try {
    const validatedData = moderatorSchema.parse(req.body);
    const [newModerator] = await db.insert(communityModerators).values(validatedData).returning();
    res.status(201).json(newModerator);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create moderator" });
  }
});

router.put("/moderators/:id", async (req, res) => {
  try {
    const validatedData = moderatorSchema.partial().parse(req.body);
    const [updated] = await db
      .update(communityModerators)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(communityModerators.id, parseInt(req.params.id)))
      .returning();
    
    if (!updated) {
      return res.status(404).json({ error: "Moderator not found" });
    }
    
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update moderator" });
  }
});

router.delete("/moderators/:id", async (req, res) => {
  try {
    await db.delete(communityModerators).where(eq(communityModerators.id, parseInt(req.params.id)));
    res.json({ message: "Moderator deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete moderator" });
  }
});

// =============== Events/Webinars Management ===============
router.get("/events", async (req, res) => {
  try {
    const events = await db.select().from(communityEvents).orderBy(desc(communityEvents.startDate));
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

router.get("/events/:id", async (req, res) => {
  try {
    const [event] = await db
      .select()
      .from(communityEvents)
      .where(eq(communityEvents.id, parseInt(req.params.id)));
    
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

router.post("/events", async (req, res) => {
  try {
    const validatedData = eventSchema.parse(req.body);
    const [newEvent] = await db.insert(communityEvents).values(validatedData).returning();
    res.status(201).json(newEvent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create event" });
  }
});

router.put("/events/:id", async (req, res) => {
  try {
    const validatedData = eventSchema.partial().parse(req.body);
    const [updated] = await db
      .update(communityEvents)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(communityEvents.id, parseInt(req.params.id)))
      .returning();
    
    if (!updated) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update event" });
  }
});

router.delete("/events/:id", async (req, res) => {
  try {
    await db.delete(communityEvents).where(eq(communityEvents.id, parseInt(req.params.id)));
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// =============== Trusted Sources Management ===============
router.get("/trusted-sources", async (req, res) => {
  try {
    const sources = await db.select().from(communityTrustedSources).orderBy(desc(communityTrustedSources.createdAt));
    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sources" });
  }
});

router.post("/trusted-sources", async (req, res) => {
  try {
    const validatedData = trustedSourceSchema.parse(req.body);
    const [newSource] = await db.insert(communityTrustedSources).values(validatedData).returning();
    res.status(201).json(newSource);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create source" });
  }
});

router.put("/trusted-sources/:id", async (req, res) => {
  try {
    const validatedData = trustedSourceSchema.partial().parse(req.body);
    const [updated] = await db
      .update(communityTrustedSources)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(communityTrustedSources.id, parseInt(req.params.id)))
      .returning();
    
    if (!updated) {
      return res.status(404).json({ error: "Source not found" });
    }
    
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update source" });
  }
});

router.delete("/trusted-sources/:id", async (req, res) => {
  try {
    await db.delete(communityTrustedSources).where(eq(communityTrustedSources.id, parseInt(req.params.id)));
    res.json({ message: "Source deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete source" });
  }
});

// Track source click
router.post("/trusted-sources/:id/click", async (req, res) => {
  try {
    const [source] = await db.select().from(communityTrustedSources).where(eq(communityTrustedSources.id, parseInt(req.params.id)));
    
    if (source) {
      await db
        .update(communityTrustedSources)
        .set({ clickCount: (source.clickCount || 0) + 1 })
        .where(eq(communityTrustedSources.id, parseInt(req.params.id)));
    }
    
    res.json({ message: "Click tracked" });
  } catch (error) {
    res.status(500).json({ error: "Failed to track click" });
  }
});

// =============== 3D Models Management ===============
router.get("/3d-models", async (req, res) => {
  try {
    const models = await db.select().from(community3DModels).orderBy(desc(community3DModels.createdAt));
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch 3D models" });
  }
});

router.post("/3d-models", async (req, res) => {
  try {
    const validatedData = model3DSchema.parse(req.body);
    const [newModel] = await db.insert(community3DModels).values(validatedData).returning();
    res.status(201).json(newModel);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create 3D model" });
  }
});

router.put("/3d-models/:id", async (req, res) => {
  try {
    const validatedData = model3DSchema.partial().parse(req.body);
    const [updated] = await db
      .update(community3DModels)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(community3DModels.id, parseInt(req.params.id)))
      .returning();
    
    if (!updated) {
      return res.status(404).json({ error: "3D model not found" });
    }
    
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update 3D model" });
  }
});

router.delete("/3d-models/:id", async (req, res) => {
  try {
    await db.delete(community3DModels).where(eq(community3DModels.id, parseInt(req.params.id)));
    res.json({ message: "3D model deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete 3D model" });
  }
});

// Track 3D model view
router.post("/3d-models/:id/view", async (req, res) => {
  try {
    const [model] = await db.select().from(community3DModels).where(eq(community3DModels.id, parseInt(req.params.id)));
    
    if (model) {
      await db
        .update(community3DModels)
        .set({ viewCount: (model.viewCount || 0) + 1 })
        .where(eq(community3DModels.id, parseInt(req.params.id)));
    }
    
    res.json({ message: "View tracked" });
  } catch (error) {
    res.status(500).json({ error: "Failed to track view" });
  }
});

// =============== Educational Content Management ===============
router.get("/educational-content", async (req, res) => {
  try {
    const { status } = req.query;
    let query = db.select().from(communityEducationalContent);
    
    if (status) {
      query = query.where(eq(communityEducationalContent.status, status as string)) as any;
    }
    
    const content = await query.orderBy(desc(communityEducationalContent.createdAt));
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch educational content" });
  }
});

router.get("/educational-content/:id", async (req, res) => {
  try {
    const [content] = await db
      .select()
      .from(communityEducationalContent)
      .where(eq(communityEducationalContent.id, parseInt(req.params.id)));
    
    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

router.post("/educational-content", async (req, res) => {
  try {
    const validatedData = educationalContentSchema.parse(req.body);
    const [newContent] = await db.insert(communityEducationalContent).values(validatedData).returning();
    res.status(201).json(newContent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create content" });
  }
});

router.put("/educational-content/:id", async (req, res) => {
  try {
    const validatedData = educationalContentSchema.partial().parse(req.body);
    const [updated] = await db
      .update(communityEducationalContent)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(communityEducationalContent.id, parseInt(req.params.id)))
      .returning();
    
    if (!updated) {
      return res.status(404).json({ error: "Content not found" });
    }
    
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update content" });
  }
});

router.delete("/educational-content/:id", async (req, res) => {
  try {
    await db.delete(communityEducationalContent).where(eq(communityEducationalContent.id, parseInt(req.params.id)));
    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete content" });
  }
});

// Approve/Reject educational content
router.post("/educational-content/:id/approve", async (req, res) => {
  try {
    const { approvedBy } = req.body;
    
    const [updated] = await db
      .update(communityEducationalContent)
      .set({
        status: "approved",
        isApproved: true,
        approvedBy,
        approvedAt: new Date(),
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(communityEducationalContent.id, parseInt(req.params.id)))
      .returning();
    
    if (!updated) {
      return res.status(404).json({ error: "Content not found" });
    }
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to approve content" });
  }
});

router.post("/educational-content/:id/reject", async (req, res) => {
  try {
    const { approvedBy, rejectionReason } = req.body;
    
    const [updated] = await db
      .update(communityEducationalContent)
      .set({
        status: "rejected",
        isApproved: false,
        approvedBy,
        rejectionReason,
        approvedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(communityEducationalContent.id, parseInt(req.params.id)))
      .returning();
    
    if (!updated) {
      return res.status(404).json({ error: "Content not found" });
    }
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to reject content" });
  }
});

export default router;
