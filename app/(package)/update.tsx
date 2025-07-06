import React, { useEffect, useState } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppDispatch } from "@/libs/stores";
import {
  getPackageByID,
  updatePackage,
} from "@/libs/stores/packageManager/thunk";
import { usePackage } from "@/libs/hooks/usePackage";

export default function UpdatePackageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { packageDetail, loading } = usePackage();
  const router = useRouter();

  const [packageName, setPackageName] = useState("");
  const [packageWeight, setPackageWeight] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) dispatch(getPackageByID(id));
  }, [id]);

  useEffect(() => {
    if (packageDetail) {
      setPackageName(packageDetail.packageName || "");
      setPackageWeight(String(packageDetail.packageWeight));
      setNote(packageDetail.note || "");
      setImage({ uri: packageDetail.packageImage });
    }
  }, [packageDetail]);

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

  const handleUpdate = async () => {
    if (!packageName || !packageWeight) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên và khối lượng");
      return;
    }

    const formData = new FormData();
    formData.append("packageID", id);
    formData.append("packageName", packageName);
    formData.append("packageWeight", packageWeight);
    if (note) formData.append("note", note);
    if (image?.uri && image?.fileName) {
      formData.append("file", {
        uri: image.uri,
        type: image.type || "image/jpeg",
        name: image.fileName || "photo.jpg",
      } as any);
    }

    try {
      setSubmitting(true);
      await dispatch(updatePackage(formData)).unwrap();
      Alert.alert("Thành công", "Cập nhật kiện hàng thành công", [
        { text: "OK", onPress: () => router.push("/(tabs)/package") },
      ]);
    } catch (err: any) {
      Alert.alert("Lỗi", err.toString());
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !packageDetail) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-500">Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4">Chỉnh sửa kiện hàng</Text>

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
      {image?.uri && (
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
        onPress={handleUpdate}
        disabled={submitting}
        className={`mt-8 rounded-xl p-4 items-center ${
          submitting ? "bg-gray-400" : "bg-primary"
        }`}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-bold text-base">
            Cập nhật kiện hàng
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
