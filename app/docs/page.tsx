import { DocsClient } from "@/components/docs/DocsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation | Genit",
  description: "Guides, reference material, and knowledge base articles for Genit.",
};

export default function DocsPage() {
  return <DocsClient />;
}
