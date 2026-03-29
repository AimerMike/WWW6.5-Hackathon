import type { Metadata } from "next";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export const metadata: Metadata = {
  title: "登录",
};

export default function AuthPage() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">身份验证</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        使用顶部钱包连接；此处可后续接 SIWE、OAuth 或 SBT 校验。
      </p>
      <div className="mt-8">
        <PlaceholderCard title="占位">
          在连接钱包后展示地址摘要与登出入口。
        </PlaceholderCard>
      </div>
    </div>
  );
}
