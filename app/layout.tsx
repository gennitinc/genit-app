import "./event-calendar.css";
import "./globals.css";
import { ClientProviders } from "@/components/layout/client-providers";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const title = "Genit AI – Autonomous Marketing Agents for Business Growth";
const description =
  "Plan, create, publish, and optimize marketing across your connected channels with autonomous AI agents built for modern businesses.";

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
  alternates: { canonical: "/" },
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
    url: "/",
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
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
