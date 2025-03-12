"use client";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BrowserPermissionHandler() {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Check if permission has been requested before
    const hasRequested = localStorage.getItem("hasRequestedNativePermission");

    if (!hasRequested) {
      // Show our custom dialog first
      setShowDialog(true);
    }
  }, []);

  const handleRequestPermission = () => {
    // Close our dialog
    setShowDialog(false);

    // Set flag to remember we've asked
    localStorage.setItem("hasRequestedNativePermission", "true");

    // First try to request notification permission
    // This creates a native browser permission dialog
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);

        // Now try to open a popup, which will trigger the popup blocker
        // This needs to happen in the same user gesture context
        tryOpenPopup();
      });
    } else {
      // Fallback if Notification API isn't available
      tryOpenPopup();
    }
  };

  const tryOpenPopup = () => {
    // Try to open the popup
    const newWindow = window.open("https://your-destination-url.com", "_blank");

    // Check if popup was blocked
    if (
      !newWindow ||
      newWindow.closed ||
      typeof newWindow.closed === "undefined"
    ) {
      console.log("Popup was blocked - user needs to enable popups");
      // Optionally show a message to the user about enabling popups
    } else {
      console.log("Popup permission granted");
    }
  };

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent className="bg-zinc-900 border border-zinc-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-white">
            Enable App Features
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            For the best experience, we'd like to ask for permission to send
            notifications and open new tabs when needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel
            onClick={() => {
              setShowDialog(false);
              localStorage.setItem("hasRequestedNativePermission", "false");
            }}
            className="bg-zinc-800 hover:bg-zinc-700 text-white border-none"
          >
            Not now
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRequestPermission}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Allow
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
