import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppDispatch } from "@/libs/stores";
import { updateTrip } from "@/libs/stores/tripManager/thunk";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function UpdateTripStatusScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { tripID, status } = useLocalSearchParams<{
    tripID: string;
    status: string;
  }>();

  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!tripID || !status) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500 font-semibold text-center">
          Thiếu thông tin chuyến đi. Không thể tiếp tục.
        </Text>
      </View>
    );
  }

  const getTitleByStatus = (status: string) => {
    if (status === "InProgress") return "Cập nhật hình ảnh nhận hàng";
    if (status === "Completed") return "Cập nhật hình ảnh trả hàng";
    return "Cập nhật hình ảnh chuyến đi";
  };

  const handleSelectImage = async (fromCamera: boolean) => {
    const res = fromCamera
      ? await launchCamera({ mediaType: "photo" })
      : await launchImageLibrary({ mediaType: "photo" });

    if (res.didCancel || !res.assets || res.assets.length === 0) return;
    setImage(res.assets[0]);
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert(
        "Thiếu ảnh",
        "Vui lòng chọn hoặc chụp ảnh trước khi xác nhận."
      );
      return;
    }

    const formData = new FormData();
    formData.append("tripID", tripID);
    formData.append("status", status);
    formData.append("file", {
      uri: image.uri,
      name: image.fileName || "trip.jpg",
      type: image.type || "image/jpeg",
    } as any);

    setLoading(true);
    try {
      await dispatch(updateTrip(formData)).unwrap();
      Alert.alert("Thành công", "Hình ảnh đã được cập nhật!", [
        {
          text: "OK",
          onPress: () => router.push("/(driver)/delivery"),
        },
      ]);
    } catch (err: any) {
      console.error("Lỗi cập nhật:", err);
      Alert.alert("Thất bại", "Không thể cập nhật hình ảnh.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4 text-center">
        {getTitleByStatus(status)}
      </Text>

      {image && (
        <View className="mb-4">
          <Image
            source={{ uri: image.uri }}
            className="w-full h-56 rounded-xl"
            resizeMode="cover"
          />
          <Text className="mt-2 text-center text-gray-600">
            {image.fileName || "Ảnh đã chọn"}
          </Text>
        </View>
      )}

      <View className="flex-row justify-around mb-6">
        <TouchableOpacity
          onPress={() => handleSelectImage(false)}
          className="flex-row items-center bg-gray-100 p-3 rounded-xl"
        >
          <MaterialIcons name="photo-library" size={20} color="blue" />
          <Text className="ml-2 text-blue-600 font-medium">
            Chọn từ thư viện
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSelectImage(true)}
          className="flex-row items-center bg-gray-100 p-3 rounded-xl"
        >
          <MaterialIcons name="photo-camera" size={20} color="green" />
          <Text className="ml-2 text-green-600 font-medium">Chụp ảnh</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className={`rounded-xl p-4 items-center ${
          loading ? "bg-gray-400" : "bg-primary"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-base">
            Xác nhận cập nhật hình ảnh
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
