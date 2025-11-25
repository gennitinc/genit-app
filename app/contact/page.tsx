import LandingContact from "@/components/landing/landing-contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us – Gennit AI | Get in Touch",
  description:
    "Get in touch with Gennit AI. Fill out our contact form and our team will reach out to provide personalized assistance and answers to your questions.",
  keywords: [
    "contact us",
    "support",
    "sales inquiry",
    "demo request",
    "partnership",
    "business inquiry",
  ],
  openGraph: {
    title: "Contact Us – Gennit AI",
    description:
      "Reach out to Gennit AI for support, sales, or partnership inquiries",
    url: "https://www.gennit.online/contact",
    images: [
      {
        url: "https://www.gennit.online/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Gennit AI Contact",
      },
    ],
  },
};

// Define the schema for form validation

export default function Contact() {
  return <LandingContact />;
}
