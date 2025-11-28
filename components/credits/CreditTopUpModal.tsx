"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiResponse } from "@/utils/apiResponse";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function CreditTopUpModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      // For now create a checkout session via the server
      const resp = await apiResponse.post("/payment/sub/create", {
        productId: "credit_topup_placeholder",
      });
      // If backend returns a checkoutUrl
      if (resp.data?.checkoutUrl) {
        window.location.href = resp.data.checkoutUrl;
      } else {
        toast({ title: "Failed to start checkout", variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setLoading(false);
      onClose();
      onSuccess && onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Top up credits</DialogTitle>
          <DialogDescription>
            Enter the USD amount you want to purchase and proceed to checkout.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <div>
            <Label>Amount (USD)</Label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 10"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : "Pay"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
