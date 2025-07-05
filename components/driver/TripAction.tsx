import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

interface TripStatusUpdaterProps {
  currentStatus: string;
  tripID: string;
}

const TripStatusUpdater: React.FC<TripStatusUpdaterProps> = ({
  currentStatus,
  tripID,
}) => {
  const router = useRouter();

  const handleNavigate = (newStatus: string, confirmationMessage: string) => {
    Alert.alert(
      "Xác nhận cập nhật trạng thái",
      confirmationMessage,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => {
            router.push({
              pathname: "/(delivery)/update",
              params: {
                tripID,
                status: newStatus,
              },
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderButton = (
    status: string,
    label: string,
    color: string,
    confirmationMsg: string
  ) => (
    <TouchableOpacity
      key={status}
      className={`py-3 px-6 rounded-lg mx-2 flex-1 items-center justify-center ${color}`}
      onPress={() => handleNavigate(status, confirmationMsg)}
    >
      <Text className="text-white font-semibold text-base">{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-row justify-around mt-6 mb-4">
      {currentStatus === "Scheduled" &&
        renderButton(
          "InProgress",
          "Bắt đầu chuyến đi",
          "bg-blue-600",
          "Bạn có chắc chắn muốn bắt đầu chuyến đi này?"
        )}

      {currentStatus === "InProgress" && (
        <>
          {renderButton(
            "Completed",
            "Hoàn thành",
            "bg-green-600",
            "Bạn có chắc chắn muốn đánh dấu chuyến đi này là đã hoàn thành?"
          )}
          {renderButton(
            "Cancelled",
            "Hủy chuyến",
            "bg-red-600",
            "Bạn có chắc chắn muốn hủy chuyến đi này?"
          )}
        </>
      )}

      {(currentStatus === "Completed" || currentStatus === "Cancelled") && (
        <Text className="text-center text-gray-500 italic mt-2">
          Chuyến đi đã {currentStatus === "Completed" ? "hoàn thành" : "bị hủy"}
          .
        </Text>
      )}
    </View>
  );
};

export default TripStatusUpdater;
