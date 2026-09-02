import YouTubeWorkflow from "@/components/youtube-workflow";
import React, { use } from "react";

const WorkflowProjectPage = ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const resolvedParams = use(params);

  return (
    <div>
      <YouTubeWorkflow slug={resolvedParams.slug} />
    </div>
  );
};

export default WorkflowProjectPage;
