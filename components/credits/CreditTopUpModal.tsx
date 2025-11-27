"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiResponse } from "@/utils/apiResponse";
import { useToast } from "@/hooks/use-toast";

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-background rounded-lg p-6 z-10 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Top up credits</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Enter the amount you want to purchase.
        </p>
        <div className="space-y-3">
          <div>
            <Label>Amount (USD)</Label>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
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
      </div>
    </div>
  );
}
