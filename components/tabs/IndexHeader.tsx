import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

type Props = {
  scrollY: Animated.Value;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const HEADER_MAX_HEIGHT = SCREEN_HEIGHT / 3.5;
const HEADER_MIN_HEIGHT = 70;

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const AnimatedHeader: React.FC<Props> = ({ scrollY }) => {
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const avatarBgColor = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: ["rgba(255, 255, 255, 0.4)", "rgba(255, 255, 255, 0)"],
    extrapolate: "clamp",
  });

  const iconBgColor = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: ["rgba(255, 255, 255, 0.4)", "rgba(255, 255, 255, 0)"],
    extrapolate: "clamp",
  });

  const avatarTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 25],
    extrapolate: "clamp",
  });

  const overlayOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  const searchBarScale = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const searchBarOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

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
        source={{
          uri: "https://img.freepik.com/premium-photo/light-trails-busy-road-ho-chi-minh-city-vietnam_605022-42728.jpg",
        }}
        resizeMode="cover"
        className="px-4 pb-4 justify-around flex-1"
        style={{ flex: 1 }}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "#005cb8", opacity: overlayOpacity },
          ]}
        />
        <View className="flex-row justify-between items-center">
          <Animated.View
            className="flex-row items-center py-1 pl-2 pr-10 rounded-full"
            style={{
              transform: [{ translateY: avatarTranslateY }],
              backgroundColor: avatarBgColor,
            }}
          >
            <Animated.Image
              source={{ uri: "https://i.pravatar.cc/40" }}
              className="w-10 h-10 rounded-full mr-2"
            />
            <Animated.Text className="text-white text-lg font-semibold">
              Đặng Văn Lâm
            </Animated.Text>
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
                  <Ionicons name="notifications" size={24} color="white" />
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
                    size={24}
                    color="white"
                  />
                </Animated.View>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        <Animated.View
          style={{
            transform: [
              { translateY: searchBarTranslateY },
              { scale: searchBarScale },
            ],
            opacity: searchBarOpacity,
          }}
        >
          <View className="flex-row items-center bg-white/80 rounded-full p-2">
            <Ionicons
              name="search"
              size={24}
              color="#005cb8"
              className="px-2"
            />
            <TextInput
              numberOfLines={1}
              className="flex-1 mx-2"
              placeholder="Tìm kiếm chuyến xe..."
            />
            <Ionicons
              name="scan"
              size={24}
              color="#005cb8"
              className="px-2 pl-2 border-l-2 border-primary/80"
            />
          </View>
        </Animated.View>
      </AnimatedImageBackground>
    </Animated.View>
  );
};

export default AnimatedHeader;
