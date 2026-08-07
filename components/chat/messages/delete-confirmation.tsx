"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";

interface DeleteConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  message?: string;
}

export function DeleteConfirmation({
  open,
  onOpenChange,
  onConfirm,
  message = "Are you sure you want to delete this? All versions after this will be deleted.",
}: DeleteConfirmationProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              <LocalizedText text={"Delete Message"} />
            </DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
            >
              <LocalizedText text={"Cancel"} />
            </Button>
            <Button
              variant='destructive'
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <LocalizedText text={"Delete Message"} />
          </DrawerTitle>
          <DrawerDescription>{message}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button
            variant='destructive'
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            <LocalizedText text={"Cancel"} />
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
