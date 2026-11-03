"use client";

import { useIntegrations } from "@/hooks/use-integrations";
import {
  type CampaignRecipient,
  getCampaignOutreach,
  getGtmAttribution,
  getGtmCampaign,
  listGtmCampaigns,
} from "@/lib/gtm-api";
import { listSocialPostsPage } from "@/lib/social-posts-api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

/**
 * Query keys are scoped by org and campaign so every campaign surface (list,
 * detail tabs, post editor picker) shares one cache and invalidates together.
 */
export const campaignKeys = {
  all: (orgId?: string) => ["gtm_campaigns", orgId || "none"] as const,
  options: (orgId?: string) => [...campaignKeys.all(orgId), "options"] as const,
  detail: (orgId: string | undefined, id: string) =>
    [...campaignKeys.all(orgId), "detail", id] as const,
  attribution: (orgId: string | undefined, id: string) =>
    [...campaignKeys.detail(orgId, id), "attribution"] as const,
  outreach: (
    orgId: string | undefined,
    id: string,
    page: number,
    status: string
  ) => [...campaignKeys.detail(orgId, id), "outreach", page, status] as const,
  posts: (orgId: string | undefined, id: string) =>
    [...campaignKeys.detail(orgId, id), "posts"] as const,
};

/** Lightweight list for pickers such as "Add this post to a campaign". */
export function useCampaignOptions(enabled = true) {
  const { orgId } = useIntegrations();
  return useQuery({
    queryKey: campaignKeys.options(orgId),
    queryFn: async () =>
      (await listGtmCampaigns({ page: 1, limit: 50 })).campaigns.map(
        ({ _id, name, status }) => ({ _id, name, status })
      ),
    enabled: Boolean(orgId) && enabled,
    staleTime: 60_000,
  });
}

export function useCampaign(id: string) {
  const { orgId } = useIntegrations();
  return useQuery({
    queryKey: campaignKeys.detail(orgId, id),
    queryFn: () => getGtmCampaign(id),
    enabled: Boolean(orgId && id),
  });
}

export function useCampaignAttribution(id: string, enabled = true) {
  const { orgId } = useIntegrations();
  return useQuery({
    queryKey: campaignKeys.attribution(orgId, id),
    queryFn: () => getGtmAttribution(id),
    enabled: Boolean(orgId && id) && enabled,
  });
}

export function useCampaignOutreach(
  id: string,
  page: number,
  status: CampaignRecipient["status"] | "all",
  enabled = true
) {
  const { orgId } = useIntegrations();
  return useQuery({
    queryKey: campaignKeys.outreach(orgId, id, page, status),
    queryFn: () => getCampaignOutreach(id, { page, status }),
    enabled: Boolean(orgId && id) && enabled,
    placeholderData: keepPreviousData,
  });
}

export function useCampaignPosts(id: string, enabled = true) {
  const { orgId } = useIntegrations();
  return useQuery({
    queryKey: campaignKeys.posts(orgId, id),
    queryFn: () => listSocialPostsPage({ campaignId: id, limit: 50 }),
    enabled: Boolean(orgId && id) && enabled,
  });
}
