"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import { AlertTriangle, Loader2 } from "lucide-react";
import { ReactNode } from "react";

type ProjectActionModalProps = {
  open: boolean;
  title: string;
  description: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (projectId: string) => void | Promise<unknown>;
  onClose: () => void;
  loading?: boolean;
  variant?: "default" | "destructive";
  icon?: ReactNode;
};

export const ProjectActionModal = ({
  open,
  title,
  description,
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  loading,
  variant = "default",
  icon,
}: ProjectActionModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(value) => (!value ? onClose() : null)}>
      <DialogContent>
        <DialogHeader className='space-y-3'>
          <div className='flex items-center gap-3'>
            <span
              className={cn(
                "bg-muted flex h-10 w-10 items-center justify-center rounded-full",
                variant === "destructive" &&
                  "bg-destructive/15 text-destructive"
              )}
            >
              {icon || <AlertTriangle className='h-5 w-5' />}
            </span>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className='text-left'>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={() => onConfirm("")}
            disabled={loading}
            className='min-w-[120px]'
          >
            {loading ? <LoadingFileLoader size={20} /> : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectActionModal;
