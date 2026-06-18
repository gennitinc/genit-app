"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, ExternalLink, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

const logos = [
  {
    svg: (
      <svg
        preserveAspectRatio='xMidYMid'
        viewBox='0 -25 256 256'
        width='48'
        height='48'
        className='transition-all duration-300 group-hover:scale-110'
      >
        <path
          fill='#EA4335'
          d='m170.252 56.819 22.253-22.253 1.483-9.37C153.437-11.677 88.976-7.496 52.42 33.92 42.267 45.423 34.734 59.764 30.717 74.573l7.97-1.123 44.505-7.34 3.436-3.513c19.797-21.742 53.27-24.667 76.128-6.168l7.496.39Z'
        />
        <path
          fill='#4285F4'
          d='M224.205 73.918a100.249 100.249 0 0 0-30.217-48.722l-31.232 31.232a55.515 55.515 0 0 1 20.379 44.037v5.544c15.35 0 27.797 12.445 27.797 27.796 0 15.352-12.446 27.485-27.797 27.485h-55.671l-5.466 5.934v33.34l5.466 5.231h55.67c39.93.311 72.553-31.494 72.864-71.424a72.303 72.303 0 0 0-31.793-60.453'
        />
        <path
          fill='#34A853'
          d='M71.87 205.796h55.593V161.29H71.87a27.275 27.275 0 0 1-11.399-2.498l-7.887 2.42-22.409 22.253-1.952 7.574c12.567 9.489 27.9 14.825 43.647 14.757'
        />
        <path
          fill='#FBBC05'
          d='M71.87 61.425C31.94 61.664-.237 94.228.001 134.159a72.301 72.301 0 0 0 28.222 56.88l32.248-32.246c-13.99-6.322-20.208-22.786-13.887-36.776 6.32-13.99 22.786-20.208 36.775-13.888a27.796 27.796 0 0 1 13.887 13.888l32.248-32.248A72.224 72.224 0 0 0 71.87 61.425'
        />
      </svg>
    ),
    name: "Google Cloud",
    alt: "google cloud",
    url: "https://cloud.google.com/",
    description: "Service Provider",
  },
  {
    svg: (
      <svg
        preserveAspectRatio='xMidYMid'
        viewBox='0 0 256 260'
        width='48'
        height='48'
        className='transition-all duration-300 group-hover:scale-110'
      >
        <path
          fill='#fff'
          d='M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z'
        />
      </svg>
    ),
    name: "Open AI",
    alt: "Open ",
    url: "https://openai.com/",
    description: "Service Partner",
  },
  {
    svg: (
      <svg
        viewBox='0 0 256 222'
        xmlns='http://www.w3.org/2000/svg'
        preserveAspectRatio='xMidYMid'
        height='48'
        width='48'
        className='transition-all duration-300 group-hover:scale-110 dark:invert'
      >
        <path fill='#000000' d='m128 0 128 221.705H0z' />
      </svg>
    ),
    name: "Vercel",
    alt: "Vercel Logo",
    url: "https://vercel.com",
    description: "Service Provider",
  },
  {
    svg: (
      <svg
        viewBox='0 0 19 19'
        fill='none'
        height='48'
        width='48'
        className='transition-all duration-300 group-hover:scale-110'
      >
        <path
          d='M18.367 7.28888V1.59755C18.367 0.986819 17.8715 0.5 17.2699 0.5H11.5812C10.6877 0.5 9.80295 0.677018 8.98017 1.01336C8.15738 1.35856 7.40539 1.85424 6.77724 2.49152L6.733 2.53578C5.90137 3.37664 5.30862 4.42108 5.00781 5.57174C5.54749 5.43012 6.10483 5.35931 6.6622 5.35046C8.14852 5.33276 9.60831 5.81073 10.7938 6.7047C11.8643 7.50131 12.6783 8.59885 13.1206 9.86458C13.5807 11.148 13.6337 12.5465 13.2887 13.8653C14.43 13.5644 15.4828 12.9714 16.3233 12.1393L16.3675 12.0951C16.9957 11.4667 17.4999 10.7143 17.845 9.89114C18.19 9.06797 18.3581 8.18285 18.3581 7.28888H18.367Z'
          fill='#18E299'
        />
        <path
          d='M4.83793 7.193C4.84674 5.44706 5.54303 3.77167 6.76814 2.51953L2.03511 7.25472C2.01749 7.27236 1.99985 7.28117 1.98222 7.29881C0.827615 8.44513 0.131342 9.97945 0.0167623 11.6019C-0.0890033 13.1186 0.307609 14.6176 1.15373 15.8698C1.23444 15.9892 1.45343 16.0285 1.57682 15.9139L4.47656 13.0216C5.38438 12.1134 5.66643 10.7642 5.23455 9.55618C4.96132 8.80666 4.82912 8.00424 4.83793 7.193Z'
          fill='#0C8C5E'
        />
        <path
          d='M16.341 12.0938C15.4332 12.9844 14.2962 13.6016 13.0623 13.875C11.8195 14.1483 10.5327 14.0689 9.33405 13.6457C9.33405 13.6457 9.32522 13.6457 9.31641 13.6457C8.10892 13.2136 6.76042 13.4958 5.8526 14.3952L2.95282 17.2875C2.82943 17.4109 2.84706 17.6137 2.99689 17.7107C4.24845 18.5484 5.74683 18.954 7.26281 18.8482C8.88455 18.7336 10.4093 18.037 11.5639 16.8818L11.608 16.8378L16.341 12.1026V12.0938Z'
          fill='#0C8C5E'
        />
      </svg>
    ),
    name: "Mintlify",
    alt: "polar",
    url: "https://www.mintlify.com/",
    description: "Service Provider",
  },
  {
    svg: (
      <svg
        fill='none'
        viewBox='0 0 300 300'
        height='48'
        width='48'
        className='transition-all duration-300 group-hover:scale-110'
      >
        <g clipPath='url(#polar_sh_dark__a)'>
          <path
            fill='#fff'
            fillRule='evenodd'
            d='M66.428 274.26c68.448 46.333 161.497 28.406 207.83-40.041 46.335-68.448 28.408-161.497-40.04-207.83C165.77-19.946 72.721-2.019 26.388 66.428-19.948 134.878-2.02 227.928 66.427 274.26ZM47.956 116.67c-17.119 52.593-11.412 105.223 11.29 139.703C18.04 217.361 7.275 150.307 36.943 92.318c18.971-37.082 50.622-62.924 85.556-73.97-31.909 18.363-59.945 53.466-74.544 98.322Zm127.391 166.467c36.03-10.531 68.864-36.752 88.338-74.815 29.416-57.497 19.083-123.905-21.258-163.055 21.793 34.496 27.046 86.275 10.204 138.02-15.016 46.134-44.246 81.952-77.284 99.85Zm8.28-16.908c24.318-20.811 44.389-55.625 53.308-97.439 14.098-66.097-4.384-127.592-41.823-148.113 19.858 26.718 29.91 78.613 23.712 136.656-4.739 44.391-18.01 83.26-35.197 108.896ZM63.717 131.844c-14.201 66.586 4.66 128.501 42.657 148.561-20.378-26.396-30.777-78.891-24.498-137.694 4.661-43.657 17.574-81.974 34.349-107.614-23.957 20.886-43.687 55.392-52.507 96.747Zm136.117 17.717c1.074 67.912-20.244 123.317-47.612 123.748-27.369.433-50.425-54.27-51.498-122.182-1.073-67.913 20.244-123.318 47.613-123.75 27.368-.432 50.425 54.271 51.497 122.184Z'
            clipRule='evenodd'
          />
        </g>
        <defs>
          <clipPath id='polar_sh_dark__a'>
            <path fill='#fff' d='M0 0h300v300H0z' />
          </clipPath>
        </defs>
      </svg>
    ),
    name: "Polar",
    alt: "polar",
    url: "https://polar.sh",
    description: "Service Provider",
  },
  {
    svg: (
      <svg
        xmlSpace='preserve'
        viewBox='0 0 304 182'
        height='48'
        width='48'
        className='transition-all duration-300 group-hover:scale-110'
      >
        <path
          fill='#ffffff'
          d='m86 66 2 9c0 3 1 5 3 8v2l-1 3-7 4-2 1-3-1-4-5-3-6c-8 9-18 14-29 14-9 0-16-3-20-8-5-4-8-11-8-19s3-15 9-20c6-6 14-8 25-8a79 79 0 0 1 22 3v-7c0-8-2-13-5-16-3-4-8-5-16-5l-11 1a80 80 0 0 0-14 5h-2c-1 0-2-1-2-3v-5l1-3c0-1 1-2 3-2l12-5 16-2c12 0 20 3 26 8 5 6 8 14 8 25v32zM46 82l10-2c4-1 7-4 10-7l3-6 1-9v-4a84 84 0 0 0-19-2c-6 0-11 1-15 4-3 2-4 6-4 11s1 8 3 11c3 2 6 4 11 4zm80 10-4-1-2-3-23-78-1-4 2-2h10l4 1 2 4 17 66 15-66 2-4 4-1h8l4 1 2 4 16 67 17-67 2-4 4-1h9c2 0 3 1 3 2v2l-1 2-24 78-2 4-4 1h-9l-4-1-1-4-16-65-15 64-2 4-4 1h-9zm129 3a66 66 0 0 1-27-6l-3-3-1-2v-5c0-2 1-3 2-3h2l3 1a54 54 0 0 0 23 5c6 0 11-2 14-4 4-2 5-5 5-9l-2-7-10-5-15-5c-7-2-13-6-16-10a24 24 0 0 1 5-34l10-5a44 44 0 0 1 20-2 110 110 0 0 1 12 3l4 2 3 2 1 4v4c0 3-1 4-2 4l-4-2c-6-2-12-3-19-3-6 0-11 0-14 2s-4 5-4 9c0 3 1 5 3 7s5 4 11 6l14 4c7 3 12 6 15 10s5 9 5 14l-3 12-7 8c-3 3-7 5-11 6l-14 2z'
        />
        <path
          d='M274 144A220 220 0 0 1 4 124c-4-3-1-6 2-4a300 300 0 0 0 263 16c5-2 10 4 5 8z'
          fill='#f90'
        />
        <path
          d='M287 128c-4-5-28-3-38-1-4 0-4-3-1-5 19-13 50-9 53-5 4 5-1 36-18 51-3 2-6 1-5-2 5-10 13-33 9-38z'
          fill='#f90'
        />
      </svg>
    ),
    name: "Amazon Cld",
    alt: "AWS",
    url: "https://aws.amazon.com/",
    description: "Service Platform",
  },
];

