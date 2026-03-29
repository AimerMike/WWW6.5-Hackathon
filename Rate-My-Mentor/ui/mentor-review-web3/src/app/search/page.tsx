"use client";

import Link from "next/link";
import { ArrowUpRight, Building2, Search, Star, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

import { SearchBar } from "@/components/common/search-bar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchCompanies, searchMentors } from "@/data/search-mock";
import { cn } from "@/lib/utils";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";

  const mentors = useMemo(() => searchMentors(q), [q]);
  const companies = useMemo(() => searchCompanies(q), [q]);

  const hasQuery = q.trim().length > 0;
  const total = mentors.length + companies.length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Search Input */}
      <div className="flex justify-center">
        <SearchBar />
      </div>

      {/* Results */}
      {hasQuery ? (
        <div className="mt-8">
          <p className="mb-4 text-sm text-muted-foreground">
            找到 <span className="font-medium text-foreground">{total}</span> 条结果
            <span className="ml-2 font-mono text-xs text-accent">&ldquo;{q}&rdquo;</span>
          </p>

          <Tabs defaultValue={total > 0 ? (mentors.length > 0 ? "mentors" : "companies") : undefined} className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="h-9">
                <TabsTrigger value="mentors" className="text-xs sm:text-sm">
                  <User className="mr-1.5 h-3.5 w-3.5" />
                  Mentor ({mentors.length})
                </TabsTrigger>
                <TabsTrigger value="companies" className="text-xs sm:text-sm">
                  <Building2 className="mr-1.5 h-3.5 w-3.5" />
                  企业 ({companies.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="mentors" className="mt-4">
              {mentors.length === 0 ? (
                <EmptyState type="mentor" query={q} />
              ) : (
                <div className="space-y-3">
                  {mentors.map((m) => (
                    <Link key={m.id} href={`/mentor/${encodeURIComponent(m.id)}`}>
                      <Card className="group cursor-pointer transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md">
                        <CardContent className="flex items-center gap-4 p-4">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-zinc-800 to-zinc-600 text-xs font-bold text-white dark:from-zinc-200 dark:to-zinc-400 dark:text-zinc-900">
                              {initials(m.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base group-hover:text-accent transition-colors">
                                {m.name}
                              </CardTitle>
                            </div>
                            <CardDescription className="mt-0.5 text-xs">
                              {m.title}
                            </CardDescription>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {m.domain}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                              <Star className="h-4 w-4 fill-accent/80 text-accent" />
                              {m.rating.toFixed(2)}
                            </span>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {m.reviewCount} 条评价
                            </p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="companies" className="mt-4">
              {companies.length === 0 ? (
                <EmptyState type="company" query={q} />
              ) : (
                <div className="space-y-3">
                  {companies.map((c) => (
                    <Link key={c.id} href={`/company/${encodeURIComponent(c.id)}`}>
                      <Card className="group cursor-pointer transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-muted/50">
                            <Building2 className="h-5 w-5 text-accent" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base group-hover:text-accent transition-colors">
                              {c.name}
                            </CardTitle>
                            <CardDescription className="mt-0.5 flex items-center gap-2 text-xs">
                              <Badge variant="secondary" className="text-[10px]">{c.industry}</Badge>
                              <span>{c.region}</span>
                            </CardDescription>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-xl font-semibold text-accent">{c.score.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">{c.mentorCount} 位导师</p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-muted/40">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">搜索 Mentor 与企业</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            输入关键词，查找相关的评价与声誉数据
          </p>
        </div>
      )}
    </div>
  );
}

function EmptyState({ type, query }: { type: "mentor" | "company"; query: string }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <p className="text-sm text-muted-foreground">
        未找到相关 {type === "mentor" ? "Mentor" : "企业"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        尝试其他关键词，如 &ldquo;{query}&rdquo; 的相关词
      </p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}