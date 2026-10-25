"use client";

import ReferralDashboard from "@/components/referral/referral-dashboard";

function ReferralPage() {
  return (
    <div
      id='main-content'
      className='border-b-none flex-1 rounded-t-2xl border-2'
      style={{
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <ReferralDashboard />
    </div>
  );
}

export default ReferralPage;