export default function PartnerLogos() {
  const router = useRouter();
  return (
    <section className='px-2 py-16 md:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='relative overflow-hidden'>
          <div className='border-muted relative z-20 grid overflow-hidden border shadow-lg lg:grid-cols-2'>
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

            <div className='flex items-center px-6 py-12 md:px-8 lg:p-16'>
              <div className='w-full max-w-lg'>
                <Badge className='bg-primary/10 text-primary mb-6 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium'>
                  <Globe className='h-4 w-4' />
                  Strategic Partnerships
                </Badge>
                <h2 className='mb-6 text-3xl font-bold tracking-tight lg:text-4xl'>
                  Powered by industry-leading technologies
                </h2>
                <p className='text-normal text-muted-foreground mb-8 text-base'>
                  We collaborate with the most innovative companies in tech to
                  deliver cutting-edge solutions that keep you ahead of the
                  competition. Our strategic partnerships ensure you get the
                  best tools for your needs.
                </p>
                <div className='flex flex-col gap-4 sm:flex-row'>
                  <Button
                    className='group flex cursor-pointer items-center rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white transition-all duration-300 hover:bg-primary/90 hover:pr-4 focus:ring-4 focus:ring-primary/30 focus:outline-none dark:focus:ring-primary/40'
                    onClick={() => {
                      router.push("/contact");
                    }}
                  >
                    Become a partner
                    <ArrowRight className='size-4 transition-transform duration-300 group-hover:translate-x-1' />
                  </Button>
                  <Button
                    variant='outline'
                    className='group flex cursor-not-allowed items-center gap-2'
                    disabled={true}
                  >
                    <CheckCircle className='size-4' />
                    View case studies
                  </Button>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 border-t lg:grid-cols-3 lg:border-t-0 lg:border-l'>
              {logos.map((logo, index) => (
                <a
                  key={index}
                  href={logo.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group hover:bg-muted/30 flex flex-col items-center justify-center gap-3 border-r border-b p-8 transition-all'
                >
                  <div className='relative flex h-16 w-full items-center justify-center'>
                    {logo.svg}
                  </div>
                  <div className='flex flex-col items-center text-center'>
                    <span className='text-foreground text-base font-semibold'>
                      {logo.name}
                    </span>
                    <span className='text-muted-foreground group-hover:text-primary text-sm transition-colors'>
                      {logo.description}
                    </span>
                  </div>
                  <div className='text-primary mt-1 flex items-center text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100'>
                    <span>Learn more</span>
                    <ExternalLink className='ml-1 h-3 w-3' />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
