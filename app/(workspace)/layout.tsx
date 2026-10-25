import { WorkspaceLayout } from "@/components/layout/workspace-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <WorkspaceLayout>{children}</WorkspaceLayout>;
}
