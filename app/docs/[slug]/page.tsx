import { DocsClient } from "@/components/docs/DocsClient";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;

  return {
    title: `${slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")} | Genit Docs`,
    alternates: { canonical: `/docs/${slug}` },
  };
}

export default async function DocSlugPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  return <DocsClient initialSlug={slug} />;
}
