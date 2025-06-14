import { View, ActivityIndicator } from "react-native";

const LoadingPage = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default LoadingPage;
