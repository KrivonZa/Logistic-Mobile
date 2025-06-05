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
import OrderNow from "@/components/tabs/OrderNow";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = SCREEN_HEIGHT / 3.5;

const HomeScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const quickActions = [
    {
      key: "book",
      label: "Đặt vé",
      image: require("@/assets/images/icons/ticket.png"),
    },
    {
      key: "track",
      label: "Theo dõi đơn",
      image: require("@/assets/images/icons/tracking.png"),
    },
    {
      key: "nearby",
      label: "Các chuyến gần đây",
      image: require("@/assets/images/icons/nearby.png"),
    },
    {
      key: "review",
      label: "Đánh giá",
      image: require("@/assets/images/icons/rating.png"),
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
        <View className="mb-6">
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
                onPress={() => {
                  // TODO
                }}
              >
                <View className="bg-white shadow-lg shadow-tertiary p-3 rounded-2xl mt-5 items-center w-32 h-44">
                  <View className="bg-gray-100 p-3 rounded-full mb-2">
                    <Image
                      source={item.image}
                      style={{ width: 50, height: 50, resizeMode: "contain" }}
                    />
                  </View>
                  <Text className="text-center text-base text-tertiary font-medium">
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/*Bản đồ */}
        <YourLocation />
        <OrderNow />
      </Animated.ScrollView>
    </View>
  );
};

export default HomeScreen;
