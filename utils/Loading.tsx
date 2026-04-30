"use client";

import React from "react";

const Loading = () => {
  return (
    <div className='flex flex-col items-center gap-2 text-center'>
      <div className='loader mb-4'>
        <div className='box red delay1'></div>
        <div className='box'></div>
      </div>
    </div>
  );
};

export function LoadingFileLoader() {
  return (
    <div className='loader mb-4'>
      <div className='box red delay1'></div>
      <div className='box'></div>
    </div>
  );
}
export default Loading;
