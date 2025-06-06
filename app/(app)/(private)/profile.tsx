import { useAuth, useUser } from "@clerk/clerk-expo";
import { View, Text, TouchableOpacity } from "react-native";

const profile = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  // console.log(user);

  return (
    <View className="flex-1 items-center justify-center">
      <View className="mb-8 items-center">
        <Text className="text-2xl font-bold">Profile</Text>
        <Text className="mt-4 text-gray-600">
          Name: {user?.fullName || "N/A"}
        </Text>
        <Text className="mt-2 text-gray-600">
          Email: {user?.primaryEmailAddress?.emailAddress || "N/A"}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => signOut()}
        className="rounded-md bg-blue-500 px-4 py-2"
      >
        <Text className="text-white">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default profile;
