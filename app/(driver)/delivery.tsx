import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppDispatch } from "@/libs/stores";
import { useAuth } from "@/libs/context/AuthContext";
import { getTripByDriver } from "@/libs/stores/tripManager/thunk";
import { useTrip } from "@/libs/hooks/useTrip";
import { format } from "date-fns";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import TripStatusUpdater from "@/components/driver/TripAction";

export default function TripListScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { trips, loading, total } = useTrip();
  const router = useRouter();

  const driverID =
    user?.account?.role === "Driver"
      ? user.account.detail?.driverID
      : undefined;

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>("Scheduled");
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const limit = 10;

  const fetchData = useCallback(
    (reset = false) => {
      if (!driverID) return;
      dispatch(
        getTripByDriver({
          driverID,
          page: reset ? 1 : page,
          limit,
          status,
          dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : "",
        })
      );
    },
    [driverID, page, status, dueDate]
  );

  useEffect(() => {
    fetchData(true);
  }, [driverID, status, dueDate]);

  useEffect(() => {
    if (page > 1) fetchData();
  }, [page]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchData(true);
    setRefreshing(false);
  };

  const onEndReached = () => {
    if (trips.length < total && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const statusMap: { [key: string]: string } = {
    InProgress: "Đang tiến hành",
    Scheduled: "Đã lên lịch",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
  };

  const statuses = Object.keys(statusMap);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");

    if (event.type === "set" && selectedDate) {
      setDueDate(selectedDate);
      setPage(1);
    } else if (event.type === "dismissed") {
    }
  };

  const renderItem = ({ item }: any) => {
    const { status, dueTime, driver, vehicle, deliveryOrder, route } = item;
    const pkg = deliveryOrder.Package;
    const pickUp = deliveryOrder.Waypoint_DeliveryOrder_pickUpPointIDToWaypoint;
    const dropDown =
      deliveryOrder.Waypoint_DeliveryOrder_dropDownPointIDToWaypoint;

    return (
      <TouchableOpacity
        className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
        onPress={() => router.push(`/(delivery)/${item.tripID}`)}
      >
        <View className="justify-between items-center mb-2">
          <Text className="text-base font-bold text-gray-800">
            {route.routeName}
          </Text>
          <Text className="text-sm text-gray-500">
            Ngày: {format(new Date(dueTime), "dd/MM/yyyy")}
          </Text>
        </View>

        <View className="border-t border-gray-100 pt-2 mb-2">
          <Text className="text-sm text-gray-700 mb-1">
            <Text className="font-medium">Gói hàng:</Text> {pkg.packageName} –{" "}
            {pkg.packageWeight}kg
          </Text>

          <View className="mb-1">
            <View className="flex-row items-center">
              <Text className="font-medium text-sm">Điểm nhận:</Text>
              <Text className="text-sm text-gray-700" numberOfLines={2}>
                {pickUp.location}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="font-medium text-sm">Điểm trả:</Text>
              <Text className="text-sm text-gray-700" numberOfLines={2}>
                {dropDown.location}
              </Text>
            </View>
          </View>

          {deliveryOrder.payloadNote && (
            <Text className="text-sm text-gray-600 italic mb-1">
              <Text className="font-medium">Ghi chú:</Text>{" "}
              {deliveryOrder.payloadNote}
            </Text>
          )}

          {pkg.packageImage && (
            <Image
              source={{ uri: pkg.packageImage }}
              className="w-full h-40 rounded-lg mt-3"
              resizeMode="cover"
            />
          )}
        </View>

        <View className="mt-3 items-end">
          <Text
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              status === "Completed"
                ? "bg-green-100 text-green-700"
                : status === "InProgress"
                ? "bg-yellow-100 text-yellow-700"
                : status === "Cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {statusMap[status] || status}
          </Text>
        </View>
        {item && (
          <TripStatusUpdater currentStatus={status} tripID={item.tripID} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 py-4 bg-white border-b border-gray-200 shadow-sm">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-xl font-bold text-gray-900">
            {user?.account.fullName}
          </Text>
          <View className="flex-row items-center">
            {dueDate && (
              <TouchableOpacity
                onPress={() => {
                  setDueDate(undefined);
                  setPage(1);
                }}
                className="mr-2 px-3 py-2 rounded-lg border border-red-800 bg-red-600"
              >
                <MaterialIcons name="delete" size={16} color={"#FFF"} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="flex-row items-center bg-blue-600 px-4 py-2 rounded-xl shadow-md"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-white text-sm font-semibold">
                {dueDate ? format(dueDate, "dd/MM") : "Ngày"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-2">
          <FlatList
            horizontal
            data={statuses}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 4 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`px-5 py-2 rounded-full mr-2 shadow-sm ${
                  status === item ? "bg-blue-600" : "bg-gray-200"
                }`}
                onPress={() => {
                  setStatus(status === item ? undefined : item);
                  setPage(1);
                }}
              >
                <Text
                  className={`text-sm font-medium ${
                    status === item ? "text-white" : "text-gray-700"
                  }`}
                >
                  {statusMap[item]}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}

      {loading && page === 1 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.tripID}
          renderItem={renderItem}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.2}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2563EB"]}
            />
          }
          ListFooterComponent={
            loading && page > 1 ? (
              <ActivityIndicator className="my-4" color="#2563EB" />
            ) : null
          }
          ListEmptyComponent={
            !loading ? (
              <View className="items-center justify-center mt-20 p-4">
                <Text className="text-gray-500 text-lg text-center">
                  Không có chuyến đi nào được tìm thấy.
                </Text>
                <Text className="text-gray-400 text-sm mt-2">
                  Hãy thử thay đổi ngày hoặc trạng thái tìm kiếm.
                </Text>
              </View>
            ) : null
          }
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
