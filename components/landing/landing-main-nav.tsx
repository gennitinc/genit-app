"use client";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  NavItems,
  Navbar,
  NavbarButton,
  NavbarLogo,
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
        <div className='flex items-center gap-4'>
          <NavbarButton variant='secondary'>Login</NavbarButton>
          <NavbarButton variant='primary'>Book a call</NavbarButton>
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
              className='relative text-neutral-600 dark:text-neutral-300'
            >
              <span className='block'>{item.name}</span>
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
          <div className='flex gap-4'>
            <Link
              className='text-gray-9 [&_svg]:text-gray-9 hover:text-gray-10 focus-visible:ring-gray-a2 relative hidden h-10 items-center justify-center gap-0 rounded-lg border border-transparent bg-transparent px-4 text-sm font-semibold outline-hidden transition duration-200 ease-in-out select-none focus-visible:ring-4 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-70 lg:flex'
              data-state='closed'
              href='/signin'
            >
              Sign in
            </Link>
            <Link
              className='text-foreground not-disabled:hover:shadow-button relative inline-flex h-10 items-center justify-center gap-0 rounded-lg border-[2px] border-white/5 bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1)_100%)] bg-origin-border px-4 text-sm font-semibold shadow-sm outline-hidden backdrop-blur-[25px] transition-all duration-200 ease-in-out select-none after:pointer-events-none after:absolute after:top-[-2px] after:left-[-2px] after:h-[calc(100%+4px)] after:w-[calc(100%+4px)] after:rounded-[1rem] after:bg-[url("/static/texture-btn.png")] after:bg-repeat not-disabled:hover:bg-white/90 not-disabled:hover:text-black focus-visible:bg-white/90 focus-visible:text-black focus-visible:ring-4 focus-visible:ring-white/30 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:text-white/50 disabled:opacity-30'
              href='/signup'
            >
              <span>Start for $0</span>
              <ArrowRight className='ml-1 h-4 w-4' />
            </Link>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
