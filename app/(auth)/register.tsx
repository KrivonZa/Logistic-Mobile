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
  Alert,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/libs/stores";
import { useAuthen } from "@/libs/hooks/useAuthen";
import { register } from "@/libs/stores/authentManager/thunk";

const { width } = Dimensions.get("window");

const schema = z
  .object({
    fullName: z.string().min(1, "Họ và tên không được để trống"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
    address: z.string().min(1, "Địa chỉ không được để trống"),
    phoneNumber: z.string().regex(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAuthen();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
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
  }, []);

  const onSubmit = async (data: FormData) => {
    const { confirmPassword, ...payload } = data;
    try {
      const result = await dispatch(register(payload)).unwrap();
      console.log(result);
      Alert.alert("Thành công", "Đăng ký tài khoản thành công!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      Alert.alert("Lỗi đăng ký", err?.message || "Đã xảy ra lỗi");
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/background-gradient.png")}
      style={{ flex: 1 }}
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
              style={{ width: width * 0.8, height: width * 0.4 }}
              resizeMode="contain"
            />
            <Text className="text-3xl text-gray-600 text-center mb-4 font-medium leading-8">
              Đăng ký
            </Text>

            <View className="w-full gap-y-4">
              <Controller
                control={control}
                name="fullName"
                render={({ field }) => (
                  <InputField
                    label="Họ và tên"
                    icon="person"
                    placeholder="Họ và tên"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.fullName?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <InputField
                    label="Email"
                    icon="email"
                    placeholder="Email"
                    keyboardType="email-address"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.email?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <InputField
                    label="Địa chỉ"
                    icon="home"
                    placeholder="Địa chỉ"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.address?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field }) => (
                  <InputField
                    label="Số điện thoại"
                    icon="phone"
                    placeholder="Số điện thoại"
                    keyboardType="phone-pad"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.phoneNumber?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <InputField
                    label="Mật khẩu"
                    icon="lock"
                    placeholder="Mật khẩu"
                    secureTextEntry={!showPassword}
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.password?.message}
                    toggleSecure={() => setShowPassword(!showPassword)}
                    showToggle
                    showValue={showPassword}
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <InputField
                    label="Xác nhận mật khẩu"
                    icon="lock"
                    placeholder="Xác nhận mật khẩu"
                    secureTextEntry={!showConfirmPassword}
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.confirmPassword?.message}
                    toggleSecure={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    showToggle
                    showValue={showConfirmPassword}
                  />
                )}
              />

              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  className="bg-primary mx-auto py-4 mt-2 items-center rounded-full shadow-lg shadow-tertiary"
                  style={{ width: width * 0.7 }}
                  onPress={handleSubmit(onSubmit)}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-lg font-semibold text-white">
                      Đăng ký
                    </Text>
                  )}
                </TouchableOpacity>
              </Animated.View>

              <View className="flex-row justify-center mt-2 mb-6">
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
}

// ✅ InputField được đặt cuối file, dùng trong cùng file
const InputField = ({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType,
  secureTextEntry,
  toggleSecure,
  showToggle,
  showValue,
}: {
  label: string;
  icon: any;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  keyboardType?: any;
  secureTextEntry?: boolean;
  toggleSecure?: () => void;
  showToggle?: boolean;
  showValue?: boolean;
}) => {
  return (
    <View>
      <Text className="text-label pb-2">{label}</Text>
      <View className="relative">
        <TextInput
          className="bg-white mx-auto py-4 pl-12 pr-12 rounded-lg text-base text-gray-800"
          style={{ width: width * 0.8 }}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
        />
        <MaterialIcons
          name={icon}
          size={20}
          color="#9CA3AF"
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: [{ translateY: -10 }],
          }}
        />
        {showToggle && toggleSecure && (
          <TouchableOpacity
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onPress={toggleSecure}
          >
            <MaterialIcons
              name={showValue ? "visibility" : "visibility-off"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text className="text-red-500 mt-1 ml-4">{error}</Text> : null}
    </View>
  );
};
