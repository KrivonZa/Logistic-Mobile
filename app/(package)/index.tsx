import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useAppDispatch } from "@/libs/stores";
import { getPackageByCustomer } from "@/libs/stores/packageManager/thunk";
import { usePackage } from "@/libs/hooks/usePackage";

export default function YourPackageScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { packages } = usePackage();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getPackageByCustomer());
  }, []);

  const handlePressDetail = (item: any) => {
    router.push(`/(package)/${item.packageID}`);
  };

  const handleChooseItem = (item: any) => {
    router.push({
      pathname: "/(payment)",
      params: {
        item_id: item.packageID,
      },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#005cb8" />

      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {packages.length === 0 ? (
          <View className="items-center justify-center mt-16 p-4">
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={60}
              color="#9ca3af"
            />
            <Text className="text-xl text-gray-500 font-semibold mt-4 text-center">
              Bạn chưa có mặt hàng nào được tạo.
            </Text>
          </View>
        ) : (
          packages.map((item) => (
            <TouchableOpacity
              key={item.packageID}
              onPress={() => handleChooseItem(item)}
              className="mb-4 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <View className="flex-row p-3 items-center">
                <Image
                  source={{ uri: item.packageImage }}
                  className="w-24 h-24 rounded-md mr-4"
                  resizeMode="cover"
                />

                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-sm font-semibold text-gray-500">
                      Mã hàng: {item.packageID}
                    </Text>
                    {item.status === "draft" && (
                      <View className="flex-row items-center bg-yellow-100 rounded-full px-2 py-1">
                        <MaterialCommunityIcons
                          name="file-document-edit"
                          size={14}
                          color="#fbbf24"
                        />
                        <Text className="text-xs text-yellow-600 ml-1 font-semibold">
                          Bản nháp
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-lg font-bold text-label mb-1">
                    {item.packageName}
                  </Text>
                  <Text
                    className="text-sm text-gray-600 line-clamp-2"
                    numberOfLines={2}
                  >
                    {item.note}
                  </Text>
                  <TouchableOpacity
                    onPress={(event) => {
                      event.stopPropagation();
                      handlePressDetail(item);
                    }}
                    className="mt-3 self-end bg-primary px-4 py-2 rounded-lg flex-row items-center"
                  >
                    <Text className="text-white font-semibold mr-1">
                      Chi tiết
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={18}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
