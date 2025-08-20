"use client";

import React from "react";
// import HashLoader from "react-spinners/HashLoader";
import { Grid } from "react-loader-spinner";

const Loading = () => {
  const [colorIndex, setColorIndex] = React.useState(0);

  return (
    <div className="text-center flex flex-row items-center gap-2">
      <span className="flex-none text-xl animate-pulse font-semibold text-gray-300 dark:text-gray-200">
        Gennit
      </span>

      <Grid
        visible={true}
        height="24"
        width="24"
        color="#25afff"
        ariaLabel="grid-loading"
        radius="12.5"
        wrapperStyle={{}}
        wrapperClass="grid-wrapper"
      />
    </div>
  );
};

export default Loading;
