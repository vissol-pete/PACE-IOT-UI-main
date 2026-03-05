import React, { useEffect, useRef } from 'react';
import { signOut } from "aws-amplify/auth";
import { getCurrentUser } from "aws-amplify/auth";

const InactivityTracker: React.FC = () => {
  const timerRef = useRef<NodeJS.Timeout | null>(null); // To store the 1-second interval timeout
  const lastActiveTimeRef = useRef<number>(Date.now()); // To store the last active timestamp
  const hasLogged30Min = useRef<boolean>(false); // To track whether 30-minute log has been printed

  // Function to check inactivity
  const checkInactivity = async () => {
    const now = Date.now();
    const inactiveTimeInSeconds = (now - lastActiveTimeRef.current) / 1000; // In seconds
    const inactiveTimeInMinutes = inactiveTimeInSeconds / 60; // In minutes

    // if (inactiveTimeInSeconds > 1 && inactiveTimeInSeconds < 1800) {
    //   console.log(`App inactive for: ${inactiveTimeInSeconds.toFixed(3)} seconds`);
    // }

    if (inactiveTimeInMinutes >= 30 && !hasLogged30Min.current) {
      try {
        // Check if there is a current authenticated user
        const user = await getCurrentUser(); // Get the current user
        if (user) {
          // If user is authenticated, sign them out
          signOut()
          resetActivity();
          console.log("User signed out due to inactivity.");
        }
      } catch (error) {
        // console.log("No user is currently logged in.");
      }

      
      hasLogged30Min.current = true; // Ensure we only log once for 30 minutes
    }
  };

  // Function to reset the inactivity timer when activity is detected
  const resetActivity = () => {
    lastActiveTimeRef.current = Date.now(); // Update last active time to now
    hasLogged30Min.current = false; // Reset the 30-minute inactivity flag
  };

  useEffect(() => {
    // Add event listeners for user interactions
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart']; // Various events to track

    events.forEach((event) => window.addEventListener(event, resetActivity));

    // Start a timer to check inactivity every second
    timerRef.current = setInterval(() => {
      checkInactivity();
    }, 1000);

    // Clean up the event listeners and interval on component unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetActivity));
    };
  }, []);

  return null; // No UI rendering is needed
};

export default InactivityTracker;
