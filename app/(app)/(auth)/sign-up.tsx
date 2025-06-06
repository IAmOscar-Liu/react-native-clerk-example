import { cn, getErrorMessage } from "@/lib/utils";
import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  Keyboard,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";

const SignUpPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      await signUp.create({
        emailAddress: email,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (error) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(error, null, 2));
      Alert.alert("Error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        // router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
        Alert.alert("Error", "Signup incomplete");
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

  if (pendingVerification) {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 items-center justify-center p-4">
          <View className="mb-8 items-center">
            <Ionicons name="logo-react" size={64} color="#61DAFB" />
          </View>
          <Text className="mb-8 text-2xl font-bold">Verify your email</Text>

          <View className="w-full space-y-4">
            <Text className="my-1 text-sm font-medium text-gray-700">
              Verification Code
            </Text>
            <TextInput
              className="h-12 w-full rounded-lg border border-gray-300 px-4"
              placeholder="Enter verification code"
              value={code}
              onChangeText={setCode}
            />

            <TouchableOpacity
              className={cn(
                "mt-3 h-12 w-full items-center justify-center rounded-lg bg-blue-500",
                loading && "opacity-50",
              )}
              onPress={onVerifyPress}
              disabled={loading || !isLoaded}
            >
              <Text className="font-semibold text-white">
                {loading ? "Verifying..." : "Verify"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 items-center justify-center p-4">
        <View className="mb-8 items-center">
          <Ionicons name="logo-react" size={64} color="#61DAFB" />
        </View>
        <Text className="mb-8 text-2xl font-bold">Sign Up</Text>

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
            onPress={handleSignUp}
            disabled={loading || !isLoaded}
          >
            <Text className="font-semibold text-white">
              {loading ? "Signing up..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/sign-in")}
            className="mt-4 items-center"
          >
            <Text className="text-blue-500">
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUpPage;
