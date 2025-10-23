import Image from "next/image";
import {
  ArrowUpRight,
  Users,
  Briefcase,
  Zap,
  Trophy,
  Layers,
  Target,
  Clock,
  Globe,
  Award,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { HoverVideoPlayer } from "@/components/features/hover-video-player";

export default function About2() {
  return (
    <div className="dark:bg-black bg-white">
      <LandingNavbar />

      {/* Hero Section with Timeline */}
      <section className="relative py-24 md:py-32 px-4 lg:px-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background"></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/20%),transparent_80%)]"></div>

        <div className="mb-24">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6">
              <div className="inline-block w-max rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                The Gennit Story
              </div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                AI‑Powered {" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Design
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Gennit helps anyone create stunning promotional fliers and
                social graphics in seconds. Turn ideas into production‑ready
                visuals with AI prompts, smart templates, brand kits, and
                one‑click exports.
              </p>
              {/* <div className="flex flex-col gap-4 sm:flex-row pt-2">
                <Button
                  size="lg"
                  className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2"
                >
                  Our Services
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full">
                  Meet The Team
                </Button>
              </div> */}
            </div>
            {/* <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Image
                  src="/placeholder.svg"
                  alt="Company founding"
                  width={300}
                  height={400}
                  className="rounded-lg object-cover shadow-lg"
                />
                <Image
                  src="/placeholder.svg"
                  alt="Team collaboration"
                  width={300}
                  height={400}
                  className="rounded-lg object-cover shadow-lg"
                />
                <Image
                  src="/placeholder.svg"
                  alt="Modern office"
                  width={300}
                  height={400}
                  className="rounded-lg object-cover shadow-lg"
                />
                <Image
                  src="/placeholder.svg"
                  alt="Product development"
                  width={300}
                  height={400}
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl border bg-background p-5 shadow-lg dark:border-gray-800">
                <p className="font-bold text-lg">Est. 2008</p>
                <p className="text-sm text-muted-foreground">
                  15+ Years of Innovation
                </p>
              </div>
            </div> */}
            <div className="">
              <HoverVideoPlayer
                videoSrc="/demo-video.mp4"
                thumbnailSrc="https://alltopstartups.com/wp-content/uploads/2018/01/Tips-to-Create-Engaging-Video-Content-for-a-Startup.png"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <div className="dark:bg-black bg-white py-20">
        <div className="px-4 lg:px-10">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="inline-block w-max rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mx-auto mb-4">
              Our Design Principles
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Our Mission & Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              We make great design accessible. Our mission is to empower
              creators, marketers, and businesses to produce on‑brand,
              high‑impact graphics with AI—fast, consistent, and beautiful.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "AI at the Core",
                description:
                  "Intelligent prompts, layout suggestions, and auto‑branding deliver pro results with less effort.",
              },
              {
                icon: Layers,
                title: "On‑Brand by Default",
                description:
                  "Brand kits, reusable components, and smart templates keep every graphic consistent across teams.",
              },
              {
                icon: Globe,
                title: "Built for Speed",
                description:
                  "Create, iterate, and export in minutes with optimized workflows and one‑click publishing.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="flex flex-col rounded-lg bg-background p-6 shadow-sm border border-muted/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md group"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Features Section */}
      <div className="dark:bg-black bg-white py-20">
        <div className="px-4 lg:px-10">
          <div className="mb-16 text-center">
            <div className="inline-block w-max rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              Idea to Graphic in Seconds
            </div>
            <h2 className="text-3xl font-bold md:text-4xl mb-4">
              Supercharge Your <span className="text-primary">Design</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Our platform empowers teams to turn ideas into on‑brand
              graphics—fliers, social posts, banners, ads—using AI prompts,
              smart templates, and one‑click exports.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "AI Design Co‑Pilot",
                description:
                  "Generate layouts, typography, and color suggestions tailored to your brand and message.",
              },
              {
                icon: Zap,
                title: "Fast Exports",
                description:
                  "Export to PNG, JPG, SVG, and PDF—optimized for social, print, and ads in one click.",
              },
              {
                icon: Layers,
                title: "Smart Templates",
                description:
                  "Save time with curated templates for promos, events, product launches, and more.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col rounded-lg bg-muted/30 p-6 shadow-sm border border-muted/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md group"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      {/* <div className="dark:bg-black bg-white py-20">
        <div className="px-4 lg:px-10">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-block w-max rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                Our Results
              </div>
              <h2 className="text-3xl font-bold md:text-4xl">
                Measurable <span className="text-primary">Impact</span>
              </h2>
              <p className="mt-3 text-muted-foreground text-lg max-w-xl">
                Our success is defined by the tangible results we deliver to our
                clients across industries and technologies
              </p>
            </div>
            <Button variant="outline" className="rounded-full">
              View Case Studies
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {[
              {
                icon: Users,
                number: "5M+",
                text: "Active Users",
              },
              {
                icon: Briefcase,
                number: "15+",
                text: "Years Experience",
              },
              {
                icon: Zap,
                number: "987",
                text: "Projects Delivered",
              },
              {
                icon: Trophy,
                number: "250k+",
                text: "Daily Users",
              },
              {
                icon: Layers,
                number: "1.2M",
                text: "Data Points Daily",
              },
              {
                icon: Target,
                number: "99.9%",
                text: "Uptime",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg bg-muted/50 p-4 text-center border border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">{stat.number}</p>
                <p className="text-sm text-muted-foreground">{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Client Success Stories */}
      <div className="dark:bg-black bg-white py-20">
        <div className="px-4 lg:px-10">
          <div className="text-center mb-16">
            <div className="inline-block w-max rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mx-auto mb-4">
              Success Stories
            </div>
            <h2 className="text-3xl font-bold md:text-4xl mb-4">
              Transforming <span className="text-primary">Industries</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              See how our solutions have helped businesses across sectors
              achieve remarkable results
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-12">
            <div className="space-y-8 md:col-span-5">
              <div className="rounded-lg bg-muted/20 p-6 shadow-sm border border-muted/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/placeholder.svg"
                      alt="TechCorp logo"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-bold">TechCorp</p>
                      <p className="text-sm text-muted-foreground">
                        Software Industry
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Case Study
                  </div>
                </div>

                <blockquote className="mb-6 border-l-2 border-primary pl-4 italic">
                  "Their innovative approach completely transformed our
                  workflow, reducing project timelines by 40% while improving
                  quality across the board."
                </blockquote>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">
                      Chief Technology Officer
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    Read More
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-muted/20 p-6 shadow-sm border border-muted/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/placeholder.svg"
                      alt="TechCorp logo"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-bold">FinTech Global</p>
                      <p className="text-sm text-muted-foreground">
                        Financial Services
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Case Study
                  </div>
                </div>

                <blockquote className="mb-6 border-l-2 border-primary pl-4 italic">
                  "Gennit's security-first approach gave us confidence to
                  modernize our legacy systems without compromising customer
                  data integrity."
                </blockquote>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Michael Chen</p>
                    <p className="text-sm text-muted-foreground">
                      VP of Digital Transformation
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    Read More
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-8 md:col-span-7 md:grid-cols-2">
              <div className="flex flex-col rounded-lg bg-muted/20 p-6 shadow-sm border border-muted/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md">
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-full bg-accent px-2 py-1 text-xs font-medium text-white">
                    +30%
                  </div>
                  <p className="text-sm font-medium">Cost Reduction</p>
                </div>
                <p className="mb-4 text-muted-foreground">
                  Process optimization that slashed operational costs across
                  departments
                </p>
                <div className="mt-auto">
                  <Image
                    src="/placeholder.svg"
                    alt="Cost reduction chart"
                    width={300}
                    height={150}
                    className="rounded-md"
                  />
                </div>
              </div>

              <div className="flex flex-col rounded-lg bg-muted/20 p-6 shadow-sm border border-muted/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md">
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-blue-800">
                    +500%
                  </div>
                  <p className="text-sm font-medium">ROI Increase</p>
                </div>
                <p className="mb-4 text-muted-foreground">
                  First-year implementation yielding exceptional returns on
                  investment
                </p>
                <div className="mt-auto">
                  <Image
                    src="/placeholder.svg"
                    alt="ROI growth chart"
                    width={300}
                    height={150}
                    className="rounded-md"
                  />
                </div>
              </div>

              <div className="flex flex-col rounded-lg bg-muted/20 p-6 shadow-sm border border-muted/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md md:col-span-2">
                <p className="text-muted-foreground">
                  Trusted by industry leaders across technology, healthcare,
                  finance, and manufacturing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {/* <div className="dark:bg-black bg-white py-20">
        <div className="px-4 lg:px-10">
          <div className="overflow-hidden rounded-2xl bg-accent/30 p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="col-span-2">
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                  From Idea to App in Seconds
                </h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  Join thousands of developers and businesses who are
                  transforming their ideas into powerful applications with
                  unprecedented speed and efficiency.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" className="rounded-full">
                    Get Started Free
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full">
                    Book a Demo
                  </Button>
                </div>
              </div>
              <div className="relative col-span-1 hidden md:block">
                <Image
                  src="/placeholder.svg"
                  alt="Team collaboration"
                  width={500}
                  height={300}
                  className="rounded-lg object-cover"
                />
                <div className="absolute -bottom-4 -right-4 rounded-lg bg-background p-4 shadow-lg">
                  <p className="font-bold">24/7 Support</p>
                  <p className="text-sm text-muted-foreground">
                    Global team ready to help
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <LandingFooter />
    </div>
  );
}
