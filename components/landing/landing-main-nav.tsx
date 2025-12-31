"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function LandingMainNav() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          <NavbarButton variant="secondary">Login</NavbarButton>
          <NavbarButton variant="primary">Book a call</NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          {/* <div className="flex w-full flex-col gap-4">
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Login
            </NavbarButton>
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              <span>Start for $0</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </NavbarButton>
          </div> */}
          <div className="flex gap-4">
            <Link
              className="outline-hidden relative items-center border justify-center select-none rounded-2xl disabled:cursor-not-allowed disabled:opacity-70 transition ease-in-out duration-200 bg-transparent border-transparent text-gray-9 [&_svg]:text-gray-9 hover:text-gray-10 focus-visible:ring-4 focus-visible:ring-gray-a2 focus-visible:outline-hidden text-sm h-10 gap-0 px-4 font-semibold hidden lg:flex"
              data-state="closed"
              href="/signin"
            >
              Sign in
            </Link>
            <Link
              className='outline-hidden text-foreground relative inline-flex items-center justify-center select-none rounded-2xl disabled:cursor-not-allowed ease-in-out border-[2px] border-white/5 backdrop-blur-[25px] bg-origin-border bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1)_100%)] shadow-sm not-disabled:hover:bg-white/90 not-disabled:hover:text-black not-disabled:hover:shadow-button transition-all duration-200 disabled:opacity-30 disabled:text-white/50 focus-visible:ring-4 focus-visible:ring-white/30 focus-visible:outline-hidden focus-visible:bg-white/90 focus-visible:text-black after:absolute after:w-[calc(100%+4px)] after:h-[calc(100%+4px)] after:top-[-2px] after:left-[-2px] after:rounded-[1rem] after:bg-[url("/static/texture-btn.png")] after:bg-repeat after:pointer-events-none text-sm h-10 gap-0 px-4 font-semibold'
              href="/signup"
            >
              <span>Start for $0</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
