export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "twitter"
  | "tiktok";

export type SocialUrls = Partial<Record<SocialPlatform, string>>;

export interface BrandData {
  companyWebsite: string;
  businessName: string;
  businessBio: string;
  industry: string;
  brandLogo: string;
  ogImage: string;
  brandColors: string[];
  primaryColor: string;
  secondaryColor: string;
  fontHeadline: string;
  fontBody: string;
  aboutUs: string;
  mission: string;
  vision: string;
  slogan: string;
  values: string[];
  voiceTone: string[];
  role: string;
  hearAboutUs: string;
  socials: SocialUrls;
  screenshot?: string;
  source?: "website" | "social";
}

export const emptyBrand: BrandData = {
  companyWebsite: "",
  businessName: "",
  businessBio: "",
  industry: "",
  brandLogo: "",
  ogImage: "",
  brandColors: [],
  primaryColor: "",
  secondaryColor: "",
  fontHeadline: "",
  fontBody: "",
  aboutUs: "",
  mission: "",
  vision: "",
  slogan: "",
  values: [],
  voiceTone: [],
  role: "",
  hearAboutUs: "",
  socials: {},
  screenshot: undefined,
  source: undefined,
};

export type OnboardingStep = "import" | "dna" | "questions";
