export const siteConfig = {
  name: "Bhanvi Solar",
  description:
    "Bhanvi Solar provides solar panels, batteries, inverters and professional solar installation services for homes and businesses.",
};

export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Projects", href: "/projects" },
  { label: "Why Solar", href: "/why-solar" },
  { label: "Solar Calculator", href: "/solar-calculator" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Why Solar", href: "/why-solar" },
    { label: "Projects", href: "/projects" },
    { label: "FAQ", href: "/faq" },
  ],
  services: [
    { label: "Residential Solar", href: "/services/residential-solar" },
    { label: "Commercial Solar", href: "/services/commercial-solar" },
    { label: "Installation", href: "/services/installation" },
    { label: "Maintenance", href: "/services/maintenance" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
  ],
};

export const productCategoryFallback = [
  "Solar Panels",
  "Solar Batteries",
  "Inverters",
  "Solar Lights",
  "Solar Accessories",
];
