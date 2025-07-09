import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState, useMemo } from "react";
import { usePackage } from "@/libs/hooks/usePackage";
import { useAppDispatch } from "@/libs/stores";
import { getAllPackageByCustomer } from "@/libs/stores/packageManager/thunk";
import { managePackageActions } from "@/libs/stores/packageManager/slice";
import { useAuth } from "@/libs/context/AuthContext";
import isAuth from "@/components/isAuth";

const FILTERS = [
  { label: "Tất cả", value: null },
  { label: "Nhàn rỗi", value: "idle" },
  { label: "Đã liên kết", value: "linked" },
  { label: "Đang vận chuyển", value: "in_transit" },
  { label: "Đã giao", value: "delivered" },
  { label: "Đã hủy", value: "canceled" },
];

const YourPackageScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { packages, loading } = usePackage();
  const { setPackageID } = useAuth();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const safePackages = useMemo(() => packages || [], [packages]);

  const fetchPackages = async (pageNum: number) => {
    setIsFetchingMore(pageNum !== 1);
    try {
      const result = await dispatch(
        getAllPackageByCustomer({
          page: pageNum,
          limit,
          ...(status ? { status } : {}),
        })
      ).unwrap();
      if (!result.data.data || safePackages.length >= result.data.total) {
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    dispatch(managePackageActions.resetPackages());
    fetchPackages(1);
  }, [status]);

  const onRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    setHasMore(true);
    dispatch(managePackageActions.resetPackages());
    fetchPackages(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && !isFetchingMore && safePackages.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPackages(nextPage);
    }
  };

  const handlePressDetail = (item: any) => {
    router.push(`/(package)/${item.packageID}`);
  };

  const handleSendNow = (item: any) => {
    setPackageID(item.packageID);
    router.push(`/(search)`);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handlePressDetail(item)}
      className="mb-4 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
    >
      <View className="flex-row p-3 items-center">
        {item.packageImage ? (
          <Image
            source={{ uri: item.packageImage }}
            className="w-24 h-24 rounded-md mr-4"
            resizeMode="cover"
          />
        ) : null}
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
          <Text className="text-sm text-gray-600" numberOfLines={2}>
            {item.note || "Không có ghi chú"}
          </Text>
          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation();
              handleSendNow(item);
            }}
            className="mt-3 self-end bg-secondary px-4 py-2 rounded-lg flex-row items-center"
          >
            <Text className="text-white font-semibold mr-1">
              Gửi hàng ngay!
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
  );

  const renderFilter = () => (
    <View className="py-3 bg-white">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View className="flex-row gap-x-2">
          {FILTERS.map((item) => {
            const isActive = item.value === status;
            return (
              <TouchableOpacity
                key={item.label}
                onPress={() => setStatus(item.value)}
                className={`px-4 py-2 rounded-full border ${
                  isActive
                    ? "bg-secondary border-secondary"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`text-base font-medium ${
                    isActive ? "text-white" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#005cb8" />
      {renderFilter()}

      {loading && page === 1 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#005cb8" />
        </View>
      ) : (
        <FlatList
          data={safePackages}
          renderItem={renderItem}
          keyExtractor={(item) => item.packageID.toString()}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 60,
            paddingTop: 12,
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={["#005cb8"]}
              tintColor="#005cb8"
            />
          }
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator size="small" color="#005cb8" />
            ) : null
          }
          ListEmptyComponent={
            loading || isFetchingMore || safePackages.length > 0 ? null : (
              <View className="items-center justify-center mt-16 p-4">
                <MaterialCommunityIcons
                  name="package-variant-closed"
                  size={60}
                  color="#9ca3af"
                />
                <Text className="text-xl text-gray-500 font-semibold mt-4 text-center">
                  Không tìm thấy kiện hàng nào.
                </Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
};

export default isAuth(YourPackageScreen, ["Customer"]);
