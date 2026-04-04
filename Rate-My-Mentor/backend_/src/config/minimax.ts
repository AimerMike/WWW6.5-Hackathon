import OpenAI from 'openai';
import { getAIEnv } from './env';

let _miniMaxOpenAIClient: OpenAI | null = null;

/**
 * OpenAI SDK 指向 MiniMax 兼容端点（Coding Plan / Token Plan 控制台申请的 Key）
 * @see https://platform.minimax.io/docs/api-reference/text-openai-api
 */
export function getMiniMaxOpenAIClient(): OpenAI {
  if (_miniMaxOpenAIClient) return _miniMaxOpenAIClient;

  const { MINIMAX_API_KEY, MINIMAX_BASE_URL } = getAIEnv();

  _miniMaxOpenAIClient = new OpenAI({
    apiKey: MINIMAX_API_KEY,
    baseURL: MINIMAX_BASE_URL,
  });

  return _miniMaxOpenAIClient;
}

interface MiniMaxNativeChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
  base_resp?: { status_code?: number; status_msg?: string };
}

/**
 * 原生文本/多模态接口（含图片）。OpenAI 兼容层当前不支持 image 输入。
 * @see https://platform.minimax.io/docs/api-reference/text-post
 */
export async function miniMaxNativeChatCompletion(
  body: Record<string, unknown>
): Promise<string> {
  const { MINIMAX_API_KEY, MINIMAX_NATIVE_BASE_URL } = getAIEnv();
  const origin = MINIMAX_NATIVE_BASE_URL.replace(/\/$/, '');
  const url = `${origin}/v1/text/chatcompletion_v2`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MINIMAX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: MiniMaxNativeChatResponse;
  try {
    data = JSON.parse(text) as MiniMaxNativeChatResponse;
  } catch {
    throw new Error(`MiniMax 原生 API 返回非 JSON：${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    throw new Error(`MiniMax 原生 API HTTP ${res.status}：${text.slice(0, 500)}`);
  }

  const code = data.base_resp?.status_code;
  if (code != null && code !== 0) {
    throw new Error(
      `MiniMax 原生 API 错误 ${code}：${data.base_resp?.status_msg ?? ''}`
    );
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('MiniMax 无返回内容');
  }
  return content;
}
