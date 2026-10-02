export interface ImageAsset {
  url: string;
  publicId: string;
  alt?: string;
}

export interface Seo {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
}

export type Availability = "IN_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER";

export interface Specification {
  key: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  images: ImageAsset[];
  price?: number;
  category: Category | string;
  brand?: string;
  specifications: Specification[];
  features: string[];
  warranty?: string;
  availability: Availability;
  applications: string[];
  featured: boolean;
  isActive: boolean;
  seo?: Seo;
  createdAt: string;
  updatedAt: string;
}

export type ProjectType = "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL";
export type ImageStage = "BEFORE" | "INSTALLATION" | "COMPLETED";

export interface ProjectImage extends ImageAsset {
  stage: ImageStage;
}

export interface GenerationData {
  annualGenerationKwh?: number;
  annualSavings?: number;
}

export interface Project {
  _id: string;
  name: string;
  slug: string;
  location: string;
  capacity: string;
  projectType: ProjectType;
  description: string;
  installationDate?: string;
  images: ProjectImage[];
  featured: boolean;
  isActive: boolean;
  generationData?: GenerationData;
  seo?: Seo;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon?: string;
  image?: string;
  highlights: string[];
  order: number;
  isActive: boolean;
  seo?: Seo;
}

export interface Testimonial {
  _id: string;
  name: string;
  location?: string;
  message: string;
  rating?: number;
  image?: string;
  published: boolean;
  order: number;
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  published: boolean;
  order: number;
}

export type PropertyType = "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "OTHER";
export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "SITE_VISIT"
  | "QUOTATION_SENT"
  | "WON"
  | "LOST";

export interface LeadNote {
  text: string;
  createdAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  propertyType?: PropertyType;
  monthlyBill?: number;
  interest?: string;
  message?: string;
  status: LeadStatus;
  notes: LeadNote[];
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface Statistics {
  projectsCompleted?: number;
  kwInstalled?: number;
  happyCustomers?: number;
  yearsExperience?: number;
}

export interface CalculatorConfig {
  costPerKwh: number;
  sunHours: number;
  systemEfficiency: number;
  costPerKw: number;
  annualDegradation: number;
  sqftPerKw: number;
}

export interface Settings {
  _id?: string;
  companyName: string;
  tagline: string;
  logo?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  businessHours?: string;
  socialLinks?: SocialLinks;
  googleMapsUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  aboutText?: string;
  statistics?: Statistics;
  calculatorConfig: CalculatorConfig;
  defaultSEO?: Seo;
  footerText?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CalculatorEstimateResult {
  monthlyConsumptionKwh: number;
  recommendedSystemSizeKw: number;
  roofConstrained: boolean;
  estimatedAnnualGenerationKwh: number;
  estimatedAnnualSavings: number;
  estimatedSystemCost: number;
  paybackYears: number | null;
  co2OffsetKgPerYear: number;
}

export interface CalculatorResponse {
  result: CalculatorEstimateResult;
  assumptions: CalculatorConfig;
  disclaimer: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role: "admin";
}
