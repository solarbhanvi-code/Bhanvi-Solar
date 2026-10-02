import { getSettings } from "@/lib/data";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { MobileStickyBar } from "@/components/shared/mobile-sticky-bar";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      <Navbar companyName={settings.companyName} />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer settings={settings} />
      <MobileStickyBar settings={settings} />
    </>
  );
}
