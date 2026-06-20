import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data & Integration Removal Instructions – Genit AI",
  description:
    "Step-by-step instructions for disconnecting your Facebook, Instagram, Meta Ads, Threads and other integrations from Genit AI and removing the data genit stored on your behalf.",
  robots: {
    index: true,
    follow: true,
  },
};

function AnchorIcon() {
  return (
    <span
      aria-hidden='true'
      className='text-slate-11 invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
    >
      <svg
        width={15}
        height={15}
        viewBox='0 0 15 15'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
          fill='currentColor'
          fillRule='evenodd'
          clipRule='evenodd'
        />
      </svg>
    </span>
  );
}

function SectionHeading({ id, label }: { id: string; label: string }) {
  return (
    <h2
      id={id}
      className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
    >
      <a href={`#${id}`} className='relative'>
        {label}
        <AnchorIcon />
      </a>
    </h2>
  );
}

const P_CLASS =
  "text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400";
const LIST_CLASS =
  "text-slate-11 my-5 list-disc space-y-2 pl-6 text-sm leading-7 text-neutral-600 dark:text-neutral-400";
const ORDERED_CLASS =
  "text-slate-11 my-5 list-decimal space-y-2 pl-6 text-sm leading-7 text-neutral-600 dark:text-neutral-400";
const LINK_CLASS =
  "border-slate-11 text-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out";
const STRONG_CLASS = "text-slate-12 font-semibold";

