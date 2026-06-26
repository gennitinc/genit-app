import { apiResponse } from "@/utils/apiResponse";

export async function enhancePromptText(prompt: string): Promise<string> {
  const { data } = await apiResponse.post<{ prompt: string }>(
    "/project/enhance-prompt",
    { prompt },
    { timeout: 30_000 }
  );
  return data.prompt;
}
