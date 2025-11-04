"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarClock, Plus, Users2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    label: "Tasks",
    description: "Stay aligned with stakeholders",
    href: "/",
    icon: Users2,
  },
  {
    label: "Contacts",
    description: "Stay aligned with stakeholders",
    href: "/contacts",
    icon: Users2,
  },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-6 px-6 py-4 sm:px-8 lg:px-5">
        {/* Left: Brand */}
        <div className="flex flex-1 items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <CalendarClock className="size-5" />
            </span>
            <div className="flex flex-col">
              <span className="text-base font-semibold leading-tight">
                TaskFlow
              </span>
              <span className="text-xs text-muted-foreground">
                Task management assignment hub
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop nav (md+) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile nav (unchanged) */}
      <nav className="border-t bg-muted/40 p-3 md:hidden">
        <div className="flex flex-col gap-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-md bg-background text-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium">{link.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {link.description}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
