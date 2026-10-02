/** Builds a wa.me deep link. The number always comes from Settings/CMS — never hardcode it elsewhere. */
export function buildWhatsAppUrl(whatsappNumber: string | undefined, message: string): string {
  const digits = (whatsappNumber ?? "").replace(/[^\d]/g, "");
  const encoded = encodeURIComponent(message);
  if (!digits) return `https://wa.me/?text=${encoded}`;
  return `https://wa.me/${digits}?text=${encoded}`;
}

export function productEnquiryMessage(productName: string): string {
  return `Hi, I'm interested in the ${productName}. I would like to know the price and availability.`;
}

export function generalEnquiryMessage(companyName: string): string {
  return `Hi, I would like to know more about ${companyName}'s solar solutions.`;
}

export function projectEnquiryMessage(projectName: string): string {
  return `Hi, I saw the "${projectName}" project on your website and would like a similar solution.`;
}
