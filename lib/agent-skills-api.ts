import { apiResponse } from "@/utils/apiResponse";

export type AgentSkill = {
  _id: string;
  orgId: string;
  name: string;
  description: string;
  instructions: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AgentSkillLimits = {
  perOrg: number;
  name: number;
  description: number;
  instructions: number;
};

export type AgentSkillInput = Partial<
  Pick<AgentSkill, "name" | "description" | "instructions" | "enabled">
> & {
  /** Text of a SKILL.md file; fields above override what it says. */
  markdown?: string;
};

export async function fetchAgentSkills(orgId: string) {
  const { data } = await apiResponse.get<{
    success: boolean;
    skills: AgentSkill[];
    canEdit: boolean;
    limits: AgentSkillLimits;
  }>(`/orgs/${orgId}/skills`);
  return data;
}

export async function createAgentSkill(
  orgId: string,
  payload: AgentSkillInput
) {
  const { data } = await apiResponse.post<{
    success: boolean;
    skill: AgentSkill;
  }>(`/orgs/${orgId}/skills`, payload);
  return data.skill;
}

export async function updateAgentSkill(
  orgId: string,
  skillId: string,
  payload: AgentSkillInput
) {
  const { data } = await apiResponse.patch<{
    success: boolean;
    skill: AgentSkill;
  }>(`/orgs/${orgId}/skills/${skillId}`, payload);
  return data.skill;
}

export async function deleteAgentSkill(orgId: string, skillId: string) {
  await apiResponse.delete(`/orgs/${orgId}/skills/${skillId}`);
}
