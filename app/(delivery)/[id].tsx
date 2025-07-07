import { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAppDispatch } from "@/libs/stores";
import { useTrip } from "@/libs/hooks/useTrip";
import { getTripByID } from "@/libs/stores/tripManager/thunk";
import { useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import TripStatusUpdater from "@/components/driver/TripAction";
import { useRouter } from "expo-router";
import { getSocket } from "@/libs/thirdParty/socket/socket";

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

const InfoCard = ({ title, children }: InfoCardProps) => (
  <View className="bg-white rounded-lg shadow-md mb-4 p-4">
    <Text className="text-lg font-bold text-gray-800 mb-3">{title}</Text>
    {children}
  </View>
);

export default function DeliveryDetail() {
  const dispatch = useAppDispatch();
  const { loading, tripDetail } = useTrip();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    if (id) dispatch(getTripByID(id));
  }, [id, dispatch]);

  if (loading || !tripDetail) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-2 text-blue-700">Đang tải chi tiết...</Text>
      </View>
    );
  }

  const {
    tripID,
    status,
    dueTime,
    startTime,
    endTime,
    vehicle,
    route,
    deliveryOrder,
  } = tripDetail;

  const formatDate = (date: string | null) =>
    date ? format(new Date(date), "dd/MM/yyyy HH:mm") : "Chưa có";

  const handleChat = async (receiverID?: string) => {
    if (!receiverID) return;

    const socket = await getSocket();

    if (!socket.connected) {
      console.warn("⚠️ Socket chưa kết nối");
      return;
    }

    socket.emit("send_message", {
      receiverID,
      content: "Chào bạn nhé!",
    });

    socket.once("message_sent", (message: any) => {
      if (message?.conversationID) {
        router.push(`/(chat)/${message.conversationID}`);
      }
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Chi Tiết Chuyến Đi
      </Text>

      <InfoCard title="Thông Tin Chuyến Đi">
        <Text className="text-base text-gray-700 mb-1">
          <Text className="font-semibold">Mã chuyến:</Text> {tripID}
        </Text>
        <Text className="text-base text-gray-700 mb-1">
          <Text className="font-semibold">Tình trạng:</Text> {status}
        </Text>
        <Text className="text-base text-gray-700 mb-1">
          <Text className="font-semibold">Ngày dự kiến:</Text>{" "}
          {formatDate(dueTime)}
        </Text>
        <Text className="text-base text-gray-700 mb-1">
          <Text className="font-semibold">Bắt đầu:</Text>{" "}
          {formatDate(startTime)}
        </Text>
        <Text className="text-base text-gray-700">
          <Text className="font-semibold">Kết thúc:</Text> {formatDate(endTime)}
        </Text>
        {tripDetail && (
          <TripStatusUpdater
            currentStatus={tripDetail.status}
            tripID={tripDetail.tripID}
          />
        )}
      </InfoCard>

      <InfoCard title="Tuyến Đường">
        <Text className="text-base text-gray-700">{route.routeName}</Text>
      </InfoCard>

      <InfoCard title="Thông Tin Phương Tiện">
        {vehicle.vehicleImage && (
          <Image
            source={{ uri: vehicle.vehicleImage }}
            className="w-full h-48 rounded-lg mb-3"
            resizeMode="cover"
          />
        )}
        <Text className="text-base text-gray-700 mb-1">
          <Text className="font-semibold">Biển số:</Text>{" "}
          {vehicle.vehicleNumber}
        </Text>
        <Text className="text-base text-gray-700 mb-1">
          <Text className="font-semibold">Tải trọng:</Text>{" "}
          {vehicle.loadCapacity} kg
        </Text>
        <Text className="text-base text-gray-700">
          <Text className="font-semibold">Trạng thái:</Text> {vehicle.status}
        </Text>
      </InfoCard>

      <InfoCard title="Thông Tin Hàng Hóa">
        {deliveryOrder.Package.packageImage && (
          <Image
            source={{ uri: deliveryOrder.Package.packageImage }}
            className="w-full h-48 rounded-lg mb-3"
            resizeMode="cover"
          />
        )}
        <Text className="text-base text-gray-700 mb-1">
          <Text className="font-semibold">Tên hàng:</Text>{" "}
          {deliveryOrder.Package.packageName}
        </Text>
        <Text className="text-base text-gray-700 mb-1">
          <Text className="font-semibold">Khối lượng:</Text>{" "}
          {deliveryOrder.Package.packageWeight} kg
        </Text>
        <Text className="text-base text-gray-700">
          <Text className="font-semibold">Ghi chú:</Text>{" "}
          {deliveryOrder.Package.note || "Không có"}
        </Text>
      </InfoCard>

      <InfoCard title="Thông Tin Khách Hàng">
        <View className="gap-y-1">
          <Text className="text-base text-gray-700">
            <Text className="font-semibold">Họ tên: </Text>
            {deliveryOrder.Customer.Account.fullName}
          </Text>
          <Text className="text-base text-gray-700">
            <Text className="font-semibold">SĐT: </Text>
            {deliveryOrder.Customer.phoneNumber}
          </Text>
          <Text className="text-base text-gray-700">
            <Text className="font-semibold">Email: </Text>
            {deliveryOrder.Customer.Account.email}
          </Text>
          <Text className="text-base text-gray-700">
            <Text className="font-semibold">Địa chỉ: </Text>
            {deliveryOrder.Customer.address}
          </Text>
        </View>

        <View className="mt-4 items-end">
          <TouchableOpacity
            className="bg-primary px-5 py-2 rounded-full"
            onPress={() => handleChat(deliveryOrder.Customer.Account.accountID)}
          >
            <Text className="text-white text-sm font-medium">Liên hệ</Text>
          </TouchableOpacity>
        </View>
      </InfoCard>

      <InfoCard title="Điểm Nhận và Trả">
        <Text className="text-base text-gray-700 mb-1">
          <Text className="font-semibold">Nhận hàng tại:</Text>{" "}
          {
            deliveryOrder.Waypoint_DeliveryOrder_pickUpPointIDToWaypoint
              .location
          }
        </Text>
        <Text className="text-base text-gray-700">
          <Text className="font-semibold">Trả hàng tại:</Text>{" "}
          {
            deliveryOrder.Waypoint_DeliveryOrder_dropDownPointIDToWaypoint
              .location
          }
        </Text>
      </InfoCard>

      <InfoCard title="Hình Ảnh Giao Nhận">
        {deliveryOrder.pickUpImage && (
          <View className="mb-3">
            <Text className="text-sm text-gray-600 mb-1">
              Hình ảnh nhận hàng:
            </Text>
            <Image
              source={{ uri: deliveryOrder.pickUpImage }}
              className="w-full h-48 rounded-lg"
              resizeMode="cover"
            />
          </View>
        )}
        {deliveryOrder.dropDownImage && (
          <View>
            <Text className="text-sm text-gray-600 mb-1">
              Hình ảnh trả hàng:
            </Text>
            <Image
              source={{ uri: deliveryOrder.dropDownImage }}
              className="w-full h-48 rounded-lg"
              resizeMode="cover"
            />
          </View>
        )}
        {!deliveryOrder.pickUpImage && !deliveryOrder.dropDownImage && (
          <Text className="text-base text-gray-500">
            Chưa có hình ảnh giao nhận.
          </Text>
        )}
      </InfoCard>
      <View className="h-4" />
    </ScrollView>
  );
}
