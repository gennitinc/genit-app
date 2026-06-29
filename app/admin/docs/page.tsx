"use client";

import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import {
  BookOpen,
  CheckCircle2,
  Edit2,
  Eye,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";

type DocPage = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  section: string;
  order: number;
  readTime: string;
  isActive: boolean;
  isFeatured: boolean;
  publishedAt: string;
};

export default function AdminDocsPage() {
  const [docs, setDocs] = useState<DocPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocs = async () => {
    setIsLoading(true);
    try {
      const response = await apiResponse.get("/docs?adminView=true");
      setDocs(response.data.docs || []);
    } catch (err) {
      console.error("Failed to load admin docs", err);
      toast.error("Error loading documentation pages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleToggleActive = async (doc: DocPage) => {
    try {
      const isActive = !doc.isActive;
      await apiResponse.put(`/docs/${doc._id}`, { isActive });
      setDocs((items) =>
        items.map((item) =>
          item._id === doc._id ? { ...item, isActive } : item
        )
      );
      toast.success(isActive ? "Doc published" : "Doc moved to draft");
    } catch {
      toast.error("Failed to update doc status");
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!confirm("Are you sure you want to delete this documentation page?")) {
      return;
    }

    try {
      await apiResponse.delete(`/docs/${id}`);
      setDocs((items) => items.filter((item) => item._id !== id));
      toast.success("Documentation page deleted");
    } catch {
      toast.error("Failed to delete documentation page");
    }
  };

  const triggerSeed = async () => {
    if (
      !confirm("This will reset documentation pages to seeded data. Continue?")
    ) {
      return;
    }

    try {
      await apiResponse.post("/docs/seed");
      toast.success("Documentation seeded successfully");
      fetchDocs();
    } catch {
      toast.error("Failed to seed documentation");
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between pb-4'>
        <div>
          <h1 className='flex items-center gap-2 text-2xl font-bold tracking-tight text-white'>
            <BookOpen className='h-6 w-6 text-cyan-500' /> Docs Management
          </h1>
          <p className='text-sm text-zinc-400'>
            Create, organize, and publish documentation pages
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={triggerSeed}
            className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs font-semibold text-zinc-300 transition duration-200 hover:border-zinc-700'
          >
            <RefreshCw className='h-3.5 w-3.5' /> Seed Defaults
          </button>
          <Link
            href='/admin/docs/new'
            className='hover:shadow-primary/20 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition duration-200 hover:bg-indigo-700 hover:shadow-lg'
          >
            <Plus className='h-4 w-4' /> Add Doc
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-20'>
          <LoadingFileLoader size={20} />
        </div>
      ) : docs.length === 0 ? (
        <div className='rounded-3xl border border-dashed border-zinc-800 py-20 text-center'>
          <FileText className='mx-auto mb-3 h-10 w-10 text-zinc-600' />
          <h3 className='font-medium text-white'>No docs found</h3>
          <p className='mt-1 text-xs text-zinc-500'>
            Create your first documentation page above.
          </p>
        </div>
      ) : (
        <div className='overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 shadow-xl'>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse text-left text-sm'>
              <thead>
                <tr className='bg-zinc-900/60 font-medium text-zinc-400'>
                  <th className='px-6 py-4'>Title</th>
                  <th className='px-6 py-4'>Section</th>
                  <th className='px-6 py-4'>Order</th>
                  <th className='px-6 py-4'>Read Time</th>
                  <th className='px-6 py-4'>Status</th>
                  <th className='px-6 py-4 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-zinc-800/60 text-zinc-300'>
                {docs.map((doc) => (
                  <tr
                    key={doc._id}
                    className='transition duration-150 hover:bg-zinc-800/20'
                  >
                    <td className='px-6 py-4'>
                      <div>
                        <div className='line-clamp-1 font-semibold text-white'>
                          {doc.title}
                        </div>
                        <div className='mt-0.5 line-clamp-1 text-xs text-zinc-500'>
                          /docs/{doc.slug}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-400'>
                        {doc.section}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-zinc-400'>{doc.order}</td>
                    <td className='px-6 py-4 text-zinc-400'>{doc.readTime}</td>
                    <td className='px-6 py-4'>
                      <button
                        onClick={() => handleToggleActive(doc)}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition duration-150 ${
                          doc.isActive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {doc.isActive ? (
                          <>
                            <CheckCircle2 className='h-3.5 w-3.5' /> Published
                          </>
                        ) : (
                          <>
                            <XCircle className='h-3.5 w-3.5' /> Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link
                          href={`/docs/${doc.slug}`}
                          target='_blank'
                          className='rounded-xl p-2 text-zinc-400 transition duration-150 hover:bg-zinc-800 hover:text-white'
                          title='Preview'
                        >
                          <Eye className='h-4 w-4' />
                        </Link>
                        <Link
                          href={`/admin/docs/edit/${doc._id}`}
                          className='cursor-pointer rounded-xl p-2 text-zinc-400 transition duration-150 hover:bg-zinc-800 hover:text-cyan-400'
                          title='Edit'
                        >
                          <Edit2 className='h-4 w-4' />
                        </Link>
                        <button
                          onClick={() => handleDeleteDoc(doc._id)}
                          className='cursor-pointer rounded-xl p-2 text-zinc-400 transition duration-150 hover:bg-zinc-800 hover:text-rose-400'
                          title='Delete'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
