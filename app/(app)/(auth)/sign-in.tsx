import OAuthLoginButton from "@/components/OAuthLoginButton";
import { cn, getErrorMessage } from "@/lib/utils";
import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

const SignInPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle the submission of the sign-in form
  const handleSignIn = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      setLoading(true);
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Signin incomplete");
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 items-center justify-center p-4">
        <View className="mb-8 items-center">
          <Ionicons name="logo-react" size={64} color="#61DAFB" />
        </View>
        <Text className="mb-8 text-2xl font-bold">Sign In</Text>

        <View className="w-full space-y-4">
          <Text className="my-1 text-sm font-medium text-gray-700">Email</Text>
          <TextInput
            className="h-12 w-full rounded-lg border border-gray-300 px-4"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text className="my-1 text-sm font-medium text-gray-700">
            Password
          </Text>
          <TextInput
            className="h-12 w-full rounded-lg border border-gray-300 px-4"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            className={cn(
              "mt-3 h-12 w-full items-center justify-center rounded-lg bg-blue-500",
              loading && "opacity-50",
            )}
            onPress={handleSignIn}
            disabled={loading || !isLoaded}
          >
            <Text className="font-semibold text-white">
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/sign-up")}
            className="mt-4 items-center"
          >
            <Text className="text-blue-500">
              Don't have an account? Sign up
            </Text>
          </TouchableOpacity>

          <Text className="mt-2 text-center text-sm text-gray-500">Or</Text>

          <OAuthLoginButton
            className="mt-2"
            strategy="oauth_google"
            disabled={loading || !isLoaded}
            icon={<Ionicons name="logo-google" size={24} color="#4285F4" />}
            text={!isLoaded ? "Clerk is loading..." : "Continue with Google"}
            onStart={() => setLoading(true)}
            onCompleted={() => setLoading(false)}
            onError={(error) => {
              setLoading(false);
              Alert.alert("Error", getErrorMessage(error));
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignInPage;
