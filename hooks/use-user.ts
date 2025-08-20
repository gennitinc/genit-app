"use client";
import { useQuery } from "@tanstack/react-query";
import { apiResponse } from "@/utils/apiResponse";
import cookie from "js-cookie";

const gennituToken = cookie.get("gennituToken");

export interface User {
  _id: any;
  username: string;
  email: string;
  password: string;
  //optional so i don't have to deal with errors right now :)
  metadata?: {
    userdp: string; // User display picture
    isCreator: boolean;
    coverPhotoUrl: string | null;
    about: string | null;
    socials: {
      linkedin: string | null;
      x: string | null;
      github: string | null;
      instagram: string | null;
    };
    activity: {
      following: number;
      followers: number;
      projects: number;
    };
  };
  teams: {
    projectId: string;
    role: "Owner" | "Editor" | "Viewer";
  }[];

  verificationToken?: string | null;
  verificationTokenExpiresAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpire?: Date;
  emailVerified: boolean;

  userPlan: "Starter" | "Premium" | "Team" | "Enterprise";
}

const fetchCurrentUser = async (): Promise<User> => {
  const response = await apiResponse.get("/user/active-user");

  if (response.status === 200 && response.data.user) {
    return response.data.user;
  } else {
    throw new Error("User data not found");
  }
};

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    enabled: !!gennituToken, // Only run query if token exists
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
