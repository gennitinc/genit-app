"use client";

import { LocalizedText } from "@/components/localized-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthenticatedContext";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import cookie from "js-cookie";
import { Building2, Loader2, MailWarning, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";

type InvitationStatus =
  "pending" | "accepted" | "declined" | "revoked" | "expired";

interface InvitationView {
  _id: string;
  email: string;
  role: string;
  status: InvitationStatus;
  organization: {
    _id: string;
    businessName: string;
    businessLogo?: string;
  };
  team: {
    _id: string;
    name: string;
    description?: string;
  };
  invitedBy: {
    _id: string;
    username: string;
    email: string;
    userdp?: string;
  };
  expiresAt?: string;
}

export default function AcceptInvitationPage() {
  const params = useParams();
  const router = useRouter();
  const token = String(params?.token || "");
  const { user, fetchCurrentUser } = useUserContext();

  const [invitation, setInvitation] = useState<InvitationView | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInvitation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiResponse.get(
        `/orgs/invitations/lookup/${token}`
      );
      setInvitation(data.invitation);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invitation not found");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadInvitation();
  }, [token, loadInvitation]);

  const isAuthed = !!cookie.get("genituToken") && !!user;
  const emailMatch =
    isAuthed &&
    invitation &&
    user!.email.toLowerCase() === invitation.email.toLowerCase();

  const handleAccept = async () => {
    if (!invitation) return;
    if (!isAuthed) {
      router.push(
        `/signin?redirect=${encodeURIComponent(`/invitations/${token}`)}`
      );
      return;
    }
    if (!emailMatch) {
      toast.error("This invitation was sent to a different email address");
      return;
    }
    setAccepting(true);
    try {
      const { data } = await apiResponse.post(
        `/orgs/invitations/${token}/accept`
      );
      toast.success(data?.message || "You're in!");
      await fetchCurrentUser();
      router.push("/");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Couldn't accept the invitation"
      );
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <main className='flex min-h-[80vh] items-center justify-center'>
        <LoadingFileLoader size={16} />
      </main>
    );
  }

  if (error || !invitation) {
    return (
      <main className='flex min-h-[80vh] items-center justify-center px-4'>
        <div className='max-w-md text-center'>
          <MailWarning className='text-muted-foreground mx-auto mb-3 h-10 w-10' />
          <h1 className='text-foreground text-xl font-semibold'>
            <LocalizedText text={"Invitation unavailable"} />
          </h1>
          <p className='text-muted-foreground mt-2 text-sm'>
            {error || "This invitation may have expired or been revoked."}
          </p>
          <Button className='mt-6' onClick={() => router.push("/")}>
            <LocalizedText text={"Go to genit"} />
          </Button>
        </div>
      </main>
    );
  }

  const statusBadCopy: Partial<Record<InvitationStatus, string>> = {
    accepted: "This invitation has already been accepted.",
    declined: "This invitation was declined.",
    revoked: "This invitation has been revoked.",
    expired: "This invitation has expired.",
  };
  const badStatus = statusBadCopy[invitation.status];

  return (
    <main className='flex min-h-[80vh] items-center justify-center px-4 py-12'>
      <div className='border-border w-full max-w-md rounded-lg border bg-white p-8 shadow-sm dark:bg-zinc-900'>
        <div className='flex flex-col items-center text-center'>
          <Avatar className='h-16 w-16 rounded-xl'>
            {invitation.organization.businessLogo ? (
              <AvatarImage
                src={invitation.organization.businessLogo}
                alt={invitation.organization.businessName}
                className='object-cover'
              />
            ) : null}
            <AvatarFallback className='rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 text-lg font-semibold text-white'>
              {invitation.organization.businessName.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <h1 className='text-foreground mt-4 text-2xl font-semibold'>
            <LocalizedText text={"You're invited to"} />
            {invitation.organization.businessName}
          </h1>
          <p className='text-muted-foreground mt-2 text-sm'>
            <span className='text-foreground font-medium'>
              {invitation.invitedBy.username}
            </span>{" "}
            <LocalizedText text={"invited you to join the"} />{" "}
            <span className='text-foreground font-medium'>
              {invitation.team.name}
            </span>{" "}
            <LocalizedText text={"team as"} />{" "}
            <span className='text-foreground font-medium'>
              {invitation.role}
            </span>
            .
          </p>

          <div className='border-border mt-6 grid w-full grid-cols-2 gap-3 rounded-lg border p-3 text-left'>
            <div>
              <p className='text-muted-foreground text-[10px] tracking-wider uppercase'>
                <LocalizedText text={"Organization"} />
              </p>
              <p className='text-foreground mt-0.5 flex items-center gap-1.5 text-sm'>
                <Building2 className='h-3.5 w-3.5 opacity-70' />
                {invitation.organization.businessName}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground text-[10px] tracking-wider uppercase'>
                <LocalizedText text={"Team"} />
              </p>
              <p className='text-foreground mt-0.5 flex items-center gap-1.5 text-sm'>
                <Users className='h-3.5 w-3.5 opacity-70' />
                {invitation.team.name}
              </p>
            </div>
          </div>

          {badStatus ? (
            <div className='mt-6 w-full rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200'>
              {badStatus}
            </div>
          ) : isAuthed && !emailMatch ? (
            <div className='mt-6 w-full rounded-lg border border-amber-200 bg-amber-50 p-3 text-left text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200'>
              <LocalizedText text={"You're signed in as"} />{" "}
              <span className='font-medium'>{user!.email}</span>{" "}
              <LocalizedText text={"but this invite was sent to"} />{" "}
              <span className='font-medium'>{invitation.email}</span>
              <LocalizedText text={". Sign in with that address to accept."} />
            </div>
          ) : null}

          <div className='mt-6 flex w-full flex-col gap-2'>
            <Button
              onClick={handleAccept}
              disabled={!!badStatus || accepting || (isAuthed && !emailMatch)}
              className='w-full'
            >
              {accepting ? <LoadingFileLoader size={16} /> : null}
              {isAuthed ? "Accept invitation" : "Sign in to accept"}
            </Button>
            {!isAuthed && (
              <Button
                variant='outline'
                onClick={() =>
                  router.push(
                    `/signup?redirect=${encodeURIComponent(
                      `/invitations/${token}`
                    )}&email=${encodeURIComponent(invitation.email)}`
                  )
                }
                className='w-full'
              >
                <LocalizedText text={"Create an account"} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
