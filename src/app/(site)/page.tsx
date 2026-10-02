import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Handshake,
  Leaf,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import {
  getFaqs,
  getProducts,
  getProjects,
  getServices,
  getSettings,
  getTestimonials,
} from "@/lib/data";
import { buildWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatCard } from "@/components/shared/stat-card";
import { SolarJourney } from "@/components/shared/solar-journey";
import { ProductCard } from "@/components/shared/product-card";
import { ProjectCard } from "@/components/shared/project-card";
import { TestimonialCard } from "@/components/shared/testimonial-card";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { CtaSection } from "@/components/shared/cta-section";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

const WHY_BHANVI = [
  { icon: BadgeCheck, title: "Quality Products", description: "Sourced from trusted manufacturers with dependable performance." },
  { icon: Wrench, title: "Professional Installation", description: "Certified installers following safety and quality best practices." },
  { icon: Sparkles, title: "Customized Solutions", description: "Systems sized around your roof, consumption and budget." },
  { icon: ShieldCheck, title: "Transparent Process", description: "Clear quotes and honest guidance at every step." },
  { icon: Handshake, title: "Long-Term Support", description: "We stay reachable well after installation is complete." },
  { icon: Leaf, title: "Reliable Service", description: "Responsive maintenance to keep your system performing." },
];

const WHY_SOLAR_POINTS = [
  "Lower electricity bills",
  "Long-term savings on energy costs",
  "Reduced dependence on the grid",
  "Cleaner, renewable energy generation",
  "Greater energy independence",
  "Potential property value benefits",
];

