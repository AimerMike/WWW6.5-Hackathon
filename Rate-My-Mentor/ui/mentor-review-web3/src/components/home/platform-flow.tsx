import { CheckCircle2, Link2, PenLine, Wallet } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "连接钱包",
    desc: "使用 RainbowKit 接入，地址作为身份锚点。",
    icon: Wallet,
  },
  {
    step: "02",
    title: "选择对象",
    desc: "浏览 Mentor 或企业，进入详情页准备评价。",
    icon: Link2,
  },
  {
    step: "03",
    title: "提交评价",
    desc: "评分、维度与文字将写入链上或哈希存证。",
    icon: PenLine,
  },
  {
    step: "04",
    title: "声誉沉淀",
    desc: "声誉看板聚合数据，支持第三方组合与审计。",
    icon: CheckCircle2,
  },
] as const;

export function PlatformFlow() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
          平台流程
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
          从连接到声誉沉淀，四步完成可验证反馈闭环。
        </p>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <li
                key={s.step}
                className="relative rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition hover:border-accent/30 hover:shadow-md"
              >
                {i < steps.length - 1 && (
                  <div
                    className="absolute -right-3 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-gradient-to-r from-border to-transparent lg:block"
                    aria-hidden
                  />
                )}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-accent">
                    {s.step}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <h3 className="mt-4 font-medium leading-snug">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
