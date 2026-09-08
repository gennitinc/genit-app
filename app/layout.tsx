import "./event-calendar.css";
import "./globals.css";
import { ClientProviders } from "@/components/layout/client-providers";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const title = "Genit AI Marketing Platform | Agents, Automation & Campaigns";
const description =
  "Genit is an end-to-end AI marketing platform for agents, automation, content, campaigns, publishing, inbox management, analytics, and 1,000+ app integrations.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.trygenit.com"),
  title,
  description,
  applicationName: "Genit AI",
  keywords: [
    "autonomous marketing agents",
    "AI marketing automation",
    "omnichannel marketing",
    "AI social media management",
    "marketing workflow automation",
    "automated content publishing",
    "AI campaign management",
    "AI marketing platform",
    "agentic marketing platform",
    "business growth automation",
  ],
  authors: [{ name: "Genit" }],
  creator: "Genit",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Genit AI",
    title,
    description,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Genit AI autonomous marketing platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
  colorScheme: "dark light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.trygenit.com/#organization",
      name: "Genit AI",
      url: "https://www.trygenit.com",
      logo: "https://www.trygenit.com/logo.jpeg",
      description,
      sameAs: [
        "https://www.linkedin.com/company/genit-ai/",
        "https://x.com/genit_ai",
        "https://instagram.com/genitai",
        "https://www.youtube.com/@genitai",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "team@trygenit.com",
        availableLanguage: "English",
      },
    },
    {
      "@type": "WebApplication",
      "@id": "https://www.trygenit.com/#application",
      name: "Genit AI",
      url: "https://www.trygenit.com",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description,
      featureList: [
        "Autonomous marketing agents",
        "Cross-platform content creation and publishing",
        "Campaign management and optimization",
        "Unified social inbox",
        "Brand identity automation",
        "Marketing analytics",
        "Visual marketing workflow builder",
        "Unified email and social inbox",
        "Go-to-market campaign planning and outbound workflows",
        "AI image, video, document, and presentation creation",
        "1,000+ business app integrations",
      ],
      browserRequirements: "Requires a modern web browser",
      isAccessibleForFree: true,
      publisher: { "@id": "https://www.trygenit.com/#organization" },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.trygenit.com/#website",
      url: "https://www.trygenit.com",
      name: "Genit AI",
      description,
      publisher: { "@id": "https://www.trygenit.com/#organization" },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <Script
          id='theme-init'
          strategy='beforeInteractive'
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('genit-theme')||'dark';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}",
          }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.className} custom-scrollbar`}>
        <ClientProviders>{children}</ClientProviders>
        <Analytics />
      </body>
    </html>
  );
}
