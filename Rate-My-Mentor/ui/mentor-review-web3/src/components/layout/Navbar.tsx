"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { appConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/mentors", label: "Mentor榜单" },
  { href: "/companies", label: "企业榜单" },
  { href: "/reputation", label: "声誉看板" },
] as const;

function NavLinks({
  className,
  onNavigate,
  variant = "desktop",
}: {
  className?: string;
  onNavigate?: () => void;
  variant?: "desktop" | "drawer";
}) {
  const pathname = usePathname();

  return (
    <ul
      className={cn(
        variant === "desktop" && "flex items-center gap-1",
        variant === "drawer" && "flex flex-col gap-1",
        className,
      )}
    >
      {NAV_LINKS.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        const link = (
          <Link
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "block rounded-lg px-3 py-2 text-sm transition-colors",
              variant === "desktop" && "whitespace-nowrap",
              active
                ? "bg-accent/10 font-medium text-accent"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );

        return (
          <li key={item.href}>
            {variant === "drawer" ? (
              <DrawerClose asChild>{link}</DrawerClose>
            ) : (
              link
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-lg outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar className="h-9 w-9 border border-border/80 shadow-sm ring-1 ring-accent/20">
            <AvatarFallback className="bg-gradient-to-br from-zinc-900 to-zinc-700 text-[11px] font-bold tracking-widest text-white dark:from-zinc-100 dark:to-zinc-300 dark:text-zinc-900">
              RM
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
              {appConfig.name}
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:block">
              Web3 Reputation
            </span>
          </div>
        </Link>

        <nav className="hidden flex-1 justify-center md:flex">
          <NavLinks variant="desktop" />
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="[&_button]:h-9 [&_button]:min-h-9 [&_button]:rounded-lg [&_button]:border-border/80 [&_button]:text-sm [&_button]:shadow-sm">
            <ConnectButton />
          </div>

          <Drawer
            direction="right"
            open={mobileOpen}
            onOpenChange={setMobileOpen}
            shouldScaleBackground={false}
          >
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 border-border/80 bg-background/50 md:hidden"
                aria-label="打开菜单"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-background/95 backdrop-blur-xl">
              <DrawerHeader className="border-b border-border/80 text-left">
                <DrawerTitle className="font-semibold tracking-tight">
                  导航
                </DrawerTitle>
                <DrawerDescription className="text-muted-foreground">
                  选择页面 · {appConfig.name}
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex-1 overflow-y-auto px-2 py-4">
                <NavLinks
                  variant="drawer"
                  onNavigate={() => setMobileOpen(false)}
                />
              </div>
              <DrawerFooter className="border-t border-border/80 py-4">
                <p className="text-center text-xs text-muted-foreground">
                  连接钱包请使用右上角按钮
                </p>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