export default function RemovalInstructionsPage() {
  return (
    <div className='bg-white dark:bg-black'>
      <LandingNavbar />
      <div className='mx-auto w-full max-w-5xl space-y-8 px-6 py-16 md:max-w-7xl'>
        <div className='content mx-auto max-w-4xl'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight md:text-4xl lg:text-6xl'>
              Data & Integration{" "}
              <span className='from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent'>
                Removal
              </span>
            </h1>
            <p className='text-gray-9 mt-2 text-start text-sm leading-[1.6] font-normal text-neutral-600 dark:text-neutral-400'>
              Last update: <time dateTime='2026-05-17'>May 17th, 2026</time>
            </p>
          </div>

          <SectionHeading id='1-overview' label='1. Overview' />
          <p className={P_CLASS}>
            genit lets you connect third-party accounts — Facebook Pages,
            Instagram Business profiles, Meta Ads accounts, Threads profiles and
            others — so our agents can publish content, read engagement and pull
            insights on your behalf. You stay in control: every connection can
            be disconnected at any time, and you can request a full deletion of
            the data we have stored on your behalf.
          </p>
          <p className={P_CLASS}>
            This page tells you exactly how to do that. It covers three things:
          </p>
          <ul className={LIST_CLASS}>
            <li>How to disconnect a single integration from inside genit.</li>
            <li>
              How to revoke genit&apos;s access directly from the third-party
              platform (Facebook, Instagram, Meta Business, Threads, etc.).
            </li>
            <li>
              How to request a permanent deletion of any data we may still hold
              (e.g. cached account metadata, scheduled posts).
            </li>
          </ul>

          <SectionHeading
            id='2-remove-from-genit'
            label='2. Disconnect a single integration in genit'
          />
          <p className={P_CLASS}>
            The fastest way to remove an integration is from inside the genit
            app. We immediately delete the encrypted access token we hold for
            that target and stop any scheduled work that depends on it.
          </p>
          <ol className={ORDERED_CLASS}>
            <li>
              Sign in to genit at{" "}
              <a
                target='_blank'
                rel='noopener noreferrer'
                className={LINK_CLASS}
                href='https://trygenit.com'
              >
                trygenit.com
              </a>
              .
            </li>
            <li>
              Open{" "}
              <a className={LINK_CLASS} href='/integrations'>
                Integrations
              </a>{" "}
              from the navigation menu.
            </li>
            <li>
              Find the card for the platform you want to remove (Facebook,
              Instagram, Meta Ads, Threads, …) and click{" "}
              <strong className={STRONG_CLASS}>Manage</strong>.
            </li>
            <li>
              In the dialog, locate the specific{" "}
              <strong className={STRONG_CLASS}>Page</strong>,{" "}
              <strong className={STRONG_CLASS}>Instagram account</strong>,{" "}
              <strong className={STRONG_CLASS}>Ad account</strong> or{" "}
              <strong className={STRONG_CLASS}>Threads profile</strong> you want
              to unlink and click{" "}
              <strong className={STRONG_CLASS}>Disconnect</strong>, then{" "}
              <strong className={STRONG_CLASS}>Confirm</strong>.
            </li>
          </ol>
          <p className={P_CLASS}>
            Disconnecting one target does not affect the others. For example,
            you can remove a specific Facebook Page while keeping Instagram
            publishing connected.
          </p>

          <SectionHeading
            id='3-revoke-all-meta-access'
            label='3. Revoke all Meta access at once'
          />
          <p className={P_CLASS}>
            When you sign in with Meta, that single Meta login powers Facebook
            Pages, Instagram Business accounts and Meta Ads inside genit. If you
            want to wipe every Meta connection at once:
          </p>
          <ol className={ORDERED_CLASS}>
            <li>
              Open{" "}
              <a className={LINK_CLASS} href='/integrations'>
                Integrations
              </a>{" "}
              in genit.
            </li>
            <li>
              Click <strong className={STRONG_CLASS}>Manage</strong> on any Meta
              surface card (Facebook, Instagram, or Meta Ads).
            </li>
            <li>
              At the bottom of the dialog, click{" "}
              <strong className={STRONG_CLASS}>
                Revoke Meta access entirely
              </strong>
              , then confirm.
            </li>
          </ol>
          <p className={P_CLASS}>
            This removes every Facebook, Instagram and Meta Ads integration tied
            to your Meta identity for this organization, and deletes the
            encrypted token genit stored.
          </p>

          <SectionHeading
            id='4-revoke-from-facebook'
            label='4. Revoke from Facebook directly'
          />
          <p className={P_CLASS}>
            You can also revoke genit&apos;s access from your Meta account
            settings — this works even if you have lost access to genit.
          </p>
          <ol className={ORDERED_CLASS}>
            <li>
              Sign in to Facebook and go to{" "}
              <a
                target='_blank'
                rel='noopener noreferrer'
                className={LINK_CLASS}
                href='https://www.facebook.com/settings?tab=business_tools'
              >
                Settings → Business Integrations
              </a>
              .
            </li>
            <li>
              Find <strong className={STRONG_CLASS}>genit</strong> in the list
              of connected apps.
            </li>
            <li>
              Click <strong className={STRONG_CLASS}>Remove</strong>, then tick{" "}
              <em>
                &quot;Delete all posts, videos or events genit posted on your
                timeline.&quot;
              </em>{" "}
              if you also want to remove the content created via genit.
            </li>
            <li>
              Confirm by clicking{" "}
              <strong className={STRONG_CLASS}>Remove</strong>.
            </li>
          </ol>
          <p className={P_CLASS}>
            Facebook will instantly invalidate the access token. genit detects
            the revocation on the next request and marks the integration as{" "}
            <strong className={STRONG_CLASS}>revoked</strong> in your dashboard.
          </p>

          <SectionHeading
            id='5-revoke-from-instagram'
            label='5. Revoke from Instagram directly'
          />
          <p className={P_CLASS}>
            Instagram Business integrations live under the linked Facebook Page.
            To revoke them from Instagram&apos;s side:
          </p>
          <ol className={ORDERED_CLASS}>
            <li>
              Open the Instagram mobile app, go to your profile, tap{" "}
              <strong className={STRONG_CLASS}>
                Settings → Account → Apps and websites
              </strong>
              .
            </li>
            <li>
              Open the <strong className={STRONG_CLASS}>Active</strong> tab.
            </li>
            <li>
              Find <strong className={STRONG_CLASS}>genit</strong> and tap{" "}
              <strong className={STRONG_CLASS}>Remove</strong>.
            </li>
          </ol>
          <p className={P_CLASS}>
            Alternatively, revoking the parent Facebook Page connection (Step 4)
            automatically revokes Instagram access since the two share an access
            token.
          </p>

          <SectionHeading
            id='6-revoke-meta-ads'
            label='6. Revoke Meta Ads / Business Manager access'
          />
          <p className={P_CLASS}>
            To remove genit from your Meta Business Manager:
          </p>
          <ol className={ORDERED_CLASS}>
            <li>
              Go to{" "}
              <a
                target='_blank'
                rel='noopener noreferrer'
                className={LINK_CLASS}
                href='https://business.facebook.com/settings/apps'
              >
                business.facebook.com → Settings → Apps
              </a>
              .
            </li>
            <li>
              Select <strong className={STRONG_CLASS}>genit</strong> from the
              connected apps list.
            </li>
            <li>
              Click <strong className={STRONG_CLASS}>Remove</strong>, then
              confirm.
            </li>
          </ol>
          <p className={P_CLASS}>
            This severs genit&apos;s ability to read or write any ad accounts,
            campaigns or insights under your Business Manager.
          </p>

          <SectionHeading
            id='7-revoke-threads'
            label='7. Revoke Threads access'
          />
          <p className={P_CLASS}>
            Threads uses a separate OAuth flow from the rest of Meta, so it must
            be revoked independently.
          </p>
          <ol className={ORDERED_CLASS}>
            <li>
              Open the Threads app, go to your profile, tap the menu, then{" "}
              <strong className={STRONG_CLASS}>
                Settings → Account → Websites and apps
              </strong>
              .
            </li>
            <li>
              Find <strong className={STRONG_CLASS}>genit</strong> in the list
              of connected apps.
            </li>
            <li>
              Tap <strong className={STRONG_CLASS}>Remove</strong> to revoke the
              token.
            </li>
          </ol>
          <p className={P_CLASS}>
            You can also disconnect from inside genit by following Step 2 and
            selecting your Threads profile.
          </p>

          <SectionHeading
            id='8-data-deletion'
            label='8. Request a permanent data deletion'
          />
          <p className={P_CLASS}>
            Disconnecting an integration immediately deletes the encrypted
            access token we held for it. However, depending on what you used
            genit for, we may also have stored: cached account metadata (profile
            name, account id), the content of scheduled or published posts you
            composed, and aggregate engagement metrics fetched on your behalf.
          </p>
          <p className={P_CLASS}>
            To request a permanent deletion of all data genit holds for you:
          </p>
          <ol className={ORDERED_CLASS}>
            <li>
              Email{" "}
              <a
                className={LINK_CLASS}
                href='mailto:support@trygenit.com?subject=Data%20deletion%20request'
              >
                support@trygenit.com
              </a>{" "}
              from the email address associated with your genit account.
            </li>
            <li>
              In the subject line, write{" "}
              <strong className={STRONG_CLASS}>
                &quot;Data deletion request&quot;
              </strong>
              .
            </li>
            <li>
              In the body, tell us which connection(s) you want deleted, or say
              &quot;all data&quot; to delete everything.
            </li>
          </ol>
          <p className={P_CLASS}>
            We will confirm receipt within{" "}
            <strong className={STRONG_CLASS}>2 business days</strong> and
            complete the deletion within{" "}
            <strong className={STRONG_CLASS}>30 days</strong>, in line with our{" "}
            <a className={LINK_CLASS} href='/legal/privacy-policy'>
              Privacy Policy
            </a>
            . You will receive a confirmation email once the deletion is done.
          </p>

          <SectionHeading id='9-questions' label='9. Questions?' />
          <p className={P_CLASS}>
            If anything in these steps doesn&apos;t work for you, or if you
            can&apos;t find the genit entry in the third-party platform&apos;s
            settings, please reach us at{" "}
            <a className={LINK_CLASS} href='mailto:support@trygenit.com'>
              support@trygenit.com
            </a>{" "}
            and we&apos;ll help you complete the removal manually.
          </p>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
