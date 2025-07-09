import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/libs/context/AuthContext";
import { usePackage } from "@/libs/hooks/usePackage";
import { useRoute } from "@/libs/hooks/useRoute";
import { useOrder } from "@/libs/hooks/useOrder";
import { MaterialIcons } from "@expo/vector-icons";
import ImageModalViewer from "@/components/images/ImageZoomView";
import { useAppDispatch } from "@/libs/stores";
import { getPackageByID } from "@/libs/stores/packageManager/thunk";
import { createOrderDelivery } from "@/libs/stores/orderManager/thunk";
import priceTable from "@/price.json";

export default function CheckoutScreen() {
  const dispatch = useAppDispatch();
  const { packageID, companyName, companyID } = useAuth();
  const router = useRouter();

  const { packageDetail } = usePackage();
  const { routeDetail } = useRoute();
  const { loading } = useOrder();

  const [distanceText, setDistanceText] = useState("");
  const [durationText, setDurationText] = useState("");
  const [distanceValue, setDistanceValue] = useState(0);

  const [pickUpPointID, setPickUpPointID] = useState("");
  const [dropDownPointID, setDropDownPointID] = useState("");
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [isLoadingDistance, setIsLoadingDistance] = useState(false);

  const [payloadNote, setPayloadNote] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");

  useEffect(() => {
    dispatch(getPackageByID(packageID as string));
  }, []);

  type DistanceKey = "d1" | "d3" | "d7";
  type WeightKey =
    | "w1"
    | "w2"
    | "w3"
    | "w4"
    | "w5"
    | "w6"
    | "w7"
    | "w8"
    | "w9"
    | "w10";

  const getPriceFromTable = (
    weightStr: string,
    distanceInKm: number
  ): number => {
    const weight = parseFloat(weightStr);

    let distanceKey: DistanceKey;
    if (distanceInKm < 300000) distanceKey = "d1";
    else if (distanceInKm < 700000) distanceKey = "d3";
    else distanceKey = "d7";

    // Convert weight
    let weightKey: WeightKey;
    if (weight < 10) weightKey = "w1";
    else if (weight < 20) weightKey = "w2";
    else if (weight < 30) weightKey = "w3";
    else if (weight < 40) weightKey = "w4";
    else if (weight < 50) weightKey = "w5";
    else if (weight < 60) weightKey = "w6";
    else if (weight < 70) weightKey = "w7";
    else if (weight < 80) weightKey = "w8";
    else if (weight < 90) weightKey = "w9";
    else weightKey = "w10";

    return priceTable[distanceKey][weightKey] ?? 0;
  };

  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (packageDetail?.packageWeight && distanceValue > 0) {
      const calculatedPrice = getPriceFromTable(
        packageDetail.packageWeight,
        distanceValue
      );
      setPrice(calculatedPrice);
    }
  }, [packageDetail?.packageWeight, distanceValue]);

  //Tính tuyến đường
  useEffect(() => {
    const fetchDistance = async () => {
      if (pickUpPointID && dropDownPointID) {
        setIsLoadingDistance(true);

        const pick = routeDetail?.Waypoint.find(
          (wp) => wp.waypointID === pickUpPointID
        );
        const drop = routeDetail?.Waypoint.find(
          (wp) => wp.waypointID === dropDownPointID
        );

        if (pick?.geoLocation && drop?.geoLocation) {
          const pickLocation = JSON.parse(pick.geoLocation);
          const dropLocation = JSON.parse(drop.geoLocation);

          const [lng1, lat1] = pickLocation.coordinates;
          const [lng2, lat2] = dropLocation.coordinates;

          const origin = `${lat1},${lng1}`;
          const destination = `${lat2},${lng2}`;

          const result = await getDistanceBetweenPoints(origin, destination);

          if (result) {
            setDistanceText(result.distanceText);
            setDurationText(result.durationText);
            setDistanceValue(result.distanceValue);
          }
        }
        setIsLoadingDistance(false);
      }
    };

    fetchDistance();
  }, [pickUpPointID, dropDownPointID]);

  const getDistanceBetweenPoints = async (
    origin: string,
    destination: string
  ): Promise<{
    distanceText: string;
    distanceValue: number;
    durationText: string;
  } | null> => {
    const apiKey = process.env.EXPO_PUBLIC_GOONG_MAPS_API_KEY;
    const url = `https://rsapi.goong.io/Direction?origin=${origin}&destination=${destination}&vehicle=car&api_key=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data?.routes?.[0]?.legs?.[0]) {
        const leg = data.routes[0].legs[0];
        return {
          distanceText: leg.distance.text,
          distanceValue: leg.distance.value,
          durationText: leg.duration.text,
        };
      } else {
        return null;
      }
    } catch {
      return null;
    }
  };

  if (!packageDetail || !routeDetail) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-base text-red-600 text-center">
          Không tìm thấy thông tin đơn hàng hoặc lộ trình.
        </Text>
      </View>
    );
  }

  const formattedPrice = price.toLocaleString("vi-VN") + " VNĐ";

  const handleCancel = () => {
    if (!pickUpPointID || !dropDownPointID) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }
  };

  const handleCheckout = async () => {
    if (!pickUpPointID || !dropDownPointID) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const data = {
      routeID: routeDetail.routeID,
      companyID: companyID as string,
      pickUpPointID,
      dropDownPointID,
      packageID: packageID as string,
      price: price,
      payloadNote,
    };

    await dispatch(createOrderDelivery(data));
    Alert.alert(
      "Tạo đơn thành công",
      "Đơn sẽ được xét duyệt bởi doanh nghiệp trong vòng 24h tới",
      [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/order"),
        },
      ],
      { cancelable: false }
    );
  };

  const images = packageDetail.packageImage
    ? [{ url: packageDetail.packageImage }]
    : [];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Chi tiết kiện hàng */}
        <View className="bg-white rounded-xl p-5 mb-4 shadow-md">
          <Text className="text-2xl text-center font-semibold text-secondary mb-3">
            Chi tiết kiện hàng
          </Text>

          {packageDetail.packageImage ? (
            <TouchableOpacity onPress={() => setIsImageViewerVisible(true)}>
              <Image
                source={{ uri: packageDetail.packageImage }}
                className="w-full h-40 rounded-lg mb-4 object-cover"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) : (
            <View className="w-full h-40 rounded-lg mb-4 bg-gray-200 items-center justify-center">
              <MaterialIcons
                name="image-not-supported"
                size={48}
                color="gray"
              />
              <Text className="text-gray-500 text-sm mt-2">
                Không có hình ảnh
              </Text>
            </View>
          )}

          <View className="flex-row justify-between mb-2 pb-1 border-b border-gray-200">
            <Text className="text-base text-gray-700">Tên kiện hàng:</Text>
            <Text className="text-base text-gray-800 font-medium">
              {packageDetail.packageName}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2 pb-1 border-b border-gray-200">
            <Text className="text-base text-gray-700">Khối lượng:</Text>
            <Text className="text-base text-gray-800 font-medium">
              {packageDetail.packageWeight} kg
            </Text>
          </View>
          <View className="flex-row justify-between mb-2 pb-1 border-b border-gray-200">
            <Text className="text-base text-gray-700">Ghi chú:</Text>
            <Text className="text-base text-gray-800 font-medium">
              {packageDetail.note || "Không có"}
            </Text>
          </View>
          <View className="flex-row items-center mt-3 pt-3">
            <MaterialIcons name="money" size={24} color="#4CAF50" />
            <Text className="text-xl font-bold text-green-600 ml-1">
              Giá vận chuyển:
              {isLoadingDistance ? (
                <Text className="text-base text-gray-400 italic">
                  Đang tính...
                </Text>
              ) : (
                <Text> {formattedPrice}</Text>
              )}
            </Text>
          </View>
        </View>

        {/* Thông tin lộ trình */}
        <View className="bg-white rounded-xl p-5 mb-4 shadow-md">
          <Text className="text-2xl text-center font-semibold text-secondary mb-3">
            Thông tin lộ trình
          </Text>

          <View className="flex-row justify-between mb-2 pb-1 border-b border-gray-200">
            <Text className="text-base text-gray-700">Tên lộ trình:</Text>
            <Text className="text-base text-gray-800 font-medium">
              {routeDetail.routeName}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2 pb-1 border-b border-gray-200">
            <Text className="text-base text-gray-700">Nhà xe:</Text>
            <Text className="text-base text-gray-800 font-medium">
              {companyName}
            </Text>
          </View>
          {(isLoadingDistance || (distanceText && durationText)) && (
            <View className="mt-2 mb-2 pt-2">
              <View className="flex-row justify-between mb-1">
                <Text className="text-base text-gray-700">Khoảng cách:</Text>
                {isLoadingDistance ? (
                  <Text className="text-base text-gray-400 italic">
                    Đang tính...
                  </Text>
                ) : (
                  <Text className="text-base text-gray-800 font-medium">
                    {distanceText}
                  </Text>
                )}
              </View>
              <View className="flex-row justify-between">
                <Text className="text-base text-gray-700">
                  Thời gian ước tính:
                </Text>
                {isLoadingDistance ? (
                  <Text className="text-base text-gray-400 italic">
                    Đang tính...
                  </Text>
                ) : (
                  <Text className="text-base text-gray-800 font-medium">
                    {durationText}
                  </Text>
                )}
              </View>
            </View>
          )}

          <Text className="mt-4 mb-2 text-base font-semibold text-gray-800 flex-row items-center">
            <MaterialIcons name="my-location" size={16} color="#333333" /> Chọn
            điểm nhận hàng:
          </Text>
          {routeDetail.Waypoint.map((wp) => {
            const isDisabled = dropDownPointID === wp.waypointID;
            const isSelected = pickUpPointID === wp.waypointID;

            return (
              <TouchableOpacity
                key={wp.waypointID}
                onPress={() => !isDisabled && setPickUpPointID(wp.waypointID)}
                className={`p-3 rounded-lg border mb-2 ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50"
                } ${isDisabled ? "opacity-50" : ""}`}
                disabled={isDisabled}
              >
                <Text
                  className={`text-base ${
                    isSelected ? "text-blue-700 font-bold" : "text-gray-800"
                  }`}
                >
                  {wp.location}
                </Text>
              </TouchableOpacity>
            );
          })}

          <Text className="mt-4 mb-2 text-base font-semibold text-gray-800 flex-row items-center">
            <MaterialIcons name="location-on" size={16} color="#333333" /> Chọn
            điểm trả hàng:
          </Text>
          {routeDetail.Waypoint.map((wp) => {
            const isDisabled = pickUpPointID === wp.waypointID;
            const isSelected = dropDownPointID === wp.waypointID;

            return (
              <TouchableOpacity
                key={wp.waypointID}
                onPress={() => !isDisabled && setDropDownPointID(wp.waypointID)}
                className={`p-3 rounded-lg border mb-2 ${
                  isSelected
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 bg-gray-50"
                } ${isDisabled ? "opacity-50" : ""}`}
                disabled={isDisabled}
              >
                <Text
                  className={`text-base ${
                    isSelected ? "text-green-700 font-bold" : "text-gray-800"
                  }`}
                >
                  {wp.location}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recipient Info */}
        <View className="bg-white rounded-xl p-5 shadow-md">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Thông tin người nhận và ghi chú
          </Text>
          <TextInput
            placeholder="Họ và tên người nhận"
            value={recipientName}
            onChangeText={setRecipientName}
            className="mb-3 border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800 bg-white"
          />
          <TextInput
            placeholder="Số điện thoại"
            value={recipientPhone}
            onChangeText={setRecipientPhone}
            keyboardType="phone-pad"
            className="mb-3 border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800 bg-white"
          />
          <TextInput
            placeholder="Ghi chú (nếu có)"
            value={payloadNote}
            onChangeText={setPayloadNote}
            multiline
            className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800 bg-white h-24"
          />
        </View>
      </ScrollView>

      {/* Bottom buttons */}
      <View className="absolute bottom-4 left-0 right-0 px-4">
        <TouchableOpacity
          onPress={handleCheckout}
          disabled={!price}
          className={` ${
            price ? "bg-primary" : "bg-gray-400"
          } flex-1 py-4 rounded-xl items-center justify-center shadow-lg`}
        >
          {loading ? (
            <ActivityIndicator className="text-xl text-white" />
          ) : (
            <View className="flex-row">
              <MaterialIcons name="check" size={24} color="#fff" />
              <Text className="text-white text-lg font-bold ml-2">
                Tạo đơn - {formattedPrice}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Image Viewer */}
      <ImageModalViewer
        visible={isImageViewerVisible}
        images={images}
        onClose={() => setIsImageViewerVisible(false)}
      />
    </SafeAreaView>
  );
}
