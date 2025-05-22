import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, Polyline, LatLng } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

interface Point {
  name: string;
  latitude: number;
  longitude: number;
}

interface StatusPoint extends Point {
  status: "past" | "next" | "upcoming";
}

const LOCATIONS: Point[] = [
  { name: "Ngã tư Thủ Đức", latitude: 10.849596, longitude: 106.774166 },
  { name: "Ngã tư Hàng Xanh", latitude: 10.80161, longitude: 106.712158 },
  { name: "Đài truyền hình HTV", latitude: 10.788228, longitude: 106.699348 },
  { name: "Chợ hoa Hồ Thị Kỷ", latitude: 10.766504, longitude: 106.678472 },
  { name: "Ngã Bảy Lý Thái Tổ", latitude: 10.767647, longitude: 106.6744 },
  { name: "BV Phạm Ngọc Thạch", latitude: 10.756092, longitude: 106.665291 },
  { name: "Thuận Kiều Plaza", latitude: 10.754529, longitude: 106.657655 },
  { name: "Đầu vào CT TP-HCM Trung Lương", latitude: 10.689593, longitude: 106.593092 },
  { name: "Nút giao Bến Lức", latitude: 10.652673, longitude: 106.47595 },
  { name: "Nút giao Tân An", latitude: 10.547605, longitude: 106.368937 },
  { name: "Nút giao Trung Lương", latitude: 10.441508, longitude: 106.311936 },
];

const getDistance = (p1: Point, p2: Point): number => {
  const R = 6371e3; // đơn vị mét
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(p2.latitude - p1.latitude);
  const dLon = toRad(p2.longitude - p1.longitude);
  const lat1 = toRad(p1.latitude);
  const lat2 = toRad(p2.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function Maps() {
  const [currentLocation, setCurrentLocation] = useState<Point | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [statusPoints, setStatusPoints] = useState<StatusPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Quyền truy cập bị từ chối");
        setLoading(false);
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 3000,
          distanceInterval: 10,
        },
        async (location) => {
          const userPoint: Point = {
            name: "Vị trí của bạn",
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setCurrentLocation(userPoint);

          // Gọi API lấy tuyến đường
          const allPoints = [userPoint, ...LOCATIONS];
          const coordsStr = allPoints
            .map((p) => `${p.longitude},${p.latitude}`)
            .join(";");

          try {
            const res = await axios.get(
              `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`
            );
            const coords: LatLng[] = res.data.routes[0].geometry.coordinates.map(
              ([lon, lat]: [number, number]) => ({
                latitude: lat,
                longitude: lon,
              })
            );
            setRouteCoords(coords);
          } catch {
            Alert.alert("Không thể tải tuyến đường");
          }

          // Tìm điểm gần nhất
          let closestIdx = 0;
          let minDist = Infinity;
          for (let i = 0; i < LOCATIONS.length; i++) {
            const dist = getDistance(userPoint, LOCATIONS[i]);
            if (dist < minDist) {
              minDist = dist;
              closestIdx = i;
            }
          }

          // Gán trạng thái cho các điểm
          const updatedStatusPoints: StatusPoint[] = LOCATIONS.map((p, i) => ({
            ...p,
            status:
              i < closestIdx ? "past" : i === closestIdx ? "next" : "upcoming",
          }));
          setStatusPoints(updatedStatusPoints);
          setLoading(false);
        }
      );
    };

    startTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  if (loading || !currentLocation) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text>Đang tải bản đồ...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {/* Mark vị trí hiện tại */}
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          title={currentLocation.name}
          pinColor="blue"
        />

        {/* Mark các điểm với trạng thái */}
        {statusPoints.map((loc, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: loc.latitude,
              longitude: loc.longitude,
            }}
            title={`${loc.name} (${loc.status === "past"
              ? "Đã qua"
              : loc.status === "next"
              ? "Sắp tới"
              : "Chưa tới"
              })`}
            pinColor={
              loc.status === "past"
                ? "gray"
                : loc.status === "next"
                ? "orange"
                : "red"
            }
          />
        ))}

        {/* Tuyến đường */}
        <Polyline
          coordinates={routeCoords}
          strokeWidth={5}
          strokeColor="#005cb8"
        />
      </MapView>
    </View>
  );
}
