import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Sun } from "lucide-react";
import { footerNav } from "@/config/site";
import type { Settings } from "@/types";
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon } from "@/components/icons/social";

const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
} as const;

export function Footer({ settings }: { settings: Settings }) {
  const social = settings.socialLinks ?? {};
  const socialEntries = (Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[])
    .map((key) => ({ key, url: social[key], Icon: SOCIAL_ICONS[key] }))
    .filter((entry) => entry.url);

  return (
    <footer className="border-t border-ink-700 bg-ink-950 text-white/70">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-white/10 text-solar-400">
              <Sun className="size-5" />
            </span>
            <span className="font-display text-lg font-bold text-white">{settings.companyName}</span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed">
            {settings.aboutText ?? settings.tagline}
          </p>
          {socialEntries.length > 0 && (
            <div className="flex gap-3 pt-2">
              {socialEntries.map(({ key, url, Icon }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="flex size-9 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/15"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-display text-sm font-semibold text-white">Company</h3>
          {footerNav.company.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-display text-sm font-semibold text-white">Services</h3>
          {footerNav.services.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm hover:text-white">
              {link.label}
            </Link>
          ))}
          <Link href="/products" className="text-sm hover:text-white">
            Products
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-display text-sm font-semibold text-white">Contact</h3>
          {settings.phone && (
            <a href={`tel:${settings.phone}`} className="flex items-start gap-2 text-sm hover:text-white">
              <Phone className="mt-0.5 size-4 shrink-0" /> {settings.phone}
            </a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="flex items-start gap-2 text-sm hover:text-white">
              <Mail className="mt-0.5 size-4 shrink-0" /> {settings.email}
            </a>
          )}
          {settings.address && (
            <span className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0" /> {settings.address}
            </span>
          )}
          {settings.businessHours && (
            <span className="flex items-start gap-2 text-sm">
              <Clock className="mt-0.5 size-4 shrink-0" /> {settings.businessHours}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{settings.footerText ?? `© ${new Date().getFullYear()} ${settings.companyName}. All rights reserved.`}</p>
          <div className="flex gap-4">
            {footerNav.legal.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white/80">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
