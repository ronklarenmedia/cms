"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { settingsTabs } from "./tabs";

export function SettingsTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Instellingen" className="flex flex-wrap gap-2">
      {settingsTabs.map((tab) => {
        const on = pathname === `/instellingen/${tab.slug}`;
        return (
          <Link
            key={tab.slug}
            href={`/instellingen/${tab.slug}`}
            aria-current={on ? "page" : undefined}
            className={`rounded-md px-3 py-1.5 text-[13px] no-underline ${
              on
                ? "bg-accent/12 text-accent-200 ring-1 ring-inset ring-accent"
                : `hover:bg-text/6 ${tab.planned ? "text-text/55" : "text-text/80"}`
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
