import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default layout;
