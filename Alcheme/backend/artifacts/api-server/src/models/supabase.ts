/**
 * 数据层：Supabase 客户端初始化、类型定义、数据库查询、Storage 操作
 * 统一管理所有与 Supabase 相关的交互
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─── 客户端单例 ───────────────────────────────────────────────────────────────

let _client: SupabaseClient | null = null;

export function getDb(): SupabaseClient {
  if (_client) return _client;
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) throw new Error("SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY 未配置");
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

// ─── 类型定义 ─────────────────────────────────────────────────────────────────

export interface Ore {
  id: number;
  title: string;
  content: string;
  type: string;
  tags: string[];
  created_at: string;
}

export interface Card {
  id: number;
  name: string;
  description: string;
  rarity: string;
  created_at: string;
}

export interface CardOre {
  id: number;
  card_id: number;
  ore_id: number;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  token_id: string;
  wallet_address: string | null;
  on_chain_token_id: string | null;
  tx_hash: string | null;
  ipfs_metadata_url: string | null;
  created_at: string;
}

export interface BadgeCard {
  id: number;
  badge_id: number;
  card_id: number;
}

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

function assertNoError<T>(data: T | null, error: unknown, msg: string): T {
  if (error) throw new Error(`${msg}: ${(error as { message: string }).message}`);
  if (data === null) throw new Error(`${msg}: 未返回数据`);
  return data;
}

// ─── Ores（矿石）─────────────────────────────────────────────────────────────

export async function getAllOres(): Promise<Ore[]> {
  const db = getDb();
  const { data, error } = await db.from("ores").select("*").order("created_at", { ascending: false });
  return assertNoError(data, error, "获取矿石列表失败");
}

export async function getOresByIds(ids: number[]): Promise<Ore[]> {
  if (ids.length === 0) return [];
  const db = getDb();
  const { data, error } = await db.from("ores").select("*").in("id", ids);
  return assertNoError(data, error, "获取矿石失败");
}

export async function insertOre(values: {
  title: string;
  content: string;
  type: string;
  tags: string[];
}): Promise<Ore> {
  const db = getDb();
  const { data, error } = await db.from("ores").insert(values).select().single();
  return assertNoError(data, error, "创建矿石失败");
}

export async function deleteOre(id: number): Promise<void> {
  const db = getDb();
  const { error } = await db.from("ores").delete().eq("id", id);
  if (error) throw new Error(`删除矿石失败: ${error.message}`);
}

// ─── Cards（卡片）────────────────────────────────────────────────────────────

export async function getAllCards(): Promise<Card[]> {
  const db = getDb();
  const { data, error } = await db.from("cards").select("*").order("created_at", { ascending: false });
  return assertNoError(data, error, "获取卡片列表失败");
}

export async function getCardsByIds(ids: number[]): Promise<Card[]> {
  if (ids.length === 0) return [];
  const db = getDb();
  const { data, error } = await db.from("cards").select("*").in("id", ids);
  return assertNoError(data, error, "获取卡片失败");
}

export async function insertCard(values: {
  name: string;
  description: string;
  rarity: string;
}): Promise<Card> {
  const db = getDb();
  const { data, error } = await db.from("cards").insert(values).select().single();
  return assertNoError(data, error, "创建卡片失败");
}

// ─── CardOres（卡片-矿石关联）────────────────────────────────────────────────

export async function getAllCardOres(): Promise<CardOre[]> {
  const db = getDb();
  const { data, error } = await db.from("card_ores").select("*");
  return assertNoError(data, error, "获取卡片矿石关联失败");
}

export async function getCardOresByCardIds(cardIds: number[]): Promise<CardOre[]> {
  if (cardIds.length === 0) return [];
  const db = getDb();
  const { data, error } = await db.from("card_ores").select("*").in("card_id", cardIds);
  return assertNoError(data, error, "获取卡片矿石关联失败");
}

export async function insertCardOres(rows: { card_id: number; ore_id: number }[]): Promise<void> {
  if (rows.length === 0) return;
  const db = getDb();
  const { error } = await db.from("card_ores").insert(rows);
  if (error) throw new Error(`创建卡片矿石关联失败: ${error.message}`);
}

// ─── Badges（勋章）───────────────────────────────────────────────────────────

export async function getAllBadges(): Promise<Badge[]> {
  const db = getDb();
  const { data, error } = await db.from("badges").select("*").order("created_at", { ascending: false });
  return assertNoError(data, error, "获取勋章列表失败");
}

export async function getAllBadgesWithCards(): Promise<Array<{ badge: Badge; cards: Card[]; ores: Ore[] }>> {
  const db = getDb();
  const badges = await getAllBadges();
  const result: Array<{ badge: Badge; cards: Card[]; ores: Ore[] }> = [];

  for (const badge of badges) {
    const badgeCards = await getBadgeCardsByBadgeId(badge.id);
    const cardIds = badgeCards.map((bc) => bc.card_id);
    if (cardIds.length === 0) {
      result.push({ badge, cards: [], ores: [] });
      continue;
    }
    const cards = await getCardsByIds(cardIds);
    const cardOres = await getCardOresByCardIds(cardIds);
    const oreIds = [...new Set(cardOres.map((co) => co.ore_id))];
    const ores = oreIds.length > 0 ? await getOresByIds(oreIds) : [];
    result.push({ badge, cards, ores });
  }

  return result;
}

export async function getBadgeById(id: number): Promise<Badge | null> {
  const db = getDb();
  const { data, error } = await db.from("badges").select("*").eq("id", id).single();
  if ((error as { code?: string } | null)?.code === "PGRST116") return null;
  if (error) throw new Error(`获取勋章失败: ${(error as { message: string }).message}`);
  return data;
}

export async function insertBadge(values: {
  name: string;
  description: string;
  token_id: string;
  wallet_address?: string | null;
  on_chain_token_id?: string | null;
  tx_hash?: string | null;
  ipfs_metadata_url?: string | null;
  supabase_image_url?: string | null;
  ipfs_image_cid?: string | null;
  rarity?: string | null;
}): Promise<Badge> {
  const db = getDb();

  // 先尝试完整插入（v3 迁移已执行时）
  const { data, error } = await db.from("badges").insert(values).select().single();
  if (!error) return data as Badge;

  // 如果是 schema 缺字段错误，降级到基础字段插入（v3 迁移未执行时）
  const isSchemaError =
    (error as { message?: string }).message?.includes("column") &&
    (error as { message?: string }).message?.includes("schema cache");
  if (isSchemaError) {
    const base = { name: values.name, description: values.description, token_id: values.token_id };
    const { data: d2, error: e2 } = await db.from("badges").insert(base).select().single();
    return assertNoError(d2, e2, "创建勋章失败");
  }

  throw new Error(`创建勋章失败: ${(error as { message: string }).message}`);
}

// ─── BadgeCards（勋章-卡片关联）──────────────────────────────────────────────

export async function getAllBadgeCards(): Promise<BadgeCard[]> {
  const db = getDb();
  const { data, error } = await db.from("badge_cards").select("*");
  return assertNoError(data, error, "获取勋章卡片关联失败");
}

export async function getBadgeCardsByBadgeId(badgeId: number): Promise<BadgeCard[]> {
  const db = getDb();
  const { data, error } = await db.from("badge_cards").select("*").eq("badge_id", badgeId);
  return assertNoError(data, error, "获取勋章卡片关联失败");
}

export async function insertBadgeCards(rows: { badge_id: number; card_id: number }[]): Promise<void> {
  if (rows.length === 0) return;
  const db = getDb();
  const { error } = await db.from("badge_cards").insert(rows);
  if (error) throw new Error(`创建勋章卡片关联失败: ${error.message}`);
}

// ─── 格式化工具（camelCase 输出）─────────────────────────────────────────────

export function formatOre(ore: Ore) {
  return {
    id: ore.id,
    title: ore.title,
    content: ore.content,
    type: ore.type,
    tags: ore.tags ?? [],
    createdAt: ore.created_at,
  };
}

export function formatCard(card: Card, cardOres: CardOre[]) {
  return {
    id: card.id,
    name: card.name,
    description: card.description,
    rarity: card.rarity,
    oreIds: cardOres.filter((co) => co.card_id === card.id).map((co) => co.ore_id),
    createdAt: card.created_at,
  };
}

export function formatBadge(badge: Badge, badgeCards: BadgeCard[]) {
  return {
    id: badge.id,
    name: badge.name,
    description: badge.description,
    tokenId: badge.token_id,
    walletAddress: badge.wallet_address ?? null,
    onChainTokenId: badge.on_chain_token_id ?? null,
    txHash: badge.tx_hash ?? null,
    ipfsMetadataUrl: badge.ipfs_metadata_url ?? null,
    cardIds: badgeCards.filter((bc) => bc.badge_id === badge.id).map((bc) => bc.card_id),
    createdAt: badge.created_at,
  };
}

export function calcRarity(count: number): string {
  if (count >= 10) return "legendary";
  if (count >= 6) return "epic";
  if (count >= 3) return "rare";
  return "common";
}

// ─── Storage：Supabase Storage 上传 ──────────────────────────────────────────

const BUCKET_BADGE = "badge-images";
const BUCKET_CARD = "card-images";

export interface StorageUploadResult {
  path: string;
  publicUrl: string;
}

async function ensureBucket(supabase: SupabaseClient, name: string): Promise<void> {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === name);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(name, { public: true });
    if (error && !error.message.includes("already exists")) {
      throw new Error(`创建 Supabase 存储桶失败: ${error.message}`);
    }
  }
}

/** 上传勋章图片到 Supabase Storage，返回 CDN 公开访问 URL */
export async function uploadBadgeImageToSupabase(
  imageBuffer: Buffer,
  tokenId: string,
): Promise<StorageUploadResult> {
  const supabase = getDb();
  await ensureBucket(supabase, BUCKET_BADGE);

  const filename = `${tokenId}-${Date.now()}.png`;
  const path = `badges/${filename}`;

  const { error } = await supabase.storage
    .from(BUCKET_BADGE)
    .upload(path, imageBuffer, { contentType: "image/png", upsert: true });

  if (error) throw new Error(`Supabase 图片上传失败: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET_BADGE).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

/** 上传卡片图片到 Supabase Storage，返回 CDN 公开访问 URL */
export async function uploadCardImageToSupabase(
  imageBuffer: Buffer,
  cardId: number,
): Promise<StorageUploadResult> {
  const supabase = getDb();
  await ensureBucket(supabase, BUCKET_CARD);

  const filename = `card-${cardId}-${Date.now()}.png`;
  const path = `cards/${filename}`;

  const { error } = await supabase.storage
    .from(BUCKET_CARD)
    .upload(path, imageBuffer, { contentType: "image/png", upsert: true });

  if (error) throw new Error(`Supabase 卡片图片上传失败: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET_CARD).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}


/** 测试 Supabase 连接是否正常 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const supabase = getDb();
    const { error } = await supabase.storage.listBuckets();
    return !error;
  } catch {
    return false;
  }
}
