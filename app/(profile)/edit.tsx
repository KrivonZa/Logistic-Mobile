import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useUser } from "@/libs/context/AuthContext";
import { useState } from "react";
import * as ImagePicker from "react-native-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch } from "@/libs/stores";
import { updateAccount } from "@/libs/stores/accountManager/thunk";
import { useAccount } from "@/libs/hooks/useAccount";
import { useRouter } from "expo-router";

export default function UpdateProfileScreen() {
  const user = useUser();
  if (!user) return null;
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { loading } = useAccount();
  const { account } = user;
  const isDriver = account.role === "Driver";
  const detail = account.detail as any;

  const [form, setForm] = useState({
    fullName: account.fullName || "",
    email: account.email || "",
    phoneNumber: detail?.phoneNumber || "",
    address: !isDriver ? detail?.address || "" : "",
  });

  const [image, setImage] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePickImage = () => {
    if (loading || submitting) return;
    Alert.alert("Chọn ảnh đại diện", "Bạn muốn chọn ảnh từ đâu?", [
      {
        text: "Thư viện",
        onPress: () =>
          ImagePicker.launchImageLibrary(
            { mediaType: "photo", quality: 0.8 },
            (res) => {
              if (!res.didCancel && res.assets?.[0]) {
                setImage(res.assets[0]);
              }
            }
          ),
      },
      {
        text: "Camera",
        onPress: () =>
          ImagePicker.launchCamera(
            { mediaType: "photo", quality: 0.8 },
            (res) => {
              if (!res.didCancel && res.assets?.[0]) {
                setImage(res.assets[0]);
              }
            }
          ),
      },
      { text: "Hủy", style: "cancel" },
    ]);
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);

      if (isDriver) {
        formData.append("driver[phoneNumber]", form.phoneNumber);
      } else {
        formData.append("customer[phoneNumber]", form.phoneNumber);
        formData.append("customer[address]", form.address);
      }

      if (image) {
        formData.append("file", {
          uri:
            Platform.OS === "ios"
              ? image.uri.replace("file://", "")
              : image.uri,
          name: image.fileName || "avatar.jpg",
          type: image.type || "image/jpeg",
        } as any);
      }

      await dispatch(updateAccount(formData)).unwrap();

      Alert.alert("✅ Thành công", "Thông tin đã được cập nhật.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("❌ Lỗi", "Không thể cập nhật thông tin.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#005cb8" />
        <Text className="mt-2 text-gray-500">Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-5 pt-6">
      <Text className="text-xl font-bold text-label mb-4">
        Cập nhật thông tin
      </Text>

      {/* Avatar */}
      <TouchableOpacity
        onPress={handlePickImage}
        disabled={submitting}
        className="mb-4 items-center"
      >
        {image || account.avatar ? (
          <Image
            source={{ uri: image?.uri || account.avatar }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 8,
            }}
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-gray-300 items-center justify-center mb-2">
            <Ionicons name="camera-outline" size={28} color="#666" />
          </View>
        )}
        <Text className="text-primary font-semibold">Đổi ảnh đại diện</Text>
      </TouchableOpacity>

      {/* Common fields */}
      <LabelInput
        label="Họ và tên"
        value={form.fullName}
        onChangeText={(val) => handleChange("fullName", val)}
        editable={!submitting}
      />
      <LabelInput
        label="Email"
        value={form.email}
        keyboardType="email-address"
        onChangeText={(val) => handleChange("email", val)}
        editable={!submitting}
      />
      <LabelInput
        label="Số điện thoại"
        value={form.phoneNumber}
        keyboardType="phone-pad"
        onChangeText={(val) => handleChange("phoneNumber", val)}
        editable={!submitting}
      />

      {/* Chỉ khách hàng được sửa địa chỉ */}
      {!isDriver && (
        <LabelInput
          label="Địa chỉ"
          value={form.address}
          onChangeText={(val) => handleChange("address", val)}
          editable={!submitting}
        />
      )}

      <TouchableOpacity
        onPress={handleSave}
        disabled={submitting}
        className={`rounded-xl py-3 mt-6 items-center ${
          submitting ? "bg-gray-400" : "bg-primary"
        }`}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-semibold">
            Lưu thay đổi
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// Reusable input
const LabelInput = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  placeholder = "",
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "phone-pad" | "numeric" | "email-address";
  placeholder?: string;
  editable?: boolean;
}) => (
  <View className="mb-4">
    <Text className="text-gray-700 font-medium mb-1">{label}</Text>
    <TextInput
      className={`border rounded-xl px-4 py-2 ${
        editable ? "border-gray-300" : "border-gray-200 bg-gray-100"
      }`}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholder={placeholder}
      editable={editable}
    />
  </View>
);
