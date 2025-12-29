import { Metadata } from "next";
import { apiResponse } from "@/utils/apiResponse";

interface CreatorProfile {
  _id: string;
  username: string;
  email: string;
  userdp: string;
  isVerified: boolean;
  followers: number;
  following: number;
  bio?: string;
  coverPhoto?: string;
  stats: {
    totalPosts: number;
    totalLikes: number;
    totalViews: number;
  };
}

async function getCreatorProfile(username: string): Promise<CreatorProfile | null> {
  try {
    const response = await apiResponse.get(`/inspire/creator/${username}`, {
      withCredentials: true,
    });
    return response.data.profile;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const profile = await getCreatorProfile(params.username);

  if (!profile) {
    return {
      title: "Creator Not Found | Gennit",
      description: "The creator profile you're looking for doesn't exist.",
    };
  }

  const profileUrl = `https://www.gennit.online/creator/${params.username}`;
  const ogImage = profile.coverPhoto || profile.userdp || "https://www.gennit.online/opengraph-image.png";
  const description = profile.bio 
    ? `${profile.bio} Follow ${profile.username} on Gennit to see their amazing AI-generated content!`
    : `Follow ${profile.username} on Gennit - Check out their amazing AI-generated content! ${profile.stats.totalPosts} posts, ${profile.followers} followers.`;

  return {
    title: `${profile.username}${profile.isVerified ? " ✓" : ""} | Gennit Creator Profile`,
    description,
    keywords: [
      profile.username,
      "Gennit creator",
      "AI content creator",
      "AI-generated content",
      "Gennit profile",
    ],
    authors: [{ name: profile.username }],
    openGraph: {
      title: `${profile.username}${profile.isVerified ? " ✓" : ""} on Gennit`,
      description: `Follow ${profile.username} on Gennit - Check out their amazing AI-generated content!`,
      url: profileUrl,
      siteName: "Gennit AI",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${profile.username}'s profile on Gennit`,
        },
      ],
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.username}${profile.isVerified ? " ✓" : ""} on Gennit`,
      description: `Follow ${profile.username} on Gennit - Check out their amazing AI-generated content!`,
      images: [ogImage],
    },
    alternates: {
      canonical: profileUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function CreatorProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

