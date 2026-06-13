import { SettingsForm } from "@/components/settings-form";
import { getSettings } from "@/lib/data";

export default async function SettingsPage() {
  const settings = await getSettings();
  return <><div><span className="eyebrow">Store controls</span><h1 className="mt-4 font-heading text-5xl tracking-[-0.04em]">Settings</h1><p className="mt-2 max-w-xl text-muted-foreground">Control the WhatsApp destination, shipping totals, and public announcement from one place.</p></div><SettingsForm settings={settings} /></>;
}
