"use client";

import { useUserContext } from "@/context/AuthenticatedContext";
import {
  disconnectIntegrationById,
  fetchIntegrations,
  IntegrationConnection,
  IntegrationPlatform,
} from "@/lib/integrations-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

  const byPlatform = new Map<IntegrationPlatform, IntegrationConnection>();
  for (const item of query.data ?? []) {
    if (!byPlatform.has(item.platform)) byPlatform.set(item.platform, item);
  }

  return {
    orgId,
    integrations: query.data ?? [],
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
