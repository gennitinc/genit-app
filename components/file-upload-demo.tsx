"use client";
import { FileUpload } from "@/components/ui/file-upload";
import React, { useState } from "react";

export default function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  return (
    <div className='mx-auto min-h-96 w-full max-w-4xl rounded-lg border border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black'>
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}
