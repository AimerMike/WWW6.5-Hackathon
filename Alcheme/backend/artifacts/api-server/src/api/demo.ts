/**
 * Demo 模式开关端点
 * GET  /api/demo/status  → 查询当前 demo 模式状态
 * POST /api/demo/on      → 开启 demo 模式（smelt/forge 走预览逻辑）
 * POST /api/demo/off     → 关闭 demo 模式（smelt/forge 恢复 AI 生图）
 */
import { Router, type IRouter } from "express";
import { isDemoMode, setDemoMode } from "../lib/demoMode.js";

const router: IRouter = Router();

router.get("/demo/status", (_req, res) => {
  res.json({ demo: isDemoMode() });
});

router.post("/demo/on", (_req, res) => {
  setDemoMode(true);
  res.json({ demo: true, message: "Demo 模式已开启，smelt/forge 将使用现有图片预览" });
});

router.post("/demo/off", (_req, res) => {
  setDemoMode(false);
  res.json({ demo: false, message: "Demo 模式已关闭，smelt/forge 恢复 AI 生图" });
});

export default router;
