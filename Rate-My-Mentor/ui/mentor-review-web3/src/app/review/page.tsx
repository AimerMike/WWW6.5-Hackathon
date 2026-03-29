import type { Metadata } from "next";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export const metadata: Metadata = {
  title: "写评价",
};

export default function ReviewPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">发布评价</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        选择 Mentor、填写评分与文字评价；提交后上链或存证。
      </p>
      <div className="mt-8 space-y-4">
        <PlaceholderCard title="表单占位">
          接入 hooks/useContract 与合约写入后替换为真实表单。
        </PlaceholderCard>
      </div>
    </div>
  );
}
