import React from "react";

export function FeatureHeroText() {
  return (
    <div>
      <div className='mb-4 text-sm font-bold tracking-wider text-orange-600 uppercase'></div>
      <div className='bg-indigo-600 hover:bg-indigo-700/10 text-primary mt-16 inline-block w-max rounded-full px-4 py-1.5 text-sm font-medium md:mt-5 lg:mt-0'>
        Build at scale, join now
      </div>
      <h1 className='text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl'>
        Community{" "}
        <span className='from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent'>
          of creators
        </span>
      </h1>
      <p className='mt-5 text-lg text-gray-700 dark:text-gray-300'>
        Whether you're launching new features or making improvements to existing
        functionality, product changelog makes it easy to keep your customers
        up-to-date on your progress.
      </p>
    </div>
  );
}
