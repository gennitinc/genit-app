"use client";

export function MarketingRobot3D() {
  return (
    <div className='relative h-[460px] w-full overflow-hidden sm:h-[560px] lg:h-[620px]'>
      <iframe
        title='Interactive 3D robot'
        src='/api/spline-robot'
        loading='eager'
        allow='fullscreen'
        allowTransparency
        className='absolute inset-0 h-full w-full scale-[0.96] border-0 bg-transparent'
      />
    </div>
  );
}
