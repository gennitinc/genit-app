"use client";

// import type { Metadata } from "next";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Onboarding removed: no onboarding redirect util needed
import Loading from "@/utils/Loading";
import { LandingPage } from "@/components/landing/landing-page";
import HEYO from '@heyo.so/js';

// export const metadata: Metadata = {
//   title:
//     "Gennit AI – Create AI-Powered Media Designs | Graphics, Videos & Animations",
//   description:
//     "Gennit AI transforms media creation with intelligent design tools. Generate stunning graphics, videos, animations, and brand assets in minutes—no design skills needed.",
//   keywords: [
//     "AI media design",
//     "AI graphics generator",
//     "video creation",
//     "animation software",
//     "brand design tools",
//     "marketing content creation",
//     "design automation",
//     "AI-powered design",
//     "media generation",
//     "creative tools",
//   ],
//   openGraph: {
//     title: "Gennit AI – Create AI-Powered Media Designs",
//     description:
//       "Generate stunning graphics, videos, animations, and brand assets with AI. No design skills required.",
//     type: "website",
//     url: "https://www.gennit.online",
//     images: [
//       {
//         url: "https://www.gennit.online/opengraph-image.png",
//         width: 1200,
//         height: 630,
//         alt: "Gennit AI Media Design Platform",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Gennit AI – Create AI-Powered Media Designs",
//     description: "Generate stunning graphics, videos, and animations with AI",
//   },
// };

function Page() {
  const { user, loading } = useUserContext();
  const router = useRouter();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // If still loading, wait
      if (loading) return;

      // If no user, show landing page (no redirect needed)
      if (!user) {
        setIsCheckingOnboarding(false);
        HEYO.init({
          projectId: "692eb61c3ad627090e630762",
        });
        return;
      }

      // Authenticated: redirect to the app
      router.push("/chat");
      setIsCheckingOnboarding(false);
    };

    checkAuthAndRedirect();
  }, [user, loading, router]);

  // Show loading while checking authentication and onboarding status
  if (loading || isCheckingOnboarding) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
        <Loading />
      </div>
    );
  }

  // If no user, show landing page
  if (!user) {
    return <LandingPage />;
  }

  // This should not be reached as authenticated users get redirected
  return (
    <div className="flex items-center justify-center h-screen">
      <Loading />
    </div>
  );
}

export default Page;
