"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, CaretDown, CaretRight, MagnifyingGlass, SidebarSimple } from "@phosphor-icons/react";
import { nav, type NavChild, type NavItem } from "./nav";

const itemBase =
  "flex w-full items-center gap-3 rounded-md px-3 py-[7px] text-left text-[13.5px]";
const childBase =
  "flex w-full items-center gap-2 rounded-sm px-3 py-[5px] text-left text-[12.5px]";
const disabledCls = "cursor-not-allowed opacity-45";

function NavEntry({
  entry,
  className,
  iconSize,
  collapsed,
}: {
  entry: NavChild;
  className: string;
  iconSize: number;
  collapsed: boolean;
}) {
  const Icon = entry.icon;
  const content = (
    <>
      <Icon size={iconSize} className="w-4 flex-none" />
      {collapsed ? null : <span className="min-w-0 flex-1 truncate">{entry.label}</span>}
    </>
  );
  const justify = collapsed ? "justify-center" : "justify-start";

  if (!entry.href) {
    return (
      <button
        type="button"
        disabled
        title={`${entry.label} — binnenkort`}
        className={`${className} ${justify} ${disabledCls}`}
      >
        {content}
      </button>
    );
  }
  return (
    <Link href={entry.href} title={entry.label} className={`${className} ${justify}`}>
      {content}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const childOn = (c: NavChild) => c.href === pathname;
  const hasActiveChild = (item: NavItem) => item.children?.some(childOn) ?? false;
  const itemOn = (item: NavItem) =>
    !!item.href &&
    !hasActiveChild(item) &&
    (pathname === item.href || pathname.startsWith(`${item.href}/`));

  let crumbRoot = "Ron Klaren Media";
  let pageTitle = "";
  for (const item of nav) {
    const child = item.children?.find(childOn);
    if (child) {
      crumbRoot = item.label;
      pageTitle = child.label;
    } else if (itemOn(item)) {
      pageTitle = item.label;
    }
  }

  return (
    <div
      className={`grid h-screen overflow-hidden bg-bg text-text ${
        collapsed ? "grid-cols-[60px_minmax(0,1fr)]" : "grid-cols-[224px_minmax(0,1fr)]"
      }`}
    >
      {/* hoofdmenu */}
      <div className="flex min-w-0 flex-col border-r border-divider bg-bg">
        <div
          className={`flex min-h-[52px] items-center gap-2 px-3 py-4 ${
            collapsed ? "flex-col" : "flex-row"
          }`}
        >
          <Image
            src="/logo.png"
            alt="Ron Klaren Media"
            width={28}
            height={28}
            className="flex-none rounded-full"
          />
          {collapsed ? null : (
            <div className="min-w-0 flex-1 truncate font-heading text-sm font-medium">
              Ron Klaren Media
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            title="Menu in-/uitklappen"
            className="btn btn-ghost size-[26px] flex-none !p-0 !text-neutral-500 hover:!text-accent"
          >
            <SidebarSimple size={15} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-px overflow-y-auto overflow-x-hidden px-3 py-2">
          {nav.map((item) => {
            const on = itemOn(item);
            const childActive = hasActiveChild(item);
            const kids = item.children ?? [];
            const open = !collapsed && kids.length > 0 && (on || childActive);
            const stateCls = on
              ? "bg-accent/14 text-accent-200 ring-1 ring-inset ring-accent/40"
              : `text-text/85 hover:bg-text/7 ${childActive ? "bg-text/5" : ""}`;
            return (
              <div
                key={item.label}
                className={`flex flex-col gap-px ${item.gapAfter ? "mb-4" : ""}`}
              >
                <div className="relative">
                  <NavEntry
                    entry={item}
                    className={`${itemBase} ${stateCls}`}
                    iconSize={16}
                    collapsed={collapsed}
                  />
                  {!collapsed && kids.length > 0 ? (
                    <CaretDown
                      size={11}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-70"
                    />
                  ) : null}
                </div>
                {open ? (
                  <div className="ml-5 flex flex-col gap-px border-l border-divider pb-2 pl-4 pt-0.5">
                    {kids.map((child) => (
                      <NavEntry
                        key={child.label}
                        entry={child}
                        className={`${childBase} ${
                          childOn(child)
                            ? "bg-accent/12 text-accent-200"
                            : "text-text/72 hover:bg-text/6"
                        }`}
                        iconSize={13}
                        collapsed={collapsed}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 border-t border-divider p-3">
          <div className="grid size-[26px] flex-none place-items-center rounded-full bg-neutral-800 font-heading text-[11px] text-neutral-200">
            RK
          </div>
          {collapsed ? null : (
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px]">Ron Klaren</div>
              <div className="text-[10.5px] text-text/70">Platform-admin</div>
            </div>
          )}
        </div>
      </div>

      {/* werkgebied */}
      <div className="flex min-w-0 flex-col bg-[linear-gradient(180deg,var(--color-neutral-900)_0%,var(--color-bg)_220px)]">
        <div className="flex min-h-[52px] items-center gap-4 border-b border-divider px-6 py-3">
          <div className="flex min-w-0 items-center gap-2 text-[13px]">
            <span className="whitespace-nowrap text-text/72">{crumbRoot}</span>
            {pageTitle ? (
              <>
                <CaretRight size={11} className="text-neutral-700" />
                <span className="whitespace-nowrap font-heading font-medium">{pageTitle}</span>
              </>
            ) : null}
          </div>
          <div className="ml-auto flex max-w-[520px] flex-1 items-center justify-end gap-3">
            <div className="relative min-w-0 max-w-[440px] flex-1">
              <MagnifyingGlass
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text/70"
              />
              <input
                type="search"
                placeholder="Zoek klanten, websites, apps of pagina's"
                className="input !pl-8"
              />
            </div>
            <button type="button" title="Meldingen" className="btn btn-icon btn-secondary">
              <Bell size={16} />
            </button>
          </div>
        </div>

        <main className="min-h-0 flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
