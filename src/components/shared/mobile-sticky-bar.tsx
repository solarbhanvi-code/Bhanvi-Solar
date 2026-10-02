import Link from "next/link";
import { MessageCircle, Phone, FileText } from "lucide-react";
import type { Settings } from "@/types";
import { buildWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";

export function MobileStickyBar({ settings }: { settings: Settings }) {
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp, generalEnquiryMessage(settings.companyName));

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-white/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.06)] lg:hidden">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-[#25D366]"
      >
        <MessageCircle className="size-5" fill="currentColor" strokeWidth={0} />
        <span className="text-[11px] font-medium text-ink-950">WhatsApp</span>
      </a>
      <a
        href={settings.phone ? `tel:${settings.phone}` : "#"}
        className="flex flex-col items-center justify-center gap-0.5 border-x border-border py-2.5 text-ink-950"
      >
        <Phone className="size-5" />
        <span className="text-[11px] font-medium">Call</span>
      </a>
      <Link href="/contact" className="flex flex-col items-center justify-center gap-0.5 bg-solar-500 py-2.5 text-ink-950">
        <FileText className="size-5" />
        <span className="text-[11px] font-semibold">Get Quote</span>
      </Link>
    </div>
  );
}
