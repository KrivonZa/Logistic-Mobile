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

export default function YourPackageScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const handlePressDetail = (item: any) => {
    router.push(`/(package)/${item.id}`);
  };

  const handleChooseItem = (item: any) => {
    router.push({
      pathname: "/(payment)",
      params: {
        item_id: item.id,
      },
    });
  };

  const yourItems = [
    {
      id: "SP001",
      name: "Tủ lạnh Samsung Inverter",
      description: "Tủ lạnh 2 cánh, dung tích 300L, tiết kiệm điện.",
      image:
        "https://cdn.nguyenkimmall.com/images/detailed/666/10046329-tu-lanh-samsung-inverter-380l-rt38k50822c-sv-2.jpg",
      status: "draft",
    },
    {
      id: "SP002",
      name: "Máy giặt Electrolux 9kg",
      description:
        "Máy giặt lồng ngang, công nghệ UltraMix, giặt sạch hiệu quả.",
      image:
        "https://th.bing.com/th/id/R.3644ab582d4e8112fb23d0ebdd2d0e12?rik=3v14%2fsWDST4qVA&riu=http%3a%2f%2fdienlanhbavinh.com%2fwp-content%2fuploads%2f2018%2f12%2fIMG_20180526_2151221.jpg&ehk=1zvMH88OFvoTe%2boDRYGxGtqBXyBuDTlBWyZL2zAP2XE%3d&risl=&pid=ImgRaw&r=0",
      status: "draft",
    },
    {
      id: "SP003",
      name: "Laptop Dell XPS 15",
      description: "Màn hình 4K, RAM 16GB, SSD 512GB, card đồ họa rời.",
      image:
        "https://th.bing.com/th/id/OIP.hSos162cCyBM6uVNiOFmFQHaE8?rs=1&pid=ImgDetMain",
      status: "draft",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#005cb8" />

      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {yourItems.length === 0 ? (
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
          yourItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleChooseItem(item)}
              className="mb-4 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <View className="flex-row p-3 items-center">
                <Image
                  source={{ uri: item.image }}
                  className="w-24 h-24 rounded-md mr-4"
                  resizeMode="cover"
                />

                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-sm font-semibold text-gray-500">
                      Mã hàng: {item.id}
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
                    {item.name}
                  </Text>
                  <Text
                    className="text-sm text-gray-600 line-clamp-2"
                    numberOfLines={2}
                  >
                    {item.description}
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
