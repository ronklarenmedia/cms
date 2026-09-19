import { notFound } from "next/navigation";
import { findTab } from "../tabs";
import { Notice, Panel } from "../ui";

// Tabs die nog niet gebouwd zijn. De echte tabs hebben een eigen route en gaan voor.
export default async function PlannedTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab: slug } = await params;
  const tab = findTab(slug);
  if (!tab?.planned) notFound();

  return (
    <div className="flex max-w-[720px] flex-col gap-[var(--space-6)]">
      <Notice tone="info">
        <strong className="font-medium">{tab.label} volgt.</strong> {tab.planned.needs}
      </Notice>
      <Panel title="Gepland" description={tab.planned.intro}>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {tab.planned.items.map((item) => (
            <li key={item} className="flex gap-2 text-[13.5px] text-text/80">
              <i className="ph ph-circle-dashed mt-[3px] text-[14px] text-text/45" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
