import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
  ImageBackground,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/libs/stores/authentManager/thunk";
import { useAuthen } from "@/libs/hooks/useAuthen";
import { useAuth } from "@/libs/context/AuthContext";
import { useAppDispatch } from "@/libs/stores";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");

const loginSchema = z.object({
  email: z
    .string({ required_error: "Vui lòng nhập email" })
    .nonempty("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: z
    .string({ required_error: "Vui lòng nhập mật khẩu" })
    .nonempty("Vui lòng nhập mật khẩu"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale1 = useRef(new Animated.Value(0.8)).current;
  const buttonScale2 = useRef(new Animated.Value(0.8)).current;

  const dispatch = useAppDispatch();
  const { loading } = useAuthen();
  const { reloadAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    register("email");
    register("password");

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
  }, []);

  const onSubmit = async (data: LoginForm) => {
  try {
    await dispatch(login(data)).unwrap();
    await reloadAuth();

    const role = await SecureStore.getItemAsync("role");

    if (role === "Customer") {
      router.push("/(tabs)");
    } else if (role === "Driver") {
      router.push("/(driver)");
    } else {
      Alert.alert("Lỗi", "Không xác định được vai trò người dùng");
    }
  } catch (err: any) {
    Alert.alert("Lỗi đăng nhập", err);
  }
};

  return (
    <ImageBackground
      source={require("@/assets/images/background-gradient.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      <ScrollView>
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
            <Text className="text-3xl text-gray-600 text-center mb-8 font-medium leading-8">
              Đăng nhập
            </Text>
            <View className="w-full gap-y-4">
              <View>
                <Text className="text-label pb-2">Email của bạn</Text>
                <View className="relative">
                  <TextInput
                    className="bg-white mx-auto py-4 pl-12 pr-5 rounded-lg text-base text-gray-800"
                    style={{ width: width * 0.8 }}
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={(text) => setValue("email", text)}
                  />
                  <MaterialIcons
                    name="email"
                    size={20}
                    color="#9CA3AF"
                    style={{
                      position: "absolute",
                      left: 16,
                      top: "50%",
                      transform: [{ translateY: -10 }],
                    }}
                  />
                </View>
                {errors.email && (
                  <Text className="text-red-500 text-sm pt-1">
                    {errors.email.message}
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-label pb-2">Mật khẩu</Text>
                <View className="relative">
                  <TextInput
                    className="bg-white mx-auto py-4 pl-12 pr-12 rounded-lg text-base text-gray-800"
                    style={{ width: width * 0.8 }}
                    placeholder="Mật khẩu"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    onChangeText={(text) => setValue("password", text)}
                  />
                  <MaterialIcons
                    name="lock"
                    size={20}
                    color="#9CA3AF"
                    style={{
                      position: "absolute",
                      left: 16,
                      top: "50%",
                      transform: [{ translateY: -10 }],
                    }}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text className="text-red-500 text-sm pt-1">
                    {errors.password.message}
                  </Text>
                )}
              </View>

              <View className="flex-row justify-end mb-2">
                <TouchableOpacity>
                  <Text className="text-primary font-medium">
                    Quên mật khẩu?
                  </Text>
                </TouchableOpacity>
              </View>

              <Animated.View style={{ transform: [{ scale: buttonScale1 }] }}>
                <TouchableOpacity
                  className="bg-primary mx-auto py-4 items-center rounded-full shadow-lg shadow-tertiary"
                  style={{ width: width * 0.7 }}
                  onPress={handleSubmit(onSubmit)}
                >
                  {loading ? (
                    <ActivityIndicator className="text-xl text-white" />
                  ) : (
                    <Text className="text-lg font-semibold text-white">
                      Đăng nhập
                    </Text>
                  )}
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{ transform: [{ scale: buttonScale2 }] }}>
                <TouchableOpacity
                  className="bg-white mx-auto py-4 items-center rounded-full shadow-lg shadow-tertiary flex-row justify-center"
                  style={{ width: width * 0.7 }}
                >
                  <Image
                    source={{ uri: "https://www.google.com/favicon.ico" }}
                    style={{ width: 20, height: 20, marginRight: 8 }}
                  />
                  <Text className="text-lg font-semibold text-gray-800">
                    Đăng nhập bằng Google
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              <View className="flex-row justify-center mt-2">
                <Text className="text-gray-600 font-medium">
                  Chưa có tài khoản?{" "}
                </Text>
                <Link href="/register" asChild>
                  <TouchableOpacity>
                    <Text className="text-primary font-medium">Đăng ký</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
