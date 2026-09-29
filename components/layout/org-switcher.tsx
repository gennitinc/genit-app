"use client";

import { BrandData } from "@/app/(auth)/onboarding/_components/types";
import { BrandOnboardingDialog } from "@/components/chat/messages/brand-onboarding-dialog";
import { LocalizedText } from "@/components/localized-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import AccountActionModal from "@/components/user/account-action-modal";
import {
  Organization,
  Team,
  useUserContext,
} from "@/context/AuthenticatedContext";
import { useAccountActions } from "@/hooks/use-account-actions";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import {
  BadgeCheck,
  Check,
  ChevronsUpDown,
  CreditCard,
  DoorOpen,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Moon,
  Plus,
  Sun,
  Trash2,
  User as UserIcon,
  UserMinus,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCallback, useMemo, useState } from "react";

type CreateMode = "team" | null;

export function OrgSwitcher({
  forceExpanded,
}: { forceExpanded?: boolean } = {}) {
  const { isMobile, state } = useSidebar();
  const {
    user,
    switchOrganization,
    createOrganization,
    deleteOrganization,
    createTeam,
    inviteToTeam,
    leaveTeam,
    fetchTeamsForOrg,
  } = useUserContext();
  const { theme, setTheme } = useTheme();
  const { signOut, isSigningOut } = useAccountActions();
  const router = useRouter();

  const canCreateOrg = !!user?.userPlan && user.userPlan !== "Basic";

  const [createMode, setCreateMode] = useState<CreateMode>(null);
  const [createOrgId, setCreateOrgId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [teamsByOrg, setTeamsByOrg] = useState<Record<string, Team[]>>({});
  const [loadingTeamsFor, setLoadingTeamsFor] = useState<string | null>(null);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteContext, setInviteContext] = useState<{
    orgId: string;
    teamId: string;
    teamName: string;
  } | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Lead" | "Member" | "Viewer">(
    "Member"
  );
  const [inviting, setInviting] = useState(false);

  const isCollapsed = forceExpanded
    ? false
    : !isMobile && state === "collapsed";

  const isOwnerOf = useCallback(
    (org: Organization) => !!user?._id && org.owner === user._id,
    [user?._id]
  );

  const [leaveContext, setLeaveContext] = useState<{
    orgId: string;
    teamId: string;
    teamName: string;
  } | null>(null);
  const [leaving, setLeaving] = useState(false);

  const [orgOnboardingOpen, setOrgOnboardingOpen] = useState(false);
  const [deleteContext, setDeleteContext] = useState<Organization | null>(null);
  const [deleting, setDeleting] = useState(false);

  const socialsFromBrand = (socials: BrandData["socials"]) =>
    Object.entries(socials)
      .filter(([, url]) => !!url?.trim())
      .map(([platform, url]) => ({ platform, url: url!.trim() }));

  const handleCreateOrgFromOnboarding = async (data: BrandData) => {
    const org = await createOrganization({
      businessName: data.businessName?.trim() || "New workspace",
      businessBio: data.businessBio || undefined,
      businessLogo: data.brandLogo || undefined,
      businessWebsite: data.companyWebsite || undefined,
      industry: data.industry || undefined,
      brandColors: data.brandColors,
      primaryColor: data.primaryColor || undefined,
      secondaryColor: data.secondaryColor || undefined,
      fontHeadline: data.fontHeadline || undefined,
      fontBody: data.fontBody || undefined,
      aboutUs: data.aboutUs || undefined,
      mission: data.mission || undefined,
      vision: data.vision || undefined,
      slogan: data.slogan || undefined,
      values: data.values,
      voiceTone: data.voiceTone,
      socialMediaUrls: socialsFromBrand(data.socials),
    });
    if (org) {
      toast.success(`Created ${org.businessName}`);
      setOrgOnboardingOpen(false);
    }
  };

  const organizations = useMemo<Organization[]>(() => {
    const list = user?.allOrganizations || [];
    if (list.length > 0) return list;
    return user?.business && typeof user.business === "object"
      ? [user.business as Organization]
      : [];
  }, [user]);

  const current: Organization | null = useMemo(() => {
    if (
      user?.currentOrganization &&
      typeof user.currentOrganization === "object"
    ) {
      return user.currentOrganization;
    }
    return organizations[0] || null;
  }, [user?.currentOrganization, organizations]);

  const handleSwitch = useCallback(
    async (orgId: string) => {
      if (!orgId || orgId === current?._id) return;
      setSwitchingId(orgId);
      try {
        await switchOrganization(orgId);
        window.location.reload();
      } catch {
        toast.error("Couldn't switch organization");
      } finally {
        setSwitchingId(null);
      }
    },
    [current?._id, switchOrganization]
  );

  const handleDeleteOrganization = async () => {
    if (!deleteContext) return;
    setDeleting(true);
    try {
      await deleteOrganization(deleteContext._id);
      toast.success(`Deleted ${deleteContext.businessName}`);
      setDeleteContext(null);
      window.location.reload();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Couldn't delete organization"
      );
    } finally {
      setDeleting(false);
    }
  };

  const loadTeams = useCallback(
    async (orgId: string) => {
      if (teamsByOrg[orgId]) return;
      setLoadingTeamsFor(orgId);
      try {
        const teams = await fetchTeamsForOrg(orgId);
        setTeamsByOrg((prev) => ({ ...prev, [orgId]: teams }));
      } finally {
        setLoadingTeamsFor(null);
      }
    },
    [fetchTeamsForOrg, teamsByOrg]
  );

  const openCreateTeam = (orgId: string) => {
    setCreateMode("team");
    setCreateOrgId(orgId);
    setName("");
    setDescription("");
  };

  const openInvite = (orgId: string, teamId: string, teamName: string) => {
    setInviteContext({ orgId, teamId, teamName });
    setInviteEmail("");
    setInviteRole("Member");
    setInviteOpen(true);
  };

  const handleLeaveTeam = async () => {
    if (!leaveContext) return;
    setLeaving(true);
    try {
      const result = await leaveTeam(leaveContext.orgId, leaveContext.teamId);
      // Drop the team locally so the submenu reflects it without a refetch.
      setTeamsByOrg((prev) => ({
        ...prev,
        [leaveContext.orgId]: (prev[leaveContext.orgId] || []).filter(
          (t) => t._id !== leaveContext.teamId
        ),
      }));
      toast.success(
        result?.leftOrganization
          ? `You've left ${leaveContext.teamName} and the organization`
          : `You've left ${leaveContext.teamName}`
      );
      setLeaveContext(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Couldn't leave the team"
      );
    } finally {
      setLeaving(false);
    }
  };

  const handleSubmitInvite = async () => {
    if (!inviteContext) return;
    const email = inviteEmail.trim().toLowerCase();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      toast.error("Enter a valid email");
      return;
    }
    setInviting(true);
    try {
      await inviteToTeam(inviteContext.orgId, inviteContext.teamId, {
        email,
        role: inviteRole,
      });
      toast.success(`Invitation sent to ${email}`);
      setInviteOpen(false);
      setInviteContext(null);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Couldn't send invitation";
      toast.error(msg);
    } finally {
      setInviting(false);
    }
  };

  const handleSubmitCreate = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      if (createMode === "team" && createOrgId) {
        const team = await createTeam(createOrgId, {
          name: name.trim(),
          description: description.trim() || undefined,
        });
        if (team) {
          setTeamsByOrg((prev) => ({
            ...prev,
            [createOrgId]: [...(prev[createOrgId] || []), team],
          }));
          toast.success(`Created team ${team.name}`);
        }
      }
      setCreateMode(null);
      setCreateOrgId(null);
    } catch (err: any) {
      if (err?.code === "UPGRADE_REQUIRED") {
        toast.error(err.message, {
          action: {
            label: "Upgrade",
            onClick: () => router.push("/pricing"),
          },
        });
        setCreateMode(null);
      } else {
        toast.error("Couldn't create team");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const orgInitial = (org: Organization | null) =>
    (org?.businessName || "W").slice(0, 1).toUpperCase();

  const dropdownSide = isMobile ? "top" : "top";

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size={isCollapsed ? "sm" : "lg"}
                className={cn(
                  "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
                  isCollapsed ? "justify-center !px-2" : "w-full",
                  forceExpanded && "!h-12 !w-full !justify-start !px-2"
                )}
              >
                <Avatar
                  className={cn(
                    "rounded-md",
                    isCollapsed ? "h-7 w-7" : "h-8 w-8"
                  )}
                >
                  {current?.businessLogo ? (
                    <AvatarImage
                      src={current.businessLogo}
                      alt={current?.businessName || "Organization"}
                      className='bg-white object-contain'
                    />
                  ) : null}
                  <AvatarFallback className='rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-semibold text-white'>
                    {orgInitial(current)}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <>
                    <div className='ml-2 grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>
                        {current?.businessName || "Create workspace"}
                      </span>
                      <span className='text-muted-foreground truncate text-xs'>
                        {user?.username || user?.email}
                      </span>
                    </div>
                    <ChevronsUpDown className='ml-auto h-4 w-4 opacity-60' />
                  </>
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align='start'
              side={dropdownSide}
              sideOffset={8}
              className='border-border bg-popover text-popover-foreground w-72 rounded-lg'
            >
              {user && (
                <DropdownMenuLabel className='p-0 font-normal'>
                  <Link
                    href={`/creator/${user.username}`}
                    className='hover:bg-accent flex items-center gap-2 rounded-md p-2 transition-colors'
                  >
                    <Avatar className='h-9 w-9'>
                      <AvatarImage
                        src={user.userdp}
                        alt={user.username}
                        className='object-cover'
                      />
                      <AvatarFallback>{user.username?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className='flex min-w-0 flex-col'>
                      <span className='truncate text-sm font-medium'>
                        {user.username}
                      </span>
                      <span className='text-muted-foreground truncate text-xs'>
                        {user.email}
                      </span>
                    </div>
                  </Link>
                </DropdownMenuLabel>
              )}

              <DropdownMenuSeparator className='bg-border' />

              <DropdownMenuLabel className='text-muted-foreground text-xs'>
                <LocalizedText text={"Organizations"} />
              </DropdownMenuLabel>

              {organizations.length === 0 && (
                <div className='text-muted-foreground px-2 py-3 text-xs'>
                  <LocalizedText text={"No organizations yet."} />
                </div>
              )}

              {organizations.map((org) => {
                const isActive = current?._id === org._id;
                const userOwnsOrg = isOwnerOf(org);
                return (
                  <DropdownMenuSub key={org._id}>
                    <DropdownMenuSubTrigger
                      onMouseEnter={() => loadTeams(org._id)}
                      className='focus:bg-accent focus:text-accent-foreground gap-2'
                    >
                      <Avatar className='h-6 w-6 rounded-md'>
                        {org.businessLogo ? (
                          <AvatarImage
                            src={org.businessLogo}
                            alt={org.businessName}
                            className='bg-white object-contain'
                          />
                        ) : null}
                        <AvatarFallback className='rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 text-[10px] font-semibold text-white'>
                          {orgInitial(org)}
                        </AvatarFallback>
                      </Avatar>
                      <span className='flex-1 truncate'>
                        {org.businessName}
                      </span>
                      {switchingId === org._id ? (
                        <LoadingFileLoader size={20} />
                      ) : isActive ? (
                        <Check className='h-3 w-3 opacity-70' />
                      ) : null}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className='border-border bg-popover text-popover-foreground w-60 rounded-lg'>
                      <DropdownMenuItem
                        onSelect={() => handleSwitch(org._id)}
                        disabled={isActive}
                        className='focus:bg-accent focus:text-accent-foreground'
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isActive ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {isActive ? "Current organization" : "Switch to this"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className='bg-border' />
                      <DropdownMenuLabel className='text-muted-foreground text-xs'>
                        <LocalizedText text={"Teams"} />
                      </DropdownMenuLabel>
                      {loadingTeamsFor === org._id ? (
                        <div className='text-muted-foreground flex items-center px-2 py-1.5 text-xs'>
                          <LoadingFileLoader size={20} />
                        </div>
                      ) : (teamsByOrg[org._id] || []).length === 0 ? (
                        <div className='text-muted-foreground px-2 py-1.5 text-xs'>
                          <LocalizedText text={"No teams yet"} />
                        </div>
                      ) : (
                        (teamsByOrg[org._id] || []).map((team) => {
                          const isOnTeam = (team.members || []).some(
                            (m) => m.user === user?._id
                          );
                          if (userOwnsOrg) {
                            return (
                              <DropdownMenuItem
                                key={team._id}
                                onSelect={(e) => {
                                  e.preventDefault();
                                  openInvite(org._id, team._id, team.name);
                                }}
                                className='focus:bg-accent focus:text-accent-foreground'
                              >
                                <Users className='mr-2 h-4 w-4 opacity-70' />
                                <span className='flex-1 truncate'>
                                  {team.name}
                                </span>
                                <Mail className='ml-2 h-3.5 w-3.5 opacity-50' />
                              </DropdownMenuItem>
                            );
                          }
                          return (
                            <DropdownMenuItem
                              key={team._id}
                              onSelect={(e) => {
                                e.preventDefault();
                                if (isOnTeam) {
                                  setLeaveContext({
                                    orgId: org._id,
                                    teamId: team._id,
                                    teamName: team.name,
                                  });
                                }
                              }}
                              disabled={!isOnTeam}
                              className='focus:bg-accent focus:text-accent-foreground'
                            >
                              <Users className='mr-2 h-4 w-4 opacity-70' />
                              <span className='flex-1 truncate'>
                                {team.name}
                              </span>
                              {isOnTeam && (
                                <DoorOpen className='ml-2 h-3.5 w-3.5 opacity-50' />
                              )}
                            </DropdownMenuItem>
                          );
                        })
                      )}
                      {userOwnsOrg && (
                        <>
                          <DropdownMenuSeparator className='bg-border' />
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              openCreateTeam(org._id);
                            }}
                            className='focus:bg-accent focus:text-accent-foreground'
                          >
                            <Plus className='mr-2 h-4 w-4' />
                            <LocalizedText text={"Create team"} />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              setDeleteContext(org);
                            }}
                            className='text-destructive focus:bg-destructive/10 focus:text-destructive'
                          >
                            <Trash2 className='mr-2 h-4 w-4' />
                            <LocalizedText text={"Delete organization"} />
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                );
              })}

              {canCreateOrg ? (
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setOrgOnboardingOpen(true);
                  }}
                  className='focus:bg-accent focus:text-accent-foreground'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  <LocalizedText text={"Create organization"} />
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    router.push("/pricing");
                    toast.info("Upgrade to create more organizations");
                  }}
                  className='focus:bg-accent focus:text-accent-foreground'
                >
                  <Lock className='mr-2 h-4 w-4 opacity-70' />
                  <span className='flex-1'>
                    <LocalizedText text={"Create organization"} />
                  </span>
                  <span className='ml-2 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 px-1.5 py-0.5 text-[9px] font-semibold text-white'>
                    <LocalizedText text={"PRO"} />
                  </span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className='bg-border' />

              <DropdownMenuGroup>
                {user && (
                  <DropdownMenuItem
                    asChild
                    className='focus:bg-accent focus:text-accent-foreground'
                  >
                    <Link href={`/creator/${user.username}`}>
                      <UserIcon className='mr-2 h-4 w-4' />
                      <LocalizedText text={"View profile"} />
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  asChild
                  className='focus:bg-accent focus:text-accent-foreground'
                >
                  <Link href='/user/settings'>
                    <BadgeCheck className='mr-2 h-4 w-4' />
                    <LocalizedText text={"Account"} />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className='focus:bg-accent focus:text-accent-foreground'
                >
                  <Link href='/user/settings?tab=billing'>
                    <CreditCard className='mr-2 h-4 w-4' />
                    <LocalizedText text={"Billing"} />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className='bg-border' />

              <DropdownMenuItem
                className='focus:bg-accent focus:text-accent-foreground'
                onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className='mr-2 h-4 w-4' />
                    <LocalizedText text={"Switch to light mode"} />
                  </>
                ) : (
                  <>
                    <Moon className='mr-2 h-4 w-4' />
                    <LocalizedText text={"Switch to dark mode"} />
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className='focus:bg-accent focus:text-accent-foreground'
                onSelect={(event) => {
                  event.preventDefault();
                  setIsSignOutModalOpen(true);
                }}
              >
                <LogOut className='mr-2 h-4 w-4' />
                <LocalizedText text={"Log out"} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog
        open={createMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCreateMode(null);
            setCreateOrgId(null);
          }
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              <LocalizedText text={"Create team"} />
            </DialogTitle>
            <DialogDescription>
              <LocalizedText
                text={"Teams group members inside this organization."}
              />
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-3 py-2'>
            <div className='space-y-1.5'>
              <Label htmlFor='switcher-name'>
                <LocalizedText text={"Team name"} />
              </Label>
              <Input
                id='switcher-name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Design Team'
                autoFocus
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='switcher-desc'>
                <LocalizedText text={"Description (optional)"} />
              </Label>
              <Input
                id='switcher-desc'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='What this team works on'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setCreateMode(null);
                setCreateOrgId(null);
              }}
              disabled={submitting}
            >
              <LocalizedText text={"Cancel"} />
            </Button>
            <Button
              onClick={handleSubmitCreate}
              disabled={!name.trim() || submitting}
            >
              {submitting ? <LoadingFileLoader size={20} /> : null}
              <LocalizedText text={"Create"} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={inviteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setInviteOpen(false);
            setInviteContext(null);
          }
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              <LocalizedText text={"Invite to"} />
              {inviteContext?.teamName || "team"}
            </DialogTitle>
            <DialogDescription>
              <LocalizedText
                text={
                  "They'll receive an email invitation. If they don't have a genit account yet, they can create one with this address."
                }
              />
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-3 py-2'>
            <div className='space-y-1.5'>
              <Label htmlFor='invite-email'>
                <LocalizedText text={"Email address"} />
              </Label>
              <Input
                id='invite-email'
                type='email'
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder='teammate@company.com'
                autoFocus
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='invite-role'>
                <LocalizedText text={"Role"} />
              </Label>
              <Select
                value={inviteRole}
                onValueChange={(v) =>
                  setInviteRole(v as "Lead" | "Member" | "Viewer")
                }
              >
                <SelectTrigger id='invite-role'>
                  <SelectValue placeholder='Select a role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Lead'>
                    <LocalizedText text={"Lead — can manage the team"} />
                  </SelectItem>
                  <SelectItem value='Member'>
                    <LocalizedText text={"Member — can collaborate"} />
                  </SelectItem>
                  <SelectItem value='Viewer'>
                    <LocalizedText text={"Viewer — read-only"} />
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setInviteOpen(false);
                setInviteContext(null);
              }}
              disabled={inviting}
            >
              <LocalizedText text={"Cancel"} />
            </Button>
            <Button
              onClick={handleSubmitInvite}
              disabled={!inviteEmail.trim() || inviting}
            >
              {inviting ? (
                <LoadingFileLoader size={20} />
              ) : (
                <Mail className='mr-2 h-4 w-4' />
              )}
              <LocalizedText text={"Send invitation"} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AccountActionModal
        open={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={signOut}
        loading={isSigningOut}
        title='Sign out?'
        description="You'll be signed out of your session on this device."
        confirmLabel='Sign out'
      />

      <AccountActionModal
        open={!!deleteContext}
        onClose={() => setDeleteContext(null)}
        onConfirm={handleDeleteOrganization}
        loading={deleting}
        title={`Delete ${deleteContext?.businessName || "organization"}?`}
        description="This permanently deletes the organization and removes every member's access. This can't be undone."
        confirmLabel='Delete organization'
      />

      <AccountActionModal
        open={!!leaveContext}
        onClose={() => setLeaveContext(null)}
        onConfirm={handleLeaveTeam}
        loading={leaving}
        title={`Leave ${leaveContext?.teamName || "team"}?`}
        description="You'll lose access to this team's work. If it's your only team in the organization, you'll be removed from the organization too."
        confirmLabel='Leave team'
      />

      <BrandOnboardingDialog
        open={orgOnboardingOpen}
        onOpenChange={setOrgOnboardingOpen}
        mode='create-org'
        onCreateOrg={handleCreateOrgFromOnboarding}
      />
    </>
  );
}
