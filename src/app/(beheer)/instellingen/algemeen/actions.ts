"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { platformSettings } from "@/db/schema";
import { platformSettingsSchema, type PlatformSettings } from "@/lib/platform-settings-schema";
import { NOT_LOGGED_IN, staffUser } from "@/lib/session";

export type SettingsState =
  | {
      error?: string;
      saved?: boolean;
      fieldErrors?: Partial<Record<keyof PlatformSettings, string>>;
      /** Wat er is ingestuurd (bij een fout) of is opgeslagen; zo verdwijnt je invoer niet na het versturen. */
      values?: PlatformSettings;
    }
  | undefined;

const FIELDS = [
  "platformName",
  "adminDomain",
  "language",
  "timezone",
  "supportEmail",
  "senderName",
  "phone",
  "kvk",
] as const;

const emptyToNull = (s: string) => (s === "" ? null : s);

export async function savePlatformSettings(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const user = await staffUser();
  if (!user) return { error: NOT_LOGGED_IN };
  if (user.role !== "platform-admin") {
    return { error: "Alleen een platform-admin mag de platforminstellingen wijzigen." };
  }

  const raw = Object.fromEntries(FIELDS.map((k) => [k, String(formData.get(k) ?? "").trim()])) as PlatformSettings;
  const parsed = platformSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: NonNullable<SettingsState>["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof PlatformSettings;
      fieldErrors[key] ??= issue.message;
    }
    return { error: "Controleer de gemarkeerde velden.", fieldErrors, values: raw };
  }

  const v = parsed.data;
  const values = {
    platformName: v.platformName,
    adminDomain: emptyToNull(v.adminDomain.toLowerCase()),
    language: v.language,
    timezone: v.timezone,
    supportEmail: emptyToNull(v.supportEmail),
    senderName: emptyToNull(v.senderName),
    phone: emptyToNull(v.phone),
    kvk: emptyToNull(v.kvk),
  };

  try {
    await db
      .insert(platformSettings)
      .values({ id: 1, ...values, updatedBy: user.id })
      .onConflictDoUpdate({ target: platformSettings.id, set: { ...values, updatedAt: new Date(), updatedBy: user.id } });
  } catch (e) {
    console.error("Platforminstellingen opslaan mislukt:", e instanceof Error ? e.message : e);
    return { error: "Opslaan is mislukt. Probeer het opnieuw; blijft het misgaan, dan ontbreekt mogelijk de tabel platform_settings.", values: raw };
  }

  // De platformnaam staat in het menu en de tabbladtitel van elke pagina.
  revalidatePath("/", "layout");
  return {
    saved: true,
    values: {
      ...raw,
      adminDomain: values.adminDomain ?? "",
      supportEmail: values.supportEmail ?? "",
      senderName: values.senderName ?? "",
      phone: values.phone ?? "",
      kvk: values.kvk ?? "",
    },
  };
}
