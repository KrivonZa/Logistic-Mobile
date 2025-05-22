import { Text, View } from "react-native";
import isAuth from "@/components/isAuth";

const HomeScreen = () => {
  return (
    <View className="px-10 flex-1 justify-center items-center">
      <Text className="text-4xl text-center mb-4">
        Whereas disregard and contempt for human rights have resulted
      </Text>
    </View>
  );
};

export default isAuth(HomeScreen, ["Customer", "Driver"]);
