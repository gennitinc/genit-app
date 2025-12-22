"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  UserPlus,
  TrendingUp,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { apiResponse } from "@/utils/apiResponse";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter } from "next/navigation";

interface JoinReferralCardProps {
  onJoinSuccess: () => void;
}

interface ChartBarProps {
  value: number;
  height: string;
  month: string;
  isDark: boolean;
}

function ChartBar({ value, height, month, isDark }: ChartBarProps) {
  return (
    <div className="group relative flex flex-col items-center space-y-1.5 sm:space-y-2 flex-1 min-w-0">
      <div
        className={`absolute top-2 hidden rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs group-hover:block z-10 whitespace-nowrap ${
          isDark
            ? "bg-gray-800 text-gray-100 border border-gray-700"
            : "bg-black text-white"
        }`}
      >
        {value}
      </div>
      <div
        className={`flex h-24 sm:h-32 w-full max-w-[20px] sm:max-w-[24px] items-end rounded-full group-hover:cursor-pointer mx-auto ${
          isDark ? "bg-gray-800" : "bg-slate-200"
        }`}
      >
        <div
          className={`${height} w-full rounded-full ${isDark ? "bg-blue-500" : "bg-blue-600"}`}
        />
      </div>
      <div
        className={`text-[10px] sm:text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        {month}
      </div>
    </div>
  );
}

export function JoinReferralCard({ onJoinSuccess }: JoinReferralCardProps) {
  const [joining, setJoining] = useState(false);
  const { theme } = useTheme();
  const { user } = useUserContext();
  const router = useRouter();
  const isDark = theme === "dark";

  const chartData = [
    { value: 10, height: "h-10", month: "Jan" },
    { value: 12, height: "h-8", month: "Feb" },
    { value: 20, height: "h-20", month: "Mar" },
    { value: 16, height: "h-16", month: "Apr" },
    { value: 8, height: "h-8", month: "May" },
    { value: 12, height: "h-12", month: "Jun" },
    { value: 8, height: "h-8", month: "Jul" },
    { value: 16, height: "h-16", month: "Aug" },
    { value: 12, height: "h-12", month: "Sep" },
    { value: 6, height: "h-6", month: "Oct" },
    { value: 16, height: "h-16", month: "Nov" },
    { value: 12, height: "h-12", month: "Dec" },
  ];

  const handleJoinReferralProgram = async () => {
    // Check if user is authenticated
    if (!user) {
      toast.info("Please sign in to join the referral program", {
        description: "Redirecting to sign in...",
      });
      router.push("/signin");
      return;
    }

    setJoining(true);
    try {
      const response = await apiResponse.post(
        "/referral/join",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Welcome to the Referral Program!", {
          description:
            "You've successfully joined. Start earning by sharing your referral link!",
        });
        onJoinSuccess();
      }
    } catch (error: any) {
      console.error("Failed to join referral program:", error);

      // Handle 401/403 errors - redirect to sign in
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Please sign in to join the referral program", {
          description: "Redirecting to sign in...",
        });
        router.push("/signin");
        return;
      }

      toast.error(
        error?.response?.data?.message ||
          "Failed to join referral program. Please try again."
      );
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl  flex flex-col mt-16 lg:mt-0 px-4 sm:px-6 lg:pl-8">
        <div className="relative isolate after:pointer-events-none lg:flex lg:pt-0 items-center  mx-auto">
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <div className="flex mt-6 sm:mt-8 justify-center lg:justify-start">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  <img
                    className={`inline-block h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-2 ${
                      isDark ? "ring-gray-800" : "ring-white"
                    }`}
                    src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <img
                    className={`inline-block h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-2 ${
                      isDark ? "ring-gray-800" : "ring-white"
                    }`}
                    src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <img
                    className={`inline-block h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-2 ${
                      isDark ? "ring-gray-800" : "ring-white"
                    }`}
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                    alt=""
                  />
                </div>
                <div
                  className={`text-[10px] sm:text-xs ml-3 sm:ml-4 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 ${
                    isDark
                      ? "text-purple-200 bg-purple-900/30"
                      : "text-purple-700 bg-purple-100"
                  }`}
                >
                  + 287
                </div>
              </div>
            </div>

            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl mt-5 font-semibold tracking-tight text-balance ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Affiliate Program
            </h2>
            <div>
              <p className="text-lg sm:text-lg lg:text-sm text-muted-foreground mt-2">
                Become an an affiliate and start earning, Get a unique referral
                link, QR code, and media kit to promote your profile
              </p>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 lg:justify-start">
              <Button
                onClick={handleJoinReferralProgram}
                disabled={joining}
                className={`rounded-md px-3.5 py-2.5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isDark
                    ? "bg-white text-black focus-visible:outline-white"
                    : "bg-gray-900 hover:bg-gray-800 focus-visible:outline-gray-900"
                }`}
                size="lg"
              >
                {joining ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    processing...
                  </>
                ) : (
                  "Become an affiliate"
                )}
              </Button>

              <Link
                href="/legal/terms-of-service"
                className={`text-sm/6 font-semibold hover:opacity-80 transition-opacity ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Read terms
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Link>
            </div>
          </div>
          <div className="h-fit w-full mt-8 lg:mt-0">
            <div className="relative flex flex-col items-center justify-center overflow-hidden py-4 sm:py-6 lg:py-12">
              <div
                className={`relative overflow-hidden rounded-xl sm:rounded-2xl border p-4 sm:p-5 py-3 pt-4 sm:pt-5 w-full md:w-fit max-w-md lg:max-w-xl ${
                  isDark
                    ? "bg-neutral-900 border-neutral-800"
                    : "bg-white border-gray-200"
                }`}
                id="widget"
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 sm:w-56 h-16 sm:h-24 bg-neutral-800 dark:bg-neutral-200 rounded-full -translate-y-8 sm:-translate-y-12 translate-x-8 sm:translate-x-12" />
                  <div className="absolute bottom-0 left-0 w-12 sm:w-16 h-12 sm:h-16 bg-neutral-800 dark:bg-neutral-200 rounded-full translate-y-6 sm:translate-y-8 -translate-x-6 sm:-translate-x-8" />
                </div>

                <div className="mb-6 sm:mb-8 flex items-center justify-between">
                  <div>
                    <div
                      className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      It's amazing!
                    </div>
                    <div
                      className={`text-lg sm:text-xl font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}
                    >
                      5 day streak
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl">🎉</div>
                </div>
                <div
                  className={`w-full border-t ${isDark ? "border-gray-800" : "border-gray-200"} -mx-4 sm:-mx-5 px-4 sm:px-5`}
                />
                <div className="relative -mt-3 flex space-x-3 sm:space-x-5 lg:space-x-8 overflow-x-auto pb-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border border-green-500 ${
                      isDark ? "bg-green-900/30" : "bg-green-100"
                    }`}
                  />
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border border-green-500 ${
                      isDark ? "bg-green-900/30" : "bg-green-100"
                    }`}
                  />
                </div>
                {/* <div className="mt-6 flex justify-between border-t border-gray-100 p-2">
                  
                </div> */}

                <div className={`w-full mt-6 sm:mt-3 rounded-xl`} id="widget">
                  <h6
                    className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Total earnings
                  </h6>
                  <div
                    className={`mt-2 flex text-lg sm:text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
                  >
                    <span>$256</span>
                    <span
                      className={`ml-2 flex items-center text-xs ${isDark ? "text-green-400" : "text-green-600"}`}
                    >
                      31%
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 11l5-5m0 0l5 5m-5-5v12"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-6 sm:mt-8 lg:mt-2 flex justify-between items-end w-full gap-1 sm:gap-2">
                    {chartData.map((data) => (
                      <ChartBar
                        key={data.month}
                        value={data.value}
                        height={data.height}
                        month={data.month}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8  md:mx-8 lg:mx-12 xl:mx-16 max-w-4xl lg:max-w-5xl">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
              How It Works
            </h2>
            <p className="text-sm md:text-lg lg:text-sm text-gray-500 dark:text-gray-400">
              Our referral process is simple and rewarding for everyone
              involved.
            </p>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex gap-3 sm:gap-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-lg lg:text-sm font-bold text-gray-600 dark:text-gray-400">
                  1
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-lg lg:text-sm font-normal text-gray-900 dark:text-white mb-1">
                  Share Your Referral Link
                </h3>
                <p className="text-sm md:text-lg lg:text-sm text-gray-500 dark:text-gray-400">
                  Get your unique referral link from your dashboard and share it
                  with friends, family, or on social media.
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 dark:bg-neutral-800 rounded-full flex   items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-lg lg:text-sm font-bold text-gray-600 dark:text-gray-400">
                  2
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-lg lg:text-sm font-normal text-gray-900 dark:text-white mb-1">
                  Friend signs up
                </h3>
                <p className="text-sm md:text-lg lg:text-sm text-gray-500 dark:text-gray-400">
                  When someone uses your referral link to create an account and
                  complete their profile, they become your referral.
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm sm:text-lg lg:text-sm font-normal text-gray-600 dark:text-gray-400">
                  3
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-lg lg:text-sm font-normal text-gray-900 dark:text-white mb-1">
                  Earn rewards
                </h3>
                <p className="text-sm md:text-lg lg:text-sm text-gray-500 dark:text-gray-400">
                  Once your referral makes their first subscription, you earn
                  rewards. The more referrals, the more you earn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
