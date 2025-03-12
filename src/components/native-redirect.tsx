"use client";
import React, { useEffect } from "react";

export default function NativeRedirectPermission() {
  useEffect(() => {
    // Check if this is the first visit
    const hasRequested = localStorage.getItem("hasRequestedRedirect");

    if (!hasRequested) {
      // Set flag to prevent future requests
      localStorage.setItem("hasRequestedRedirect", "true");

      // Request to open popup using a user interaction
      const setupRedirectPermission = () => {
        try {
          // Attempt to open a popup - this will trigger the browser's popup blocker
          // which serves as the permission system we're looking for
          const newWindow = window.open(
            "https://your-destination-url.com",
            "_blank"
          );

          // If popup was blocked, newWindow will be null
          if (
            !newWindow ||
            newWindow.closed ||
            typeof newWindow.closed === "undefined"
          ) {
            console.log("Popup was blocked - user will need to enable popups");
          } else {
            console.log("Popup permission granted");
          }
        } catch (error) {
          console.error("Error requesting popup permission:", error);
        }
      };

      setTimeout(() => {
        const tempButton = document.createElement("button");
        tempButton.style.display = "none";
        document.body.appendChild(tempButton);

        // Set up event listener
        tempButton.addEventListener("click", setupRedirectPermission);

        // Trigger the click
        tempButton.click();

        // Clean up
        document.body.removeChild(tempButton);
      }, 1000);
    }
  }, []);

  return null; // This component doesn't render anything
}
