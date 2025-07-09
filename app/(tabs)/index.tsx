import React, { useRef } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import AnimatedHeader from "@/components/tabs/IndexHeader";
import YourLocation from "@/components/tabs/YourLocation";
import { useRouter } from "expo-router";
import isAuth from "@/components/isAuth";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = SCREEN_HEIGHT / 3.5;

const HomeScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const quickActions = [
    {
      key: "book",
      label: "Đặt chuyến",
      image: require("@/assets/images/icons/ticket.png"),
      onPress: () => router.push("/(search)"),
    },
    {
      key: "track",
      label: "Theo dõi đơn",
      image: require("@/assets/images/icons/tracking.png"),
      onPress: () => router.push("/(tabs)/order"),
    },
    {
      key: "review",
      label: "Đánh giá App",
      image: require("@/assets/images/icons/rating.png"),
      onPress: () => router.push("/(rating)"),
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <AnimatedHeader scrollY={scrollY} />

      <Animated.ScrollView
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View className="mb-2">
          <FlatList
            data={quickActions}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 14,
            }}
            keyExtractor={(item) => item.key}
            ItemSeparatorComponent={() => <View className="w-4" />}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="items-center justify-center"
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View className="bg-white rounded-2xl p-4 items-center w-36 h-48 shadow-sm border border-gray-200">
                  <View className="bg-blue-50 p-3.5 rounded-full mb-3 shadow-xs">
                    <Image
                      source={item.image}
                      style={{ width: 48, height: 48, resizeMode: "contain" }}
                    />
                  </View>
                  <Text className="text-center text-base font-semibold text-gray-800 mt-1">
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <YourLocation />
      </Animated.ScrollView>
    </View>
  );
};

export default isAuth(HomeScreen, ["Customer"]);
