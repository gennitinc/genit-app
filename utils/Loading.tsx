"use client";

import React from "react";
// import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
  return (
    <div className="text-center flex flex-col gap-2 items-center">
      {/* <>
        <div className="page">
          <span className="loading" />
        </div>

        <style jsx>{`
          .page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .loading {
            width: 30px;
            height: 30px;
            display: inline-block;
            background-color: white;
            margin: 10px;
            animation-duration: 4s;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            animation-name: loadingAnimation;
          }

          @keyframes loadingAnimation {
            0% {
              border-radius: 50% 50% 50% 50%;
              transform: rotate(0deg);
            }

            12.5% {
              border-radius: 0% 50% 50% 50%;
              background-color: rgb(255, 0, 0);
            }

            25% {
              border-radius: 0% 0% 50% 50%;
              transform: rotate(90deg);
            }

            37.5% {
              border-radius: 0% 0% 0% 50%;
              background-color: chocolate;
            }

            50% {
              border-radius: 0% 0% 0% 0%;
              transform: rotate(180deg);
            }

            62.5% {
              border-radius: 50% 0% 0% 0%;
              background-color: gold;
            }

            75% {
              border-radius: 50% 50% 0% 0%;
              transform: rotate(270deg);
            }

            87.5% {
              border-radius: 50% 50% 50% 0%;
            }

            100% {
              border-radius: 50% 50% 50% 50%;
              transform: rotate(360deg);
            }
          }
        `}</style>
      </> */}

      <div className="loader mb-4 size-10">
        <div className="box red delay1"></div>
        <div className="box"></div>
      </div>
      {/* 
      <span className="flex-none text-2xl lg:text-4xl animate-pulse font-semibold text-gray-300 dark:text-gray-200">
        Gennit
      </span> */}
    </div>
  );
};

export function LoadingFileLoader() {
  return (
    // <div className="loader-con">
    //   {Array.from({ length: 6 }).map((_, i) => (
    //     <div
    //       key={i}
    //       className="pfile"
    //       style={{ "--i": i } as React.CSSProperties}
    //     />
    //   ))}
    // </div>
    <div className="loader mb-4">
      <div className="box red delay1"></div>
      <div className="box"></div>
    </div>
  );
}
export default Loading;
