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
} from "react-native";
import { Link, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const RegisterScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, buttonScale]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateInput = (field: string, value: string) => {
    let newErrors = { ...errors };

    if (field === "username") {
      newErrors.username = value.trim() ? "" : "Username không được để trống";
    }
    if (field === "email") {
      newErrors.email = validateEmail(value) ? "" : "Email không hợp lệ";
    }
    if (field === "password") {
      newErrors.password =
        value.length >= 6 ? "" : "Mật khẩu phải có ít nhất 6 ký tự";
      // Cập nhật lỗi xác nhận mật khẩu nếu mật khẩu thay đổi
      newErrors.confirmPassword =
        confirmPassword && value === confirmPassword
          ? ""
          : confirmPassword
          ? "Mật khẩu và xác nhận mật khẩu không khớp"
          : newErrors.confirmPassword;
    }
    if (field === "confirmPassword") {
      newErrors.confirmPassword =
        value === password ? "" : "Mật khẩu và xác nhận mật khẩu không khớp";
    }

    setErrors(newErrors);
  };

  const handleRegister = () => {
    // Kiểm tra tất cả lỗi trước khi đăng ký
    if (
      !errors.username &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword &&
      username &&
      email &&
      password &&
      confirmPassword
    ) {
    } else {
      // Hiển thị lỗi đầu tiên nếu có
      const firstError =
        errors.username ||
        errors.email ||
        errors.password ||
        errors.confirmPassword ||
        "Vui lòng điền đầy đủ và chính xác thông tin";
      setErrors({ ...errors, confirmPassword: firstError });
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
            <Text className="text-3xl text-gray-600 text-center mb-4 font-medium leading-8">
              Đăng ký
            </Text>
            <View className="w-full gap-y-4">
              {/* Username */}
              <View>
                <Text className="text-label pb-2">Username</Text>
                <View className="relative">
                  <TextInput
                    className="bg-white mx-auto py-4 pl-12 pr-5 rounded-lg shadow-lg shadow-tertiary text-base text-gray-800"
                    style={{ width: width * 0.8 }}
                    placeholder="Username"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      validateInput("username", text);
                    }}
                  />
                  <MaterialIcons
                    name="person"
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
                {errors.username ? (
                  <Text className="text-red-500 mt-1 ml-4">
                    {errors.username}
                  </Text>
                ) : null}
              </View>

              {/* Email */}
              <View>
                <Text className="text-label pb-2">Email</Text>
                <View className="relative">
                  <TextInput
                    className="bg-white mx-auto py-4 pl-12 pr-5 rounded-lg shadow-lg shadow-tertiary text-base text-gray-800"
                    style={{ width: width * 0.8 }}
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      validateInput("email", text);
                    }}
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
                {errors.email ? (
                  <Text className="text-red-500 mt-1 ml-4">{errors.email}</Text>
                ) : null}
              </View>

              {/* Mật khẩu */}
              <View>
                <Text className="text-label pb-2">Mật khẩu</Text>
                <View className="relative">
                  <TextInput
                    className="bg-white mx-auto py-4 pl-12 pr-12 rounded-lg shadow-lg shadow-tertiary text-base text-gray-800"
                    style={{ width: width * 0.8 }}
                    placeholder="Mật khẩu"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      validateInput("password", text);
                    }}
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
                {errors.password ? (
                  <Text className="text-red-500 mt-1 ml-4">
                    {errors.password}
                  </Text>
                ) : null}
              </View>

              {/* Xác nhận mật khẩu */}
              <View>
                <Text className="text-label pb-2">Xác nhận mật khẩu</Text>
                <View className="relative">
                  <TextInput
                    className="bg-white mx-auto py-4 pl-12 pr-12 rounded-lg shadow-lg shadow-tertiary text-base text-gray-800"
                    style={{ width: width * 0.8 }}
                    placeholder="Xác nhận mật khẩu"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      validateInput("confirmPassword", text);
                    }}
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
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <MaterialIcons
                      name={
                        showConfirmPassword ? "visibility" : "visibility-off"
                      }
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword ? (
                  <Text className="text-red-500 mt-1 ml-4">
                    {errors.confirmPassword}
                  </Text>
                ) : null}
              </View>
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  className="bg-primary mx-auto py-4 mt-2 items-center rounded-full shadow-lg shadow-tertiary"
                  style={{ width: width * 0.7 }}
                  onPress={handleRegister}
                >
                  <Text className="text-lg font-semibold text-white">
                    Đăng ký
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              <View className="flex-row justify-center mt-2">
                <Text className="text-gray-600 font-medium">
                  Đã có tài khoản?{" "}
                </Text>
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <Text className="text-primary font-medium">Đăng nhập</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default RegisterScreen;
