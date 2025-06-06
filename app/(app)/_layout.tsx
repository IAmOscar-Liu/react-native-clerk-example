import { useAuth } from "@clerk/clerk-expo";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log("isLoaded", isLoaded);
    if (!isLoaded) return;

    const inPrivateGroup = segments[1] === "(private)";
    // console.log(segments);

    // Add a small delay to ensure root layout is mounted
    const timer = setTimeout(() => {
      if (isSignedIn && !inPrivateGroup) {
        console.log("logged in and redirecting to home");
        router.replace("/home");
      } else if (!isSignedIn) {
        console.log("logged out and redirecting to sign-in");
        router.replace("/sign-in");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isSignedIn, isLoaded]);

  return <Slot />;
}
