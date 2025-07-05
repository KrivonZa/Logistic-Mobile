import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppDispatch } from "@/libs/stores";
import { createPackage } from "@/libs/stores/packageManager/thunk";
import { usePackage } from "@/libs/hooks/usePackage";
import { useRouter } from "expo-router";

export default function CreatePackage() {
  const dispatch = useAppDispatch();
  const { loading } = usePackage();

  const router = useRouter();
  const [packageName, setPackageName] = useState("");
  const [packageWeight, setPackageWeight] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState<any>(null);

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (res) => {
      if (res.didCancel || !res.assets) return;
      setImage(res.assets[0]);
    });
  };

  const handleTakePhoto = () => {
    launchCamera({ mediaType: "photo" }, (res) => {
      if (res.didCancel || !res.assets) return;
      setImage(res.assets[0]);
    });
  };

  const handleCreatePackage = async () => {
    if (!packageName || !packageWeight || !image) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ dữ liệu");
      return;
    }

    const formData = new FormData();
    formData.append("packageName", packageName);
    formData.append("packageWeight", packageWeight);
    if (note) formData.append("note", note);
    formData.append("file", {
      uri: image.uri,
      type: image.type,
      name: image.fileName || "photo.jpg",
    } as any);

    console.log("🧾 File chuẩn bị gửi:", {
      uri: image.uri,
      type: image.type,
      name: image.fileName,
    });

    try {
      const result = await dispatch(createPackage(formData)).unwrap();
      Alert.alert(
        "Thành công",
        "Đã tạo kiện hàng thành công",
        [
          {
            text: "OK",
            onPress: () => router.push("/package"),
          },
        ],
        { cancelable: false }
      );
    } catch (err: any) {
      Alert.alert("Thất bại", err.toString());
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4">Tạo kiện hàng</Text>

      <Text className="font-semibold">Tên kiện hàng</Text>
      <TextInput
        value={packageName}
        onChangeText={setPackageName}
        placeholder="Nhập tên..."
        className="border border-gray-300 rounded-xl p-3 my-2"
      />

      <Text className="font-semibold">Khối lượng (kg)</Text>
      <TextInput
        value={packageWeight}
        onChangeText={setPackageWeight}
        placeholder="Nhập cân nặng..."
        keyboardType="numeric"
        className="border border-gray-300 rounded-xl p-3 my-2"
      />

      <Text className="font-semibold">Ghi chú</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Ghi chú thêm (nếu có)..."
        className="border border-gray-300 rounded-xl p-3 my-2"
        multiline
        numberOfLines={3}
      />

      <Text className="font-semibold mt-2">Ảnh minh họa</Text>
      {image && (
        <Image
          source={{ uri: image.uri }}
          className="w-full h-56 mt-2 rounded-xl"
          resizeMode="cover"
        />
      )}

      <View className="flex-row justify-around mt-4">
        <TouchableOpacity
          onPress={handlePickImage}
          className="flex-row items-center bg-gray-100 p-3 rounded-xl"
        >
          <MaterialIcons name="photo-library" size={20} color="blue" />
          <Text className="ml-2">Thư viện</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleTakePhoto}
          className="flex-row items-center bg-gray-100 p-3 rounded-xl"
        >
          <MaterialIcons name="photo-camera" size={20} color="green" />
          <Text className="ml-2">Chụp ảnh</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleCreatePackage}
        disabled={loading}
        className={`mt-8 rounded-xl p-4 items-center ${
          loading ? "bg-gray-400" : "bg-primary"
        }`}
      >
        {loading ? (
          <ActivityIndicator className="text-xl text-white" />
        ) : (
          <Text className="text-white text-center font-bold text-base">
            Tạo hàng
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
