"use client";

import { useUserContext } from "@/context/AuthenticatedContext";
import {
  ConnectUrlResponse,
  disconnectIntegrationById,
  disconnectMetaIdentityById,
  fetchIntegrations,
  IntegrationConnection,
  IntegrationPlatform,
  MetaIdentitySummary,
  MetaSurface,
  requestConnectUrl,
  setPrimaryIntegrationById,
} from "@/lib/integrations-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export function integrationsQueryKey(orgId?: string) {
  return ["integrations", orgId || "none"] as const;
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
      const list = map.get(item.platform) ?? [];
      list.push(item);
      map.set(item.platform, list);
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
