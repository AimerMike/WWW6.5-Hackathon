import type { Metadata } from "next";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export const metadata: Metadata = {
  title: "我的",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">我的</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        展示钱包地址、历史评价与 SBT（types/user.ts）。
      </p>
      <div className="mt-8 space-y-4">
        <PlaceholderCard title="账户">连接钱包后显示地址与链。</PlaceholderCard>
        <PlaceholderCard title="我的评价">列表占位。</PlaceholderCard>
      </div>
    </div>
  );
}
