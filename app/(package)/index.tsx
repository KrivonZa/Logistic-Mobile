import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState, useMemo } from "react";
import { usePackage } from "@/libs/hooks/usePackage";
import { useAppDispatch } from "@/libs/stores";
import { getPackageIdleByCustomer } from "@/libs/stores/packageManager/thunk";
import { managePackageActions } from "@/libs/stores/packageManager/slice";
import { useAuth } from "@/libs/context/AuthContext";

export default function YourPackageScreen() {
  const { routeID, setPackageID } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { packages, loading } = usePackage();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const route = routeID as string;

  const safePackages = useMemo(() => packages || [], [packages]);

  const fetchPackages = async (pageNum: number) => {
    setIsFetchingMore(pageNum !== 1);
    try {
      const result = await dispatch(
        getPackageIdleByCustomer({ page: pageNum, limit, routeID: route })
      ).unwrap();
      if (!result.data.data || safePackages.length >= result.data.total) {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!route) {
      setHasMore(false);
      return;
    }
    setPage(1);
    setHasMore(true);
    dispatch(managePackageActions.resetPackages());
    fetchPackages(1);
  }, [routeID, dispatch]);

  const onRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    setHasMore(true);
    dispatch(managePackageActions.resetPackages());
    fetchPackages(1);
  };

  const handleLoadMore = () => {
    if (!isFetchingMore && hasMore && safePackages.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPackages(nextPage);
    } else {
    }
  };

  const handlePressDetail = (item: any) => {
    router.push(`/(package)/${item.packageID}`);
  };

  const handleChooseItem = (item: any) => {
    setPackageID(item.packageID);
    router.push({
      pathname: "/(payment)",
      params: {
        item_id: item.packageID,
      },
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
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
          <Text className="text-sm text-gray-600" numberOfLines={2}>
            {item.note || "Không có ghi chú"}
          </Text>
          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation();
              handlePressDetail(item);
            }}
            className="mt-3 self-end bg-primary px-4 py-2 rounded-lg flex-row items-center"
          >
            <Text className="text-white font-semibold mr-1">Chi tiết</Text>
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

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#005cb8" />
      <FlatList
        data={safePackages}
        renderItem={renderItem}
        keyExtractor={(item) => item.packageID.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
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
          loading ? null : (
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
          )
        }
      />
    </View>
  );
}
