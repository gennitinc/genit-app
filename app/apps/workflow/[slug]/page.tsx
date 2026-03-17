import GennittWorkflow from "@/components/workflow";
import React, { use } from "react";

const WorkflowProjectPage = ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const resolvedParams = use(params);

  return (
    <div>
      <GennittWorkflow slug={resolvedParams.slug} />
    </div>
  );
};

export default WorkflowProjectPage;
