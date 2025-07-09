import { Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@/libs/context/AuthContext";
import { DriverDetail, CustomerDetail } from "@/libs/types/account";
import dayjs from "dayjs";

export default function ProfileScreen() {
  const user = useUser();
  if (!user) return null;
  const router = useRouter();

  const { account } = user;
  const detail = account.detail;
  const isDriver = account.role === "Driver";
  const avatarUrl = account.avatar || "https://i.pravatar.cc/150";

  return (
    <ScrollView className="flex-1 bg-white pt-8">
      {/* Avatar & header */}
      <View className="px-5 pb-6 items-center border-b border-gray-100 bg-white">
        <View className="relative mb-4">
          <Image
            source={{ uri: avatarUrl }}
            className="w-32 h-32 rounded-full border-4 border-primary"
          />
          <TouchableOpacity
            className="absolute top-0 right-0 bg-gray-100 p-2 rounded-full shadow-sm z-10"
            onPress={() => {
              router.push("/edit");
            }}
          >
            <MaterialIcons name="edit" size={20} color="#005cb8" />
          </TouchableOpacity>
        </View>
        <Text className="text-2xl font-bold text-label mb-1">
          {account.fullName}
        </Text>
        <Text className="text-base text-gray-500">Thông tin cá nhân</Text>
      </View>

      {/* Chi tiết tài khoản */}
      <View className="px-5 py-6">
        <Text className="text-xl font-bold text-label mb-5">
          Chi tiết tài khoản
        </Text>

        {/* Email */}
        <InfoRow icon="email" label="Email" value={account.email} />
        {/* Phone */}
        <InfoRow
          icon="phone"
          label="Số điện thoại"
          value={detail.phoneNumber}
        />

        {/* Customer fields */}
        {!isDriver && (
          <InfoRow
            icon="location-on"
            label="Địa chỉ"
            value={(detail as CustomerDetail).address}
            multiline
          />
        )}

        {/* Driver fields */}
        {isDriver && (
          <>
            <InfoRow
              icon="badge"
              label="Số CMND/CCCD"
              value={(detail as DriverDetail).identityNumber}
            />
            <InfoRow
              icon="credit-card"
              label="Bằng lái"
              value={(detail as DriverDetail).licenseNumber}
            />
            <InfoRow
              icon="layers"
              label="Hạng"
              value={(detail as DriverDetail).licenseLevel}
            />
            <InfoRow
              icon="event"
              label="Ngày hết hạn"
              value={dayjs((detail as DriverDetail).licenseExpiry).format(
                "DD/MM/YYYY"
              )}
            />
            <InfoRow
              icon="business"
              label="Công ty"
              value={(detail as DriverDetail).companyName}
            />
          </>
        )}

        {/* Info Box */}
        <View className="my-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Text className="text-base font-semibold text-blue-700 mb-2">
            Lưu ý quan trọng:
          </Text>
          <Text className="text-sm text-blue-600">
            Mọi thông tin cá nhân của bạn đều được bảo mật. Vui lòng liên hệ bộ
            phận hỗ trợ nếu có bất kỳ thắc mắc nào.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Component hàng thông tin
const InfoRow = ({
  icon,
  label,
  value,
  multiline = false,
}: {
  icon: any;
  label: string;
  value: string;
  multiline?: boolean;
}) => {
  return (
    <View className="flex-row items-start mb-4 p-4 bg-gray-100 rounded-lg shadow-xs">
      <MaterialIcons name={icon} size={24} color={"#005cb8"} />
      <View className="ml-4 flex-1">
        <Text className="text-sm font-semibold text-gray-700">{label}</Text>
        <Text
          className={`text-base text-label ${multiline ? "mt-1" : ""}`}
          numberOfLines={multiline ? 3 : 1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};
