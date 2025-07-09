import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppDispatch } from "@/libs/stores";
import { createRating } from "@/libs/stores/ratingManager/thunk";
import { useRating } from "@/libs/hooks/useRating";
import { useRouter } from "expo-router";
import { useAuth } from "@/libs/context/AuthContext";
import isAuth from "@/components/isAuth";

const RatingScreen = () => {
  const [stars, setStars] = useState(0);
  const [content, setContent] = useState("");
  const { loading } = useRating();
  const dispatch = useAppDispatch();
  const { role } = useAuth();
  const router = useRouter();

  const isDisabled = stars === 0 || content.trim() === "" || loading;

  const handleSubmit = async () => {
    if (isDisabled) return;

    try {
      await dispatch(createRating({ stars, content })).unwrap();
      setStars(0);
      setContent("");

      Alert.alert("Thành công", "Cảm ơn bạn đã đánh giá!", [
        {
          text: "OK",
          onPress: () => {
            if (role === "Customer") {
              router.replace("/(tabs)");
            } else if (role === "Driver") {
              router.replace("/(driver)");
            } else {
              router.back();
            }
          },
        },
      ]);
    } catch {
      Alert.alert("Lỗi", "Không thể gửi đánh giá. Vui lòng thử lại sau.");
    }
  };

  return (
    <View className="flex-1 bg-gray-100 items-center justify-center p-4">
      <View className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <View className="flex-row justify-center mb-6">
          <Image
            source={require("@/assets/images/transparent-icon-blue.png")}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary/80"
          />
        </View>

        <Text className="text-3xl font-extrabold text-gray-800 text-center mb-2">
          Đánh giá ứng dụng
        </Text>
        <Text className="text-center text-gray-500 mb-6">
          Chúng tôi rất muốn nghe phản hồi của bạn!
        </Text>

        <View className="flex-row justify-center mb-6 space-x-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Pressable key={i} onPress={() => setStars(i)}>
              <MaterialIcons
                name={i <= stars ? "star" : "star-border"}
                size={40}
                color={i <= stars ? "#facc15" : "#d1d5db"}
              />
            </Pressable>
          ))}
        </View>

        <TextInput
          className="w-full border border-gray-300 rounded-xl p-4 h-36 text-base text-gray-700 placeholder-gray-400 mb-6"
          placeholder="Viết gì đó về trải nghiệm của bạn..."
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <Pressable
          onPress={handleSubmit}
          disabled={isDisabled}
          className={`w-full rounded-full py-3 flex-row items-center justify-center ${
            isDisabled ? "bg-gray-300" : "bg-blue-600"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text
              className={`text-lg font-semibold ${
                isDisabled ? "text-gray-500" : "text-white"
              }`}
            >
              Gửi đánh giá
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default isAuth(RatingScreen, ["Customer", "Driver"]);
