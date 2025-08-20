"use client";

import { useProjectContext } from "@/context/Chat-Context";

export function useChatInterfaceActions() {
  const {
    isLiveMode,
    isMobile,
    isDrawerOpen,
    setLiveMode,
    setDrawerOpen,
    toggleDrawer,
  } = useProjectContext();

  const handleModeChange = (isLive: boolean) => {
    setLiveMode(isLive);
  };

  const handleDrawerToggle = () => {
    toggleDrawer();
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return {
    // State
    isLiveMode,
    isMobile,
    isDrawerOpen,
    handleModeChange,
    handleDrawerToggle,
    handleDrawerClose,
  };
}
