"use client";

import { useState, useCallback } from "react";
import cookie from "@/node_modules/@types/js-cookie";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { apiResponse } from "@/utils/apiResponse";
import { useUserContext } from "@/context/AuthenticatedContext";

export const useAccountActions = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { setuser } = useUserContext();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const cleanupSession = useCallback(() => {
    cookie.remove("gennituToken");
    setuser(null);
  }, [setuser]);

  const signOut = useCallback(async () => {
    setIsSigningOut(true);
    let wasSuccessful = false;
    try {
      await apiResponse.get("/auth/logout");
      wasSuccessful = true;
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Failed to sign out:", error);
      toast({
        title: "Unable to sign out",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      cleanupSession();
      setIsSigningOut(false);
      router.push("/signin");
    }
    return wasSuccessful;
  }, [cleanupSession, router, toast]);

  const deleteAccount = useCallback(async () => {
    setIsDeletingAccount(true);
    let wasSuccessful = false;
    try {
      await apiResponse.post("/auth/close-account");
      toast({
        title: "Account deleted",
        description: "Your account has been removed.",
      });
      cleanupSession();
      router.push("/signin");
      wasSuccessful = true;
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast({
        title: "Unable to delete account",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAccount(false);
    }
    return wasSuccessful;
  }, [cleanupSession, router, toast]);

  return {
    signOut,
    deleteAccount,
    isSigningOut,
    isDeletingAccount,
  };
};
