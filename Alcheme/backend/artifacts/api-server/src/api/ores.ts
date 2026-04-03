import { Router, type IRouter } from "express";
import { z } from "zod";
import { getAllOres, insertOre, deleteOre, formatOre } from "../models/supabase.js";
import { fail, serverError } from "../utils/response.js";

const router: IRouter = Router();

const mineSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "内容不能为空"),
  type: z.enum(["text", "link", "image", "note", "idea", "insight", "question", "resource"]).default("text"),
  tags: z.array(z.string()).default([]),
});

router.get("/ores", async (req, res) => {
  try {
    const ores = await getAllOres();
    res.json({ data: ores.map(formatOre) });
  } catch (err) {
    req.log.error({ err }, "Failed to get ores");
    serverError(res);
  }
});

router.post("/mine", async (req, res) => {
  const parsed = mineSchema.safeParse(req.body);
  if (!parsed.success) {
    fail(res, "参数错误：" + JSON.stringify(parsed.error.flatten().fieldErrors));
    return;
  }

  try {
    const { content, type, tags } = parsed.data;
    const title = parsed.data.title?.trim() || content.slice(0, 30).replace(/\n/g, " ");
    const ore = await insertOre({ title, content, type, tags });
    res.status(201).json(formatOre(ore));
  } catch (err) {
    req.log.error({ err }, "Failed to create ore");
    serverError(res, "矿石采集失败，请重试");
  }
});

router.delete("/ores/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    fail(res, "无效的矿石 ID");
    return;
  }

  try {
    await deleteOre(id);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete ore");
    serverError(res, "矿石删除失败，请重试");
  }
});

export default router;
