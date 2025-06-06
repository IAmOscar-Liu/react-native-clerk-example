import { useWarmUpBrowser } from "@/hook/useWarmUpBrowser";
import { cn } from "@/lib/utils";
import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { ReactNode, useCallback } from "react";
import { Text, TouchableOpacity } from "react-native";

const OAuthLoginButton = ({
  className,
  strategy,
  disabled,
  icon,
  text,
  onStart,
  onCompleted,
  onError,
}: {
  className?: string;
  strategy:
    | "oauth_google"
    | "oauth_github"
    | "oauth_linkedin"
    | "oauth_microsoft"
    | "oauth_apple";
  disabled: boolean;
  icon: ReactNode;
  text: string;
  onStart?: () => void;
  onCompleted?: () => void;
  onError?: (error: any) => void;
}) => {
  useWarmUpBrowser();

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      onStart?.();
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        onCompleted?.();
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
        onError?.(new Error("No createdSessionId"));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      onError?.(err);
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        "h-12 w-full flex-row items-center justify-center rounded-lg border border-gray-300 bg-white",
        className,
      )}
      disabled={disabled}
    >
      {icon}
      <Text className="ml-2 font-medium text-gray-700">{text}</Text>
    </TouchableOpacity>
  );
};

export default OAuthLoginButton;
