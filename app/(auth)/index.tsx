import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
  ImageBackground,
} from "react-native";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");

const Onboarding: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale1 = useRef(new Animated.Value(0.8)).current;
  const buttonScale2 = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale1, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale2, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, buttonScale1, buttonScale2]);

  return (
    <ImageBackground
      source={require("@/assets/images/background-gradient.png")} // Thay bằng đường dẫn đến hình nền của bạn
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      <View className="flex-1 justify-center items-center">
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="items-center justify-center px-8"
        >
          <Image
            source={require("@/assets/images/transparent-icon-blue.png")}
            className="mb-6"
            style={{ width: width * 0.6, height: width * 0.6 }}
            resizeMode="contain"
          />
          <Text className="text-lg text-gray-600 text-center mb-12 font-medium leading-7">
            <Text className="font-semibold text-primary text-xl">Flipship</Text>{" "}
            - Vận chuyển thông minh hơn. Bắt đầu hành trình logistics tối ưu của
            bạn.
          </Text>
          <View className="w-full gap-y-6">
            <Animated.View style={{ transform: [{ scale: buttonScale1 }] }}>
              <Link href="/register" asChild>
                <TouchableOpacity
                  className="bg-primary mx-auto py-4 items-center rounded-full shadow-lg shadow-tertiary"
                  style={{ width: width * 0.7 }}
                >
                  <Text className="text-lg font-semibold text-white">
                    Đăng ký
                  </Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>
            <Animated.View style={{ transform: [{ scale: buttonScale2 }] }}>
              <Link href="/login" asChild>
                <TouchableOpacity
                  className="bg-subtle mx-auto py-4 items-center rounded-full shadow-lg shadow-tertiary"
                  style={{ width: width * 0.7 }}
                >
                  <Text className="text-lg font-semibold text-tertiary">
                    Đăng nhập
                  </Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

export default Onboarding;
