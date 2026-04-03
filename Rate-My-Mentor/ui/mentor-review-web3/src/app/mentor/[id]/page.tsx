"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ExternalLink, Shield } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RingChart, ScoreBar } from "@/components/common/ring-chart";
import { MOCK_MENTOR_DETAIL, getMentorReviews } from "@/data/detail-mock";
import type { ReviewItem } from "@/data/detail-mock";
import { cn } from "@/lib/utils";

type PageProps = {
  params: { id: string };
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function addr(address: string) {
  return address.length > 14 ? `${address.slice(0, 8)}...${address.slice(-6)}` : address;
}

const DIM_LABELS: Record<string, string> = {
  communication: "沟通能力",
  technical: "技术深度",
  responsiveness: "响应速度",
};

function countTags(reviews: ReviewItem[]) {
  const counts: Record<string, number> = {};
  reviews.forEach((r) => r.tags.forEach((t) => { counts[t] = (counts[t] ?? 0) + 1; }));
  return counts;
}

function getTagCloud(tags: Record<string, number>) {
  return Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));
}

export default function MentorDetailPage({ params }: PageProps) {
  const router = useRouter();
  const id = decodeURIComponent(params.id);
  const mentor = MOCK_MENTOR_DETAIL[id];
  const allReviews = getMentorReviews(id);
  const [filter, setFilter] = useState<"all" | "verified">("all");
  const [reviews] = useState<ReviewItem[]>(allReviews);

  if (!mentor) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Mentor 未找到</h1>
        <p className="mt-2 text-muted-foreground">ID: {id}</p>
        <Link href="/mentors">
          <Button variant="outline" className="mt-6">
            <ArrowLeft className="h-4 w-4" />
            返回榜单
          </Button>
        </Link>
      </div>
    );
  }

  const verifiedCount = reviews.filter((r) => r.txHash).length;
  const tagCounts = countTags(reviews);
  const tagCloud = getTagCloud(tagCounts);
  const maxCount = tagCloud[0]?.count ?? 1;

  const displayedReviews = filter === "verified" ? reviews.filter((r) => r.txHash) : reviews;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Back */}
      <div className="mb-6">
        <Link href="/mentors">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-20 space-y-4">
            <Card>
              <CardContent className="p-5">
                {/* Profile */}
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-16 w-16 border-2 border-accent/30 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-accent/30 to-accent/10 text-lg font-bold text-accent">
                      {initials(mentor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="mt-3 text-lg font-semibold">{mentor.name}</h1>
                  <p className="mt-0.5 text-sm text-muted-foreground">{mentor.title}</p>
                  <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                    {mentor.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Ring Chart */}
                <div className="mt-5 flex justify-center">
                  <RingChart value={mentor.rating} size={120} strokeWidth={8} showLabel label="综合评分" />
                </div>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  基于 {reviews.length} 条评价
                </p>

                {/* Bio */}
                <div className="mt-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{mentor.bio}</p>
                </div>

                {/* Social Links */}
                <div className="mt-4 flex items-center justify-center gap-3">
                  {mentor.twitter && (
                    <a
                      href={`https://twitter.com/${mentor.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {mentor.github && (
                    <a
                      href={`https://github.com/${mentor.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* Write Review Button */}
                <Button
                  className="mt-4 w-full"
                  size="lg"
                  onClick={() => {
                    // 将导师名字存储到 localStorage，供 review 页面使用
                    localStorage.setItem("rmm_mentor_name", mentor.name);
                    router.push("/review");
                  }}
                >
                  写评价
                </Button>
              </CardContent>
            </Card>

            {/* Tag Cloud */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">标签云</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tagCloud.map(({ tag, count }) => {
                    const weight = count / maxCount;
                    return (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer text-[10px] transition-colors hover:bg-accent/20"
                        style={{ opacity: 0.5 + weight * 0.5 }}
                      >
                        {tag}
                        <span className="ml-1 opacity-60">({count})</span>
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Supplementary Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">补充信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">加入时间</span>
                  <span className="font-medium">{mentor.createdAt}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">擅长领域</span>
                  <span className="font-medium">{mentor.domain}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">评价总数</span>
                  <span className="font-medium">{reviews.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {/* Rating Section */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">评价详情</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex shrink-0 justify-center sm:min-w-[160px]">
                  <div className="flex flex-col items-center">
                    <RingChart value={mentor.rating} size={140} strokeWidth={10} showLabel />
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                      {reviews.length} 条评价
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  {(["communication", "technical", "responsiveness"] as const).map((key) => (
                    <ScoreBar key={key} label={DIM_LABELS[key]} value={mentor.stats[key]} />
                  ))}
                  <div className="mt-4 rounded-lg border border-border/60 bg-muted/20 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">综合评分</span>
                      <span className="font-semibold text-accent">{mentor.rating.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium">评价筛选</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filter === "all" ? "default" : "outline"}
                className="h-8 text-xs"
                onClick={() => setFilter("all")}
              >
                全部 ({reviews.length})
              </Button>
              <Button
                size="sm"
                variant={filter === "verified" ? "default" : "outline"}
                className={cn(
                  "h-8 text-xs gap-1.5",
                  filter === "verified" && "bg-accent text-accent-foreground"
                )}
                onClick={() => setFilter("verified")}
              >
                <Shield className="h-3.5 w-3.5" />
                链上验证 ({verifiedCount})
              </Button>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="mb-3 text-lg font-semibold">
              {filter === "verified" ? "链上验证评价" : "全部评价"} ({displayedReviews.length})
            </h2>
            {displayedReviews.length === 0 ? (
              <div className="rounded-xl border border-border/60 bg-card p-8 text-center">
                <p className="text-sm text-muted-foreground">暂无符合条件的评价</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedReviews.map((review) => (
                  <Card key={review.id} className="p-5">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-accent/20 to-accent/5 text-xs font-medium text-accent">
                          {initials(review.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{review.author}</span>
                          <span className="font-mono text-xs text-muted-foreground">{addr(review.authorAddress)}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg key={i} width="12" height="12" viewBox="0 0 14 14" fill={i < review.rating ? "#f59e0b" : "#e5e7eb"}>
                                <path d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.43L7 8.885 3.91 10.5l.59-3.43L2 4.635l3.455-.505L7 1z" />
                              </svg>
                            ))}
                          </div>
                          {review.txHash && (
                            <Badge variant="outline" className="h-5 gap-1 text-[9px] border-accent/40 bg-accent/10 text-accent">
                              <CheckCircle2 className="h-2.5 w-2.5" />
                              链上
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      {review.txHash && (
                        <a
                          href={`https://etherscan.io/tx/${review.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>

                    <p className="mt-4 text-sm leading-relaxed">{review.comment}</p>

                    {review.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {review.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}