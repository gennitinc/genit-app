"use client";

import SettingsHome from "@/components/user-settings/settingsHome";

function SettingsPage() {
  return (
    <div
      id='main-content'
      className='mr-2 ml-0 flex-1 rounded-t-2xl md:mr-4 lg:border-2 lg:border-b-0'
      style={{
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <SettingsHome />
    </div>
  );
}

export default SettingsPage;
