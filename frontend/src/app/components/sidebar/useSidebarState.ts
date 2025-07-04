import { useState } from "react";

let _setState: ((mode: boolean) => void) | null = null;

export function useSidebarState() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  _setState = setSidebarOpen;
  return { sidebarOpen, setSidebarOpen };
}

export function forceUploadStateChange(state: boolean) {
  if (_setState) _setState(state);
}
