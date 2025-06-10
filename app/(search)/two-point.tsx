import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";

interface LocationCoords {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

const { width, height } = Dimensions.get("window");

export default function TwoPointSearchScreen(): JSX.Element {
  const { destinationQuery } = useLocalSearchParams();
  const destination = Array.isArray(destinationQuery)
    ? destinationQuery[0]
    : destinationQuery || "";

  const [destinationText, setDestinationText] = useState<string>(destination);
  const router = useRouter();

  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(
    null
  );
  const [currentLocationAddress, setCurrentLocationAddress] =
    useState<string>("Đang lấy vị trí...");
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Quyền truy cập vị trí bị từ chối.");
        setLoadingLocation(false);
        Alert.alert(
          "Lỗi",
          "Ứng dụng cần quyền truy cập vị trí để hiển thị bản đồ."
        );
        return;
      }

      try {
        let locationResult = await Location.getCurrentPositionAsync({});
        setCurrentLocation(locationResult.coords);

        let geocode = await Location.reverseGeocodeAsync({
          latitude: locationResult.coords.latitude,
          longitude: locationResult.coords.longitude,
        });

        if (geocode && geocode.length > 0) {
          const address = geocode[0];
          const fullAddress = [
            address.name,
            address.street,
            address.district,
            address.city,
            address.region,
            address.country,
          ]
            .filter(Boolean)
            .join(", ");
          setCurrentLocationAddress(fullAddress || "Vị trí hiện tại");
        } else {
          setCurrentLocationAddress("Vị trí hiện tại");
        }
        setLoadingLocation(false);
      } catch (error) {
        setErrorMsg("Không thể lấy vị trí hiện tại. Vui lòng kiểm tra GPS.");
        setLoadingLocation(false);
        Alert.alert(
          "Lỗi",
          "Không thể lấy vị trí hiện tại của bạn. Vui lòng bật GPS và thử lại."
        );
      }
    })();
  }, []);

  const handleContinue = () => {
    if (!currentLocation) {
      Alert.alert("Lỗi", "Không thể xác định vị trí hiện tại của bạn.");
      return;
    }
    if (!destinationText.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập điểm đến.");
      return;
    }

    router.push({
      pathname: "/(search)/result",
      params: {
        fromLocation: currentLocationAddress,
        toLocation: destinationText,
      },
    });
  };

  if (loadingLocation) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#005cb8" />
        <Text className="mt-4 text-label">Đang tải vị trí...</Text>
      </View>
    );
  }

  if (errorMsg || !currentLocation) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <MaterialIcons name="error-outline" size={48} color="red" />
        <Text className="mt-4 text-lg text-label text-center">
          {errorMsg || "Không thể lấy được vị trí."}
        </Text>
        <Text className="mt-2 text-gray-500 text-center">
          Vui lòng cấp quyền truy cập vị trí và thử lại.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <View className="p-4 bg-primary border-b border-gray-200 shadow-sm">
        <Text className="text-xl font-bold text-white mb-4">Chọn điểm đến</Text>

        <View className="flex-row items-center w-full bg-white rounded-lg px-4 py-3 mb-3 shadow-md border border-gray-100">
          <MaterialIcons name="my-location" size={20} color="#005cb8" />
          <TextInput
            className="flex-1 ml-3 text-label text-base font-semibold"
            value={currentLocationAddress}
            editable={false}
          />
        </View>

        <TouchableOpacity className="flex-row items-center w-full bg-white rounded-lg px-4 py-3 mb-4 shadow-md border border-gray-100">
          <MaterialIcons name="location-on" size={20} color="#FF712C" />
          <TextInput
            className="flex-1 ml-3 text-label text-base"
            placeholder="Điểm đến của bạn..."
            placeholderTextColor="#6B7280"
            value={destinationText}
            onChangeText={setDestinationText}
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full bg-secondary py-4 rounded-lg items-center justify-center shadow-lg"
          onPress={handleContinue}
        >
          <Text className="text-white text-lg font-semibold">Tiếp tục</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 bg-white items-center justify-center">
        <MapView
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 12,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Vị trí hiện tại"
            description="Bạn đang ở đây"
            pinColor="#FF712C"
          />
        </MapView>
      </View>
    </View>
  );
}
