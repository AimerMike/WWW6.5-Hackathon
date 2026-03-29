import Link from "next/link";
import { Building2, LayoutDashboard, Sparkles } from "lucide-react";
import { SearchBar } from "@/components/common/search-bar";

import { Button } from "@/components/ui/button";
import { appConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

const cta = [
  {
    href: "/review",
    label: "Mentor 评价",
    sub: "链上评分与文字反馈",
    icon: Sparkles,
    className:
      "border-accent/40 bg-accent/10 text-foreground hover:bg-accent/20 dark:bg-accent/15",
  },
  {
    href: "/companies",
    label: "企业评价",
    sub: "合作机构与导师网络",
    icon: Building2,
    className:
      "border-border bg-card hover:bg-muted/60",
  },
  {
    href: "/reputation",
    label: "声誉看板",
    sub: "聚合链上信誉指标",
    icon: LayoutDashboard,
    className:
      "border-border bg-card hover:bg-muted/60",
  },
] as const;

const stats = [
  { value: "10K+", label: "评价记录" },
  { value: "2.8K", label: "注册 Mentor" },
  { value: "500+", label: "合作机构" },
] as const;

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern" aria-hidden />
      <div
        className="pointer-events-none absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-[#0a7c59]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[420px] w-[420px] rounded-full bg-[#0a4a30]/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-20">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-xs font-medium text-accent">Web3 Reputation Protocol</span>
          </div>

          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {appConfig.name}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            去中心化 Mentor 与企业评价平台 · 连接钱包，为优秀导师与机构留下可验证评价，声誉数据可组合、可审计。
          </p>

          {/* Search Bar */}
          <div className="mt-8 flex w-full justify-center">
            <SearchBar />
          </div>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap justify-center gap-8 sm:gap-12">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 grid w-full max-w-2xl gap-3 sm:grid-cols-3 sm:gap-4">
            {cta.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  asChild
                  variant="outline"
                  size="lg"
                  className={cn(
                    "h-auto w-full flex-col items-start gap-2 rounded-xl px-5 py-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg",
                    item.className,
                  )}
                >
                  <Link href={item.href}>
                    <span className="flex w-full items-center gap-2">
                      <Icon className="h-5 w-5 shrink-0 text-accent" />
                      <span className="text-base font-semibold">{item.label}</span>
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {item.sub}
                    </span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}