/**
 * POST /api/preview
 * Demo 专用：根据矿石主题，从数据库现有图片中随机匹配并返回卡片/勋章，无需调用 AI
 */
import { Router, type IRouter } from "express";
import { z } from "zod";
import {
  getOresByIds,
  getCardsByIds,
  getCardIdsByOreTypes,
  getBadgesByCardIds,
  listCardImagesFromStorage,
  listBadgeImagesFromStorage,
} from "../models/supabase.js";
import { fail, serverError } from "../utils/response.js";

const router: IRouter = Router();

const previewSchema = z.object({
  oreIds: z.array(z.number().int().positive()).min(1, "至少需要一个矿石 ID"),
  target: z.enum(["card", "badge", "both"]).default("both"),
  count: z.number().int().min(1).max(5).default(1),
});

function pickRandom<T>(arr: T[], count: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

router.post("/preview", async (req, res) => {
  const parsed = previewSchema.safeParse(req.body);
  if (!parsed.success) {
    fail(res, "参数错误：" + JSON.stringify(parsed.error.flatten().fieldErrors));
    return;
  }

  const { oreIds, target, count } = parsed.data;

  try {
    // ── Step 1: 识别矿石主题 type ──────────────────────────────────────────
    const ores = await getOresByIds(oreIds);
    if (ores.length === 0) {
      fail(res, "找不到有效的矿石，请检查矿石 ID");
      return;
    }

    const matchedTypes = [...new Set(ores.map((o) => o.type).filter(Boolean))];

    // ── Step 2: 并行拉取 Storage 文件列表 + 同主题 cardId 集合 ───────────
    const needCards = target !== "badge";
    const needBadges = target !== "card";

    const [allCardImages, allBadgeImages, typeCardIds] = await Promise.all([
      needCards ? listCardImagesFromStorage() : Promise.resolve([]),
      needBadges ? listBadgeImagesFromStorage() : Promise.resolve([]),
      getCardIdsByOreTypes(matchedTypes),
    ]);

    // ── Step 3: 卡片匹配 ───────────────────────────────────────────────────
    let cards: Array<{ cardId: number; name: string; supabaseImageUrl: string }> = [];

    if (needCards && allCardImages.length > 0) {
      const typeCardIdSet = new Set(typeCardIds);

      // 优先同主题；若数量不足则从全库补齐
      const exactMatches = allCardImages.filter((img) => typeCardIdSet.has(img.cardId));
      const pool = exactMatches.length >= count ? exactMatches : allCardImages;
      const picked = pickRandom(pool, count);

      // 查名称
      const cardRecords = await getCardsByIds(picked.map((p) => p.cardId));
      const nameMap = new Map(cardRecords.map((c) => [c.id, c.name]));

      cards = picked.map((img) => ({
        cardId: img.cardId,
        name: nameMap.get(img.cardId) ?? `卡片 #${img.cardId}`,
        supabaseImageUrl: img.publicUrl,
        exactMatch: typeCardIdSet.has(img.cardId),
      })) as typeof cards;
    }

    // ── Step 4: 勋章匹配 ───────────────────────────────────────────────────
    let badges: Array<{ badgeId: number; name: string; supabaseImageUrl: string }> = [];

    if (needBadges && allBadgeImages.length > 0) {
      const typeBadges = await getBadgesByCardIds(typeCardIds);
      const tokenIdMap = new Map(typeBadges.map((b) => [b.token_id, { id: b.id, name: b.name }]));

      const exactMatches = allBadgeImages.filter((img) => tokenIdMap.has(img.tokenId));
      const pool = exactMatches.length >= count ? exactMatches : allBadgeImages;
      const picked = pickRandom(pool, count);

      badges = picked.map((img) => {
        const info = tokenIdMap.get(img.tokenId);
        return {
          badgeId: info?.id ?? 0,
          name: info?.name ?? "勋章",
          supabaseImageUrl: img.publicUrl,
          exactMatch: tokenIdMap.has(img.tokenId),
        };
      }) as typeof badges;
    }

    res.json({
      matchedTypes,
      cards,
      badges,
    });
  } catch (err) {
    req.log.error({ err }, "Preview failed");
    serverError(res, "预览匹配失败，请重试");
  }
});

export default router;
