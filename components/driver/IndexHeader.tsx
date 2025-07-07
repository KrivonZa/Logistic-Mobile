import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useAuth } from "@/libs/context/AuthContext";

type Props = {
  scrollY: Animated.Value;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = SCREEN_HEIGHT / 6;
const HEADER_MIN_HEIGHT = 70;

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const AnimatedHeader: React.FC<Props> = ({ scrollY }) => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      const weekday = now.toLocaleDateString("vi-VN", { weekday: "long" });
      const date = now.toLocaleDateString("vi-VN");
      const time = now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setCurrentTime(`${weekday}, ${date} - ${time}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const overlayOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const avatarTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 20],
    extrapolate: "clamp",
  });

  const avatarBgColor = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: ["rgba(255,255,255,0.3)", "rgba(255,255,255,0)"],
    extrapolate: "clamp",
  });

  const iconBgColor = avatarBgColor;

  return (
    <Animated.View
      className="overflow-hidden"
      style={{
        height: headerHeight,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
    >
      <AnimatedImageBackground
        source={require("@/assets/images/header-image.png")}
        resizeMode="cover"
        className="px-4 pt-6 pb-3 justify-between flex-1"
        style={{ flex: 1 }}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "#005cb8", opacity: overlayOpacity },
          ]}
        />

        {/* Top row: Avatar + Icon buttons */}
        <View className="flex-row justify-between items-center">
          <Animated.View
            className="flex-row items-center py-1 pl-2 pr-4 rounded-full"
            style={{
              transform: [{ translateY: avatarTranslateY }],
              backgroundColor: avatarBgColor,
            }}
          >
            <Animated.Image
              source={{ uri: user?.account.avatar }}
              className="w-10 h-10 rounded-full mr-2"
            />
            <View>
              <Animated.Text className="text-white text-base font-semibold">
                {user?.account.fullName}
              </Animated.Text>
              {user?.account.detail && "companyName" in user.account.detail && (
                <Animated.Text className="text-white text-sm font-light">
                  {user.account.detail.companyName}
                </Animated.Text>
              )}
            </View>
          </Animated.View>

          <View className="flex-row gap-4">
            <Link href="/(notification)" asChild>
              <TouchableOpacity>
                <Animated.View
                  style={{
                    backgroundColor: iconBgColor,
                    borderRadius: 999,
                    padding: 8,
                    transform: [{ translateY: avatarTranslateY }],
                  }}
                >
                  <Ionicons name="notifications" size={22} color="white" />
                </Animated.View>
              </TouchableOpacity>
            </Link>

            <Link href="/(chat)" asChild>
              <TouchableOpacity>
                <Animated.View
                  style={{
                    backgroundColor: iconBgColor,
                    borderRadius: 999,
                    padding: 8,
                    transform: [{ translateY: avatarTranslateY }],
                  }}
                >
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={22}
                    color="white"
                  />
                </Animated.View>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Bottom: DateTime */}
        <View className="mt-2 ml-2 bg-white rounded-lg px-4 py-1 self-start max-w-[60%]">
          <Text className="text-primary text-base font-medium">
            {currentTime}
          </Text>
        </View>
      </AnimatedImageBackground>
    </Animated.View>
  );
};

export default AnimatedHeader;
