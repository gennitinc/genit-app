import type { CSSProperties } from "react";

// Decorative dashed-line frame that sits on the edges of a container and fades
// out past its corners. The parent of <GradientFrame /> MUST be `relative` —
// the four lines anchor with `absolute` positioning relative to it.
//
// Usage:
//   <div className='relative bg-neutral-50 px-3 py-3 dark:bg-neutral-800'>
//     <GradientFrame />
//     ...content...
//   </div>
export function GradientFrame() {
  const horizontal = {
    "--background": "#ffffff",
    "--color": "rgba(0, 0, 0, 0.2)",
    "--height": "1px",
    "--width": "5px",
    "--fade-stop": "90%",
    "--offset": "200px",
    "--color-dark": "rgba(255, 255, 255, 0.2)",
    maskComposite: "exclude",
  } as CSSProperties;

  const vertical = {
    "--background": "#ffffff",
    "--color": "rgba(0, 0, 0, 0.2)",
    "--height": "5px",
    "--width": "1px",
    "--fade-stop": "90%",
    "--offset": "80px",
    "--color-dark": "rgba(255, 255, 255, 0.2)",
    maskComposite: "exclude",
  } as CSSProperties;

  return (
    <>
      {/* Top */}
      <div
        style={horizontal}
        className='absolute top-0 left-[calc(var(--offset)/2*-1)] z-30 h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask-composite:exclude] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]'
      />
      {/* Bottom */}
      <div
        style={horizontal}
        className='absolute top-auto bottom-0 left-[calc(var(--offset)/2*-1)] z-30 h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask-composite:exclude] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]'
      />
      {/* Left */}
      <div
        style={vertical}
        className='absolute top-[calc(var(--offset)/2*-1)] left-0 z-30 h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask-composite:exclude] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]'
      />
      {/* Right */}
      <div
        style={vertical}
        className='absolute top-[calc(var(--offset)/2*-1)] right-0 left-auto z-30 h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask-composite:exclude] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]'
      />
    </>
  );
}
