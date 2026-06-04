import LandingContact from "@/components/landing/landing-contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us – Genit AI | Get in Touch",
  description:
    "Get in touch with Genit AI. Fill out our contact form and our team will reach out to provide personalized assistance and answers to your questions.",
  keywords: [
    "contact us",
    "support",
    "sales inquiry",
    "demo request",
    "partnership",
    "business inquiry",
  ],
  openGraph: {
    title: "Contact Us – Genit AI",
    description:
      "Reach out to Genit AI for support, sales, or partnership inquiries",
    url: "https://www.genit.online/contact",
    images: [
      {
        url: "https://www.genit.online/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Genit AI Contact",
      },
    ],
  },
};

// Define the schema for form validation

export default function Contact() {
  return <LandingContact />;
}
