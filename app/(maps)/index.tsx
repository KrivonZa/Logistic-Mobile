import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";

interface Point {
  name: string;
  latitude: number;
  longitude: number;
}

const LOCATIONS: Point[] = [
  { name: "Ngã tư Thủ Đức", latitude: 10.849596, longitude: 106.774166 },
  { name: "Ngã tư Hàng Xanh", latitude: 10.80161, longitude: 106.712158 },
  { name: "Đài truyền hình HTV", latitude: 10.788228, longitude: 106.699348 },
  { name: "Chợ hoa Hồ Thị Kỷ", latitude: 10.766504, longitude: 106.678472 },
  { name: "Ngã Bảy Lý Thái Tổ", latitude: 10.767647, longitude: 106.6744 },
  { name: "BV Phạm Ngọc Thạch", latitude: 10.756092, longitude: 106.665291 },
  { name: "Thuận Kiều Plaza", latitude: 10.754529, longitude: 106.657655 },
  {
    name: "Đầu vào CT TP-HCM Trung Lương",
    latitude: 10.689593,
    longitude: 106.593092,
  },
  { name: "Nút giao Bến Lức", latitude: 10.652673, longitude: 106.47595 },
  { name: "Nút giao Tân An", latitude: 10.547605, longitude: 106.368937 },
  { name: "Nút giao Trung Lương", latitude: 10.441508, longitude: 106.311936 },
];

export default function Maps() {
  const [currentLocation, setCurrentLocation] = useState<Point | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Quyền truy cập vị trí bị từ chối");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        name: "Vị trí của bạn",
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setLoading(false);
    })();
  }, []);

  if (loading || !currentLocation) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Đang tải bản đồ...</Text>
      </View>
    );
  }

  const origin = currentLocation;
  const destination = LOCATIONS[LOCATIONS.length - 1];
  const waypoints = LOCATIONS.slice(0, -1); // bỏ điểm cuối

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }}
      >
        <Marker
          coordinate={{
            latitude: origin.latitude,
            longitude: origin.longitude,
          }}
          title={origin.name}
          pinColor="blue"
        />

        {LOCATIONS.map((loc, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            title={loc.name}
            pinColor="red"
          />
        ))}

        <MapViewDirections
          origin={origin}
          destination={destination}
          waypoints={waypoints}
          apikey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}
          strokeWidth={5}
          strokeColor="blue"
          optimizeWaypoints={false}
        />
      </MapView>
    </View>
  );
}
