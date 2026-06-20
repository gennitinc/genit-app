import React from "react";

const ContactCtaLanding = () => {
  return (
    <div className='relative overflow-hidden'>
      <section className='relative z-20 mx-auto my-20 grid w-full max-w-7xl grid-cols-1 justify-start bg-gradient-to-br from-gray-100 to-white md:my-20 md:grid-cols-3 dark:from-neutral-900 dark:to-neutral-950'>
        {/* Top gradient line */}
        <div
          style={
            {
              // @ts-ignore
              "--background": "#ffffff",
              "--color": "rgba(0, 0, 0, 0.2)",
              "--height": "1px",
              "--width": "5px",
              "--fade-stop": "90%",
              "--offset": "200px",
              "--color-dark": "rgba(255, 255, 255, 0.2)",
              // @ts-ignore
              maskComposite: "exclude",
            } as React.CSSProperties
          }
          className='absolute top-0 left-[calc(var(--offset)/2*-1)] z-30 h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask-composite:exclude] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]'
        ></div>

        {/* Bottom gradient line */}
        <div
          style={
            {
              // @ts-ignore
              "--background": "#ffffff",
              "--color": "rgba(0, 0, 0, 0.2)",
              "--height": "1px",
              "--width": "5px",
              "--fade-stop": "90%",
              "--offset": "200px",
              "--color-dark": "rgba(255, 255, 255, 0.2)",
              // @ts-ignore
              maskComposite: "exclude",
            } as React.CSSProperties
          }
          className='absolute top-auto bottom-0 left-[calc(var(--offset)/2*-1)] z-30 h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask-composite:exclude] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]'
        ></div>

        {/* Left gradient line */}
        <div
          style={
            {
              // @ts-ignore
              "--background": "#ffffff",
              "--color": "rgba(0, 0, 0, 0.2)",
              "--height": "5px",
              "--width": "1px",
              "--fade-stop": "90%",
              "--offset": "80px",
              "--color-dark": "rgba(255, 255, 255, 0.2)",
              // @ts-ignore
              maskComposite: "exclude",
            } as React.CSSProperties
          }
          className='absolute top-[calc(var(--offset)/2*-1)] left-0 z-30 h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask-composite:exclude] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]'
        ></div>

        {/* Right gradient line */}
        <div
          style={
            {
              // @ts-ignore
              "--background": "#ffffff",
              "--color": "rgba(0, 0, 0, 0.2)",
              "--height": "5px",
              "--width": "1px",
              "--fade-stop": "90%",
              "--offset": "80px",
              "--color-dark": "rgba(255, 255, 255, 0.2)",
              // @ts-ignore
              maskComposite: "exclude",
            } as React.CSSProperties
          }
          className='absolute top-[calc(var(--offset)/2*-1)] right-0 left-auto z-30 h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask-composite:exclude] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]'
        ></div>

        {/* Hero/main left-side content */}
        <div className='p-8 md:col-span-2 md:p-14'>
          <h2 className='text-left text-xl font-medium tracking-tight text-neutral-500 md:text-3xl dark:text-neutral-200'>
            Ready to create stunning AI-generated images and videos?{" "}
            <span className='font-bold text-black dark:text-white'>
              Get started today
            </span>
          </h2>
          <p className='mt-4 max-w-lg text-left text-base font-medium tracking-tight text-neutral-500 md:text-base dark:text-neutral-200'>
            We've helped thousands of{" "}
            <span className='text-sky-700'>creators and businesses</span>{" "}
            generate professional media content with AI, and we can help you
            too.
          </p>
          <div className='flex flex-col items-start sm:flex-row sm:items-center sm:gap-4'>
            <div className='mt-6 flex justify-center'>
              <a className='group relative z-20 flex h-10 w-full cursor-pointer items-center justify-center space-x-2 rounded-lg bg-black p-px px-4 py-2 text-center text-sm font-semibold text-white no-underline transition duration-200 sm:w-44 dark:bg-white dark:text-black'>
                Start creating
              </a>
            </div>
          </div>
        </div>

        {/* Right-side testimonial */}
        <div className='border-t border-dashed p-8 md:border-t-0 md:border-l md:p-14'>
          <p className='text-base text-neutral-700 dark:text-neutral-200'>
            genit transformed how we create content. The AI-generated images and
            videos are incredibly professional, and we've cut our design time by
            80%. It's like having a design team at your fingertips.
          </p>
          <div className='mt-4 flex flex-col items-start gap-1 text-sm'>
            <p className='font-bold text-neutral-800 dark:text-neutral-200'>
              Chris Xael
            </p>
            <p className='text-neutral-500 dark:text-neutral-400'>
              Advisory Board Member
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactCtaLanding;
