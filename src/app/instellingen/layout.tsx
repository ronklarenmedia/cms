import { requireStaff } from "@/lib/session";
import { SettingsTabs } from "./SettingsTabs";

export default async function InstellingenLayout({ children }: { children: React.ReactNode }) {
  await requireStaff();
  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="!mb-1">Instellingen</h2>
          <div className="text-muted text-[12.5px]">Platformbreed · geldt voor alle klanten</div>
        </div>
        <SettingsTabs />
      </div>
      {children}
    </div>
  );
}
