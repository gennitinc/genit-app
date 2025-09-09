import React from 'react';

export function FeatureHeroText() {
    return (
      <div>
        <div className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-4"></div>
        <div className="inline-block w-max rounded-full bg-primary/10 mt-16 md:mt-5 lg:mt-0 px-4 py-1.5 text-sm font-medium text-primary">
          Build at scale, join now
        </div>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Community{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            of creators
          </span>
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mt-5">
          Whether you're launching new features or making improvements to
          existing functionality, product changelog makes it easy to keep your
          customers up-to-date on your progress.
        </p>
      </div>
    );
}