import type { Metadata } from "next";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

type PageProps = {
  params: { id: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: `企业 ${params.id}`,
  };
}

export default function CompanyDetailPage({ params }: PageProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">企业详情</h1>
      <p className="mt-1 font-mono text-sm text-zinc-500">id: {params.id}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <PlaceholderCard title="企业信息">名称、官网、合作 Mentor 等。</PlaceholderCard>
        <PlaceholderCard title="公开数据">预留指标或链上引用。</PlaceholderCard>
      </div>
    </div>
  );
}
