import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppDispatch } from "@/libs/stores";
import { getPackageById } from "@/libs/stores/packageManager/thunk";
import { usePackage } from "@/libs/hooks/usePackage";

interface Item {
  id: string;
  name: string;
  description: string;
  image: string;
  status: "draft" | "pending_approval" | "active" | "sold";
  category: string;
  weight: string;
  dimensions: string;
  price: string;
  origin: string;
  warranty: string;
  createdAt: string;
  updatedAt: string;
}

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
}

export default function ItemDetailScreen() {
  const navigation = useNavigation();
  const { id, packageImage } = useLocalSearchParams<{ id: string; packageImage?: string }>();
  const dispatch = useAppDispatch();
  const { packageDetail } = usePackage(); // Giả sử bạn có selector để lấy package chi tiết
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(getPackageById(id)); // Gọi API hoặc thunk để lấy thông tin package
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (packageDetail) {
      setItem({
        ...packageDetail,
        image: packageImage || packageDetail.image || "", // Ưu tiên packageImage từ params
      });
    }
  }, [packageDetail, packageImage]);

  if (!item) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-gray-600 text-lg">Đang tải chi tiết mặt hàng...</Text>
      </View>
    );
  }

  const renderStatus = (status: Item["status"]) => {
    let statusText: string;
    let statusClasses: string;
    let iconName: string;
    let iconColor: string;

    switch (status) {
      case "draft":
        statusText = "Bản nháp";
        statusClasses = "bg-yellow-100 text-yellow-600";
        iconName = "file-document-edit";
        iconColor = "#fbbf24";
        break;
      case "pending_approval":
        statusText = "Đang chờ duyệt";
        statusClasses = "bg-orange-100 text-orange-600";
        iconName = "clock-outline";
        iconColor = "#f97316";
        break;
      case "active":
        statusText = "Đang hoạt động";
        statusClasses = "bg-green-100 text-green-600";
        iconName = "check-circle";
        iconColor = "#22c55e";
        break;
      case "sold":
        statusText = "Đã bán";
        statusClasses = "bg-red-100 text-red-600";
        iconName = "tag-off";
        iconColor = "#ef4444";
        break;
      default:
        statusText = "Không xác định";
        statusClasses = "bg-gray-100 text-gray-500";
        iconName = "help-circle-outline";
        iconColor = "#6b7280";
    }

    return (
      <View className={`flex-row items-center rounded-full px-3 py-1 ${statusClasses}`}>
        <MaterialCommunityIcons name={iconName} size={16} color={iconColor} />
        <Text className={`text-sm ml-1 font-semibold ${statusClasses}`}>
          {statusText}
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" backgroundColor="#005cb8" />
      <ScrollView className="flex-1">
        <Image
          source={{ uri: item.image }}
          className="w-full h-64 bg-gray-200"
          resizeMode="cover"
        />
        <View className="p-4 bg-white rounded-b-lg shadow-md mb-4">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="flex-1 text-2xl font-bold text-gray-900 pr-2">
              {item.name}
            </Text>
            {renderStatus(item.status)}
          </View>
          <Text className="text-base text-gray-500 mb-4">Mã hàng: {item.id}</Text>

          <Text className="text-lg font-semibold text-gray-800 mb-2">Mô tả sản phẩm</Text>
          <Text className="text-base text-gray-700 leading-6 mb-4">
            {item.description}
          </Text>

          <View className="border-t border-gray-200 pt-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Thông tin chi tiết</Text>
            <DetailRow icon="tag-text-outline" label="Danh mục" value={item.category} />
            <DetailRow icon="weight" label="Khối lượng" value={item.weight} />
            <DetailRow icon="axis-arrow" label="Kích thước (RxSxH)" value={item.dimensions} />
            <DetailRow icon="cash" label="Giá tham khảo" value={item.price} />
            <DetailRow icon="earth" label="Xuất xứ" value={item.origin} />
            <DetailRow icon="calendar-check" label="Bảo hành" value={item.warranty} />
            <DetailRow
              icon="history"
              label="Ngày tạo"
              value={new Date(item.createdAt).toLocaleDateString("vi-VN")}
            />
            <DetailRow
              icon="update"
              label="Cập nhật gần nhất"
              value={new Date(item.updatedAt).toLocaleDateString("vi-VN")}
            />
          </View>
        </View>

        <View className="px-4 pb-4">
          <TouchableOpacity className="bg-blue-600 py-3 rounded-lg flex-row items-center justify-center mb-3">
            <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
            <Text className="text-white text-base font-bold ml-2">Chỉnh sửa mặt hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-red-500 py-3 rounded-lg flex-row items-center justify-center">
            <MaterialCommunityIcons name="delete" size={20} color="#fff" />
            <Text className="text-white text-base font-bold ml-2">Xóa mặt hàng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value }) => (
  <View className="flex-row items-center mb-2">
    <MaterialCommunityIcons name={icon} size={20} color="#6b7280" className="mr-2" />
    <Text className="text-gray-600 font-semibold">{label}: </Text>
    <Text className="text-gray-800 flex-1">{value}</Text>
  </View>
);