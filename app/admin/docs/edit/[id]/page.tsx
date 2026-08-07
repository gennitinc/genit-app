"use client";

import {
  DocPage,
  DocsEditorForm,
} from "@/components/admin/docs/DocsEditorForm";
import { LocalizedText } from "@/components/localized-text";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React, { use, useEffect, useState } from "react";

interface EditDocPageProps {
  params: Promise<{ id: string }>;
}

export default function EditDocPage({ params }: EditDocPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [doc, setDoc] = useState<DocPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      setIsLoading(true);
      try {
        const response = await apiResponse.get(`/docs/id/${id}`);
        setDoc(response.data.doc);
      } catch (err) {
        console.error("Failed to load documentation page", err);
        toast.error("Error loading documentation page");
        router.push("/admin/docs");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDoc();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className='flex h-[60vh] flex-col items-center justify-center gap-4'>
        <LoadingFileLoader size={16} />
        <p className='text-sm text-zinc-500'>
          <LocalizedText text={"Loading documentation..."} />
        </p>
      </div>
    );
  }

  if (!doc) return null;

  return <DocsEditorForm mode='edit' initialDoc={doc} />;
}
