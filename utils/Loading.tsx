"use client";

import React from "react";
// import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
  return (
    <div className="text-center flex flex-row items-center bg-white dark:bg-black">
      <>
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
      </>

      <span className="flex-none text-2xl lg:text-4xl animate-pulse font-semibold text-gray-300 dark:text-gray-200">
        Gennit
      </span>
    </div>
  );
};

export default Loading;
