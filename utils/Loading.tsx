"use client";

import React from "react";

const Loading = () => {
  return (
    <div className="text-center flex flex-col gap-2 items-center">
      <div className="loader mb-4">
        <div className="box red delay1"></div>
        <div className="box"></div>
      </div>
    </div>
  );
};

export function LoadingFileLoader() {
  return (
    <div className="loader mb-4">
      <div className="box red delay1"></div>
      <div className="box"></div>
    </div>
  );
}
export default Loading;
