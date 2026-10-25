"use client";

import { useUserContext } from "@/context/AuthenticatedContext";
import {
  ConnectUrlResponse,
  IntegrationConnection,
  IntegrationPlatform,
  MetaIdentitySummary,
  MetaSurface,
  disconnectIntegrationById,
  disconnectMetaIdentityById,
  effectiveIntegrationPlatform,
  fetchComposioToolkits,
  fetchIntegrations,
  requestConnectUrl,
  setPrimaryIntegrationById,
  updateIntegrationInboxSettings,
  updateTelegramSettings,
} from "@/lib/integrations-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export function integrationsQueryKey(orgId?: string) {
  return ["integrations", orgId || "none"] as const;
}

export function useComposioToolkits() {
  return useQuery({
    queryKey: ["composio-toolkits"],
    queryFn: fetchComposioToolkits,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export function useIntegrations() {
  const { user } = useUserContext();
  const currentOrg = user?.currentOrganization;
  const orgId =
    typeof currentOrg === "object" && currentOrg ? currentOrg._id : undefined;

  const query = useQuery({
    queryKey: integrationsQueryKey(orgId),
    queryFn: fetchIntegrations,
    enabled: Boolean(orgId),
    staleTime: 30_000,
  });

  const integrations: IntegrationConnection[] = query.data?.integrations ?? [];
  const identities: MetaIdentitySummary[] = query.data?.identities ?? [];

  // Group integrations by platform. Primary first, then by createdAt desc.
  const byPlatform = useMemo(() => {
    const map = new Map<IntegrationPlatform, IntegrationConnection[]>();
    for (const item of integrations) {
      const platform = effectiveIntegrationPlatform(item);
      for (const key of new Set([item.platform, platform])) {
        const list = map.get(key) ?? [];
        list.push(item);
        map.set(key, list);
      }
    }
    for (const list of map.values()) {
      list.sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return b.createdAt.localeCompare(a.createdAt);
      });
    }
    return map;
  }, [integrations]);

  // Identities indexed by surface so callers can pull "the identity for
  // Facebook" without scanning the array. Each Meta surface (facebook,
  // instagram, meta_ads, whatsapp) is fully independent.
  const identityBySurface = useMemo(() => {
    const map = new Map<MetaSurface, MetaIdentitySummary>();
    for (const id of identities) {
      map.set(id.surface, id);
    }
    return map;
  }, [identities]);

  return {
    orgId,
    integrations,
    identities,
    identityBySurface,
    byPlatform,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
    error: query.error,
  };
}

export function useDisconnectIntegration() {
  const qc = useQueryClient();
  const { user } = useUserContext();
  const currentOrg = user?.currentOrganization;
  const orgId =
    typeof currentOrg === "object" && currentOrg ? currentOrg._id : undefined;

  return useMutation({
    mutationFn: (id: string) => disconnectIntegrationById(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: integrationsQueryKey(orgId) });
      qc.removeQueries({ queryKey: ["connected-social-posts"] });
      qc.removeQueries({ queryKey: ["post-analytics"] });
      qc.invalidateQueries({ queryKey: ["social-posts"] });
      qc.invalidateQueries({ queryKey: ["social-post-stats"] });
    },
  });
}

export function useDisconnectMetaIdentity() {
  const qc = useQueryClient();
  const { user } = useUserContext();
  const currentOrg = user?.currentOrganization;
  const orgId =
    typeof currentOrg === "object" && currentOrg ? currentOrg._id : undefined;

  return useMutation({
    mutationFn: (id: string) => disconnectMetaIdentityById(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: integrationsQueryKey(orgId) });
      qc.removeQueries({ queryKey: ["connected-social-posts"] });
      qc.removeQueries({ queryKey: ["post-analytics"] });
      qc.invalidateQueries({ queryKey: ["social-posts"] });
      qc.invalidateQueries({ queryKey: ["social-post-stats"] });
    },
  });
}

export function useSetPrimaryIntegration() {
  const qc = useQueryClient();
  const { user } = useUserContext();
  const currentOrg = user?.currentOrganization;
  const orgId =
    typeof currentOrg === "object" && currentOrg ? currentOrg._id : undefined;

  return useMutation({
    mutationFn: (id: string) => setPrimaryIntegrationById(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: integrationsQueryKey(orgId) });
    },
  });
}

export function useUpdateTelegramSettings() {
  const qc = useQueryClient();
  const { user } = useUserContext();
  const currentOrg = user?.currentOrganization;
  const orgId =
    typeof currentOrg === "object" && currentOrg ? currentOrg._id : undefined;

  return useMutation({
    mutationFn: ({
      id,
      autoReplyEnabled,
    }: {
      id: string;
      autoReplyEnabled: boolean;
    }) => updateTelegramSettings(id, { autoReplyEnabled }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: integrationsQueryKey(orgId) });
    },
  });
}

export function useUpdateIntegrationInboxSettings() {
  const qc = useQueryClient();
  const { user } = useUserContext();
  const currentOrg = user?.currentOrganization;
  const orgId =
    typeof currentOrg === "object" && currentOrg ? currentOrg._id : undefined;

  return useMutation({
    mutationFn: ({
      id,
      autoReplyEnabled,
      commentAutoReplyEnabled,
      linkedInAuthorUrn,
    }: {
      id: string;
      autoReplyEnabled?: boolean;
      commentAutoReplyEnabled?: boolean;
      linkedInAuthorUrn?: string;
    }) =>
      updateIntegrationInboxSettings(id, {
        autoReplyEnabled,
        commentAutoReplyEnabled,
        linkedInAuthorUrn,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: integrationsQueryKey(orgId) });
    },
  });
}

export function useRequestConnectUrl() {
  const qc = useQueryClient();
  const { user } = useUserContext();
  const currentOrg = user?.currentOrganization;
  const orgId =
    typeof currentOrg === "object" && currentOrg ? currentOrg._id : undefined;

  return useMutation<ConnectUrlResponse, Error, IntegrationPlatform>({
    mutationFn: (platform) => requestConnectUrl(platform),
    onSuccess: (data) => {
      if (data.skipOAuth) {
        qc.invalidateQueries({ queryKey: integrationsQueryKey(orgId) });
      }
    },
  });
}