export default async function HomePage() {
  const [settings, featuredProducts, featuredProjects, services, testimonials, faqs] =
    await Promise.all([
      getSettings(),
      getProducts({ featured: true, limit: 8 }),
      getProjects({ featured: true, limit: 6 }),
      getServices(),
      getTestimonials(),
      getFaqs(),
    ]);

  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp, generalEnquiryMessage(settings.companyName));
  const stats = settings.statistics ?? {};

  return (
    <>
      {/* SECTION 1 — HERO */}
      <section className="relative overflow-hidden bg-ink-950">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 size-96 rounded-full bg-solar-500/20 blur-3xl" />
          <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-energy-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:28px_28px]" />
        </div>

        <div className="container-page relative flex flex-col items-start gap-8 py-24 sm:py-32">
          <Badge className="border-white/15 bg-white/10 text-solar-300">
            Solar systems for homes &amp; businesses
          </Badge>
          <h1 className="font-display max-w-3xl text-4xl font-bold leading-[1.1] text-white sm:text-6xl">
            Power Your Future With <span className="text-solar-400">Solar Energy</span>
          </h1>
          <p className="max-w-xl text-lg text-white/70">{settings.heroSubtitle}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="solar" size="lg">
              <Link href="/contact">
                Get a Free Quote
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
              <Link href="/services">Explore Solar Solutions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 2 — TRUST / QUICK STATS */}
      <section className="border-b border-ink-700 bg-ink-950 py-12">
        <div className="container-page grid grid-cols-2 gap-8 sm:grid-cols-4">
          <StatCard value={stats.projectsCompleted} label="Projects Completed" />
          <StatCard value={stats.kwInstalled} label="kW Installed" />
          <StatCard value={stats.happyCustomers} label="Happy Customers" />
          <StatCard value={stats.yearsExperience} suffix="+ yrs" label="Experience" />
        </div>
      </section>

      <div className="container-page flex flex-col gap-24 py-24">
        {/* SECTION 3 — WHY BHANVI SOLAR */}
        <section>
          <SectionHeading
            eyebrow="Why Bhanvi Solar"
            title="A partner you can rely on, start to finish"
            description="From the first site visit to years of after-sales support, we focus on quality and transparency at every step."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_BHANVI.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <span className="flex size-11 items-center justify-center rounded-xl bg-solar-500/10 text-solar-600">
                  <item.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-ink-950">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4 — SOLAR ENERGY JOURNEY */}
        <section className="-mx-4 rounded-3xl bg-ink-950 px-6 py-16 sm:mx-0 sm:px-10">
          <SectionHeading
            eyebrow="How it works"
            title="The Solar Energy Journey"
            description="From sunlight to savings — how a solar system powers your home or business."
            align="center"
            light
            className="mx-auto items-center text-center"
          />
          <div className="mt-14">
            <SolarJourney />
          </div>
        </section>

        {/* SECTION 5 — SERVICES */}
        <section>
          <SectionHeading eyebrow="Services" title="What we offer" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service._id}
                href={`/services/${service.slug}`}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="font-display text-base font-semibold text-ink-950">{service.name}</h3>
                <p className="text-sm text-muted-foreground">{service.shortDescription}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-energy-600">
                  Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 6 — FEATURED PROJECTS */}
        <section>
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Our Work" title="Featured Projects" />
            <Link href="/projects" className="hidden shrink-0 text-sm font-medium text-energy-600 hover:underline sm:block">
              View all projects
            </Link>
          </div>
          <div className="mt-10">
            {featuredProjects.items.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.items.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-mist-50 p-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Featured projects will appear here once they&apos;re added from the admin panel.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 7 — PRODUCTS */}
        <section>
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Catalogue" title="Featured Products" />
            <Link href="/products" className="hidden shrink-0 text-sm font-medium text-energy-600 hover:underline sm:block">
              View all products
            </Link>
          </div>
          <div className="mt-10">
            {featuredProducts.items.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.items.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-mist-50 p-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Featured products will appear here once they&apos;re added from the admin panel.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 8 — WHY SOLAR */}
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Why Solar"
              title="The case for switching to solar"
              description="Solar is a long-term investment in lower energy costs and cleaner power."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {WHY_SOLAR_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-ink-800">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-energy-500" />
                  {point}
                </li>
              ))}
            </ul>
            <Button asChild variant="link" className="mt-6 text-energy-600">
              <Link href="/why-solar">
                Read more about why solar <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="rounded-3xl bg-energy-500/10 p-10">
            <p className="text-sm font-medium text-energy-700">A note on estimates</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-800">
              Actual savings depend on your location, roof orientation, shading, local electricity
              tariffs and system design. Use our calculator for a personalized estimate, and request
              a detailed quote for exact figures.
            </p>
          </div>
        </section>

        {/* SECTION 9 — SOLAR CALCULATOR CTA */}
        <section className="rounded-3xl border border-solar-500/20 bg-solar-500/5 px-6 py-14 text-center sm:px-14">
          <SectionHeading
            title="See How Much You Could Save With Solar"
            description="Answer a few quick questions and get an instant, personalized estimate."
            align="center"
            className="mx-auto items-center"
          />
          <Button asChild variant="solar" size="lg" className="mt-8">
            <Link href="/solar-calculator">
              Calculate My Solar Savings
              <ArrowRight />
            </Link>
          </Button>
        </section>

        {/* SECTION 10 — TESTIMONIALS */}
        {testimonials.length > 0 && (
          <section>
            <SectionHeading eyebrow="Testimonials" title="What our customers say" />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 6).map((testimonial) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 11 — FAQ */}
        {faqs.length > 0 && (
          <section className="mx-auto w-full max-w-3xl">
            <SectionHeading eyebrow="FAQ" title="Frequently asked questions" align="center" className="mx-auto items-center" />
            <div className="mt-10 rounded-2xl border border-border bg-white px-6">
              <FaqAccordion faqs={faqs.slice(0, 6)} />
            </div>
          </section>
        )}

        {/* SECTION 12 — FINAL CTA */}
        <CtaSection
          title="Ready to Make the Switch to Solar?"
          description="Talk to our team and get a free, no-obligation quote for your home or business."
          whatsappUrl={whatsappUrl}
        />
      </div>

      <div className="fixed bottom-24 right-5 z-40 hidden lg:block">
        <WhatsAppButton url={whatsappUrl} variant="icon" label="Chat with us on WhatsApp" />
      </div>
    </>
  );
}
