import { getSettings } from "@/lib/data";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export async function StoreShell({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return <><SiteHeader announcement={settings.announcement} /><main>{children}</main><SiteFooter /></>;
}
