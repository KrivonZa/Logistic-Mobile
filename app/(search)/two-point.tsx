import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from "axios";
import polyline from "@mapbox/polyline";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const { width, height } = Dimensions.get("window");
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

interface LatLng {
  latitude: number;
  longitude: number;
}

export default function TwoPointSearchScreen(): JSX.Element {
  const { lat, lng, description } = useLocalSearchParams();

  const [currentCoords, setCurrentCoords] = useState<LatLng | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAddress, setCurrentAddress] = useState("Đang lấy vị trí...");
  const [maxDistance, setMaxDistance] = useState("10");

  const destinationCoords: LatLng = {
    latitude: parseFloat(lat as string),
    longitude: parseFloat(lng as string),
  };

  const fetchRoute = async (from: LatLng, to: LatLng) => {
    try {
      const dirRes = await axios.get("https://rsapi.goong.io/Direction", {
        params: {
          origin: `${from.latitude},${from.longitude}`,
          destination: `${to.latitude},${to.longitude}`,
          vehicle: "car",
          api_key: process.env.EXPO_PUBLIC_GOONG_MAPS_API_KEY,
        },
      });

      const points = dirRes.data.routes[0]?.overview_polyline?.points;
      if (!points) throw new Error("Không có dữ liệu tuyến đường.");

      const decoded = polyline.decode(points).map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng,
      }));
      setRouteCoords(decoded);
    } catch (error) {
      console.error("Lỗi vẽ tuyến đường:", error);
      Alert.alert("Lỗi", "Không thể lấy tuyến đường. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Lỗi", "Cần quyền truy cập vị trí.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentCoords(coords);

      const res = await axios.get("https://rsapi.goong.io/Geocode", {
        params: {
          latlng: `${coords.latitude},${coords.longitude}`,
          api_key: process.env.EXPO_PUBLIC_GOONG_MAPS_API_KEY,
        },
      });

      const address = res.data?.results?.[0]?.formatted_address || "Vị trí hiện tại";
      setCurrentAddress(address);

      await fetchRoute(coords, destinationCoords);
      setLoading(false);
    })();
  }, []);

  if (loading || !currentCoords) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#005cb8" />
        <Text className="mt-4 text-label">Đang tải bản đồ...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ padding: 16, backgroundColor: "#005cb8" }}>
        <Text style={{ color: "white", marginBottom: 4 }}>Từ</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: "white", borderRadius: 8, marginBottom: 8 }}
        >
          <TextInput
            editable={false}
            selectTextOnFocus={false}
            caretHidden={true}
            value={currentAddress}
            style={{ padding: 12, fontSize: 16, minWidth: "100%" }}
            multiline={false}
            numberOfLines={1}
          />
        </ScrollView>

        <Text style={{ color: "white", marginBottom: 4 }}>Đến</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: "white", borderRadius: 8, marginBottom: 8 }}
        >
          <TextInput
            editable={false}
            selectTextOnFocus={false}
            caretHidden={true}
            value={description as string}
            style={{ padding: 12, fontSize: 16, minWidth: "100%" }}
            multiline={false}
            numberOfLines={1}
          />
        </ScrollView>

        <Text style={{ color: "white", marginBottom: 4 }}>
          Chọn khoảng cách tối đa (km)
        </Text>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 8,
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          <Picker
            selectedValue={maxDistance}
            onValueChange={(itemValue) => setMaxDistance(itemValue)}
          >
            <Picker.Item label="5 km" value="5" />
            <Picker.Item label="10 km" value="10" />
            <Picker.Item label="15 km" value="15" />
            <Picker.Item label="20 km" value="20" />
            <Picker.Item label="30 km" value="30" />
            <Picker.Item label="50 km" value="50" />
          </Picker>
        </View>

        <TouchableOpacity
          onPress={() => {
            if (currentCoords && destinationCoords) {
              console.log("====== Tìm kiếm nhà xe ======");
              console.log("Vị trí hiện tại:", currentCoords);
              console.log("Điểm đến:", destinationCoords);
              console.log("Khoảng cách tối đa:", maxDistance, "km");
              Alert.alert("Tìm kiếm đã được gửi!", "Xem kết quả trong console.");
            } else {
              Alert.alert("Thiếu thông tin", "Vui lòng chờ tải xong dữ liệu.");
            }
          }}
          style={{
            backgroundColor: "#FF712C",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Tìm chuyến xe</Text>
        </TouchableOpacity>
      </View>

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: currentCoords.latitude,
          longitude: currentCoords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        <Marker coordinate={currentCoords} title="Vị trí hiện tại" />
        <Marker coordinate={destinationCoords} title="Điểm đến" pinColor="orange" />
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeColor="#1e88e5" strokeWidth={5} />
        )}
      </MapView>
    </View>
  );
}
