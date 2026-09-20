import { getPlatformSettings } from "@/lib/platform-settings";
import { requireStaff } from "@/lib/session";
import { AlgemeenForm } from "./AlgemeenForm";

export default async function AlgemeenPage() {
  const user = await requireStaff();
  const settings = await getPlatformSettings();
  return <AlgemeenForm settings={settings} canEdit={user.role === "platform-admin"} />;
}
