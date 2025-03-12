"use client";
import { useState, useEffect } from "react";

interface UseTabPermissionOptions {
  storageKey?: string;
  destinationUrl: string;
  promptOnFirstVisitOnly?: boolean;
}

export default function useTabPermission({
  storageKey = "hasVisitedBefore",
  destinationUrl,
  promptOnFirstVisitOnly = true,
}: UseTabPermissionOptions) {
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Check if this is the first visit or if we should always prompt
    const hasVisited = localStorage.getItem(storageKey);
    const shouldPrompt = !promptOnFirstVisitOnly || !hasVisited;

    if (shouldPrompt) {
      setShowPermissionDialog(true);

      if (promptOnFirstVisitOnly) {
        // Mark as visited for future visits
        localStorage.setItem(storageKey, "true");
      }
    }
  }, [storageKey, promptOnFirstVisitOnly]);

  const handleAccept = () => {
    // Open new tab when user accepts
    window.open(destinationUrl, "_blank");
    setShowPermissionDialog(false);
    setHasPermission(true);
  };

  const handleDecline = () => {
    // Just close the dialog when user declines
    setShowPermissionDialog(false);
    setHasPermission(false);
  };

  return {
    showPermissionDialog,
    setShowPermissionDialog,
    hasPermission,
    handleAccept,
    handleDecline,
  };
}
