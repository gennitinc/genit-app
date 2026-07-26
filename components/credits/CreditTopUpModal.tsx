"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiResponse } from "@/utils/apiResponse";
import React, { useEffect, useState } from "react";

const MIN_TOP_UP = 10;
const METER_MAX = 1000;
const MAX_TOP_UP = 999999.99;
const CREDITS_PER_USD = 50;

export default function CreditTopUpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(MIN_TOP_UP);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const amountCents = Math.round(amount * 100);
  const credits = Math.floor((amountCents * CREDITS_PER_USD) / 100);
  const isValidAmount =
    Number.isFinite(amount) &&
    amount >= MIN_TOP_UP &&
    amount <= MAX_TOP_UP &&
    Math.abs(amount * 100 - amountCents) < 0.001;

  useEffect(() => {
    if (!open) setAmount(MIN_TOP_UP);
  }, [open]);

  const handleSubmit = async () => {
    if (!isValidAmount) {
      toast({ title: "The minimum top up is $10", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const response = await apiResponse.post("/payment/top-up/create", {
        amount,
      });
      window.location.assign(response.data.checkoutUrl);
    } catch {
      setLoading(false);
      toast({
        title: "Could not start checkout",
        description: "Please check the amount and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Top up credits</DialogTitle>
          <DialogDescription>
            Choose how much to add. Every $1 gives you {CREDITS_PER_USD}{" "}
            credits.
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4 space-y-5'>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>Amount</span>
              <div className='relative w-32'>
                <span className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2'>
                  $
                </span>
                <Input
                  type='number'
                  min={MIN_TOP_UP}
                  max={MAX_TOP_UP}
                  step={0.01}
                  value={amount}
                  onChange={(event) => setAmount(Number(event.target.value))}
                  className='pl-7 text-right'
                  aria-label='Top up amount in US dollars'
                />
              </div>
            </div>
            <input
              type='range'
              min={MIN_TOP_UP}
              max={METER_MAX}
              step={1}
              value={Math.min(Math.max(amount, MIN_TOP_UP), METER_MAX)}
              onChange={(event) => setAmount(Number(event.target.value))}
              className='accent-primary w-full cursor-pointer'
              aria-label='Adjust top up amount'
            />
            <div className='text-muted-foreground flex justify-between text-xs'>
              <span>${MIN_TOP_UP}</span>
              <span>${METER_MAX.toLocaleString()}+</span>
            </div>
          </div>

          <div className='bg-muted/60 rounded-lg border p-4 text-center'>
            <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
              You receive
            </p>
            <p className='mt-1 text-3xl font-semibold'>
              {Number.isFinite(credits) && credits > 0
                ? credits.toLocaleString()
                : 0}
            </p>
            <p className='text-muted-foreground text-sm'>credits</p>
            <p className='text-muted-foreground mt-2 text-xs'>
              ${Number.isFinite(amount) ? amount.toLocaleString() : 0} ×{" "}
              {CREDITS_PER_USD} credits
            </p>
          </div>
          <p className='text-muted-foreground text-xs'>
            Credits are added automatically after Polar confirms payment.
          </p>
          <div className='flex justify-end gap-2'>
            <Button variant='ghost' onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !isValidAmount}>
              {loading
                ? "Redirecting..."
                : `Continue with $${amount.toLocaleString()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
