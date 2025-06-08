import React, { useEffect, useRef, useState } from "react";
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
  {
    name: "Đầu vào CT TP-HCM Trung Lương",
    latitude: 10.689593,
    longitude: 106.593092,
  },
  { name: "Nút giao Bến Lức", latitude: 10.652673, longitude: 106.47595 },
  { name: "Nút giao Tân An", latitude: 10.547605, longitude: 106.368937 },
  { name: "Nút giao Trung Lương", latitude: 10.441508, longitude: 106.311936 },
];

// Tính khoảng cách Haversine
const getDistance = (p1: Point, p2: Point): number => {
  const R = 6371e3;
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
  const [statusPoints, setStatusPoints] = useState<StatusPoint[]>([]);
  const [fullRoute, setFullRoute] = useState<LatLng[]>([]);
  const [renderedCoords, setRenderedCoords] = useState<LatLng[]>([]);
  const [loading, setLoading] = useState(true);

  const indexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Quyền truy cập vị trí bị từ chối");
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

          const allPoints = [userPoint, ...LOCATIONS];

          // Chuẩn bị dữ liệu cho API Google Directions
          const origin = `${userPoint.latitude},${userPoint.longitude}`;
          const destination = `${LOCATIONS[LOCATIONS.length - 1].latitude},${
            LOCATIONS[LOCATIONS.length - 1].longitude
          }`;
          const waypoints = LOCATIONS.slice(0, LOCATIONS.length - 1)
            .map((p) => `${p.latitude},${p.longitude}`)
            .join("|");

          try {
            const res = await axios.get(
              `https://maps.googleapis.com/maps/api/directions/json`,
              {
                params: {
                  origin,
                  destination,
                  waypoints,
                  key: "GOOGLE_MAP_API_KEY",
                },
              }
            );

            const routes = res.data.routes;
            if (
              !routes ||
              routes.length === 0 ||
              !routes[0].overview_polyline
            ) {
              Alert.alert("Không tìm thấy tuyến đường phù hợp.");
              console.warn("API response:", res.data);
              return;
            }

            const polylinePoints = decodePolyline(
              routes[0].overview_polyline.points
            );
            setFullRoute(polylinePoints);
            setRenderedCoords([]);
            indexRef.current = 0;
          } catch (error) {
            Alert.alert("Lỗi khi tải route từ Google Maps");
            console.error(error);
          }

          // Tính điểm gần nhất
          let closestIdx = 0;
          let minDist = Infinity;
          for (let i = 0; i < LOCATIONS.length; i++) {
            const dist = getDistance(userPoint, LOCATIONS[i]);
            if (dist < minDist) {
              minDist = dist;
              closestIdx = i;
            }
          }

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
      if (locationSubscription) locationSubscription.remove();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Animate tuyến đường trong ~3s
  useEffect(() => {
    if (fullRoute.length === 0) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    const delay = Math.max(10, 3000 / fullRoute.length);
    intervalRef.current = setInterval(() => {
      if (indexRef.current >= fullRoute.length) {
        clearInterval(intervalRef.current!);
        return;
      }
      setRenderedCoords((prev) => [...prev, fullRoute[indexRef.current]]);
      indexRef.current += 1;
    }, delay);
  }, [fullRoute]);

  if (loading || !currentLocation) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Đang tải bản đồ...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          title={currentLocation.name}
          pinColor="blue"
        />

        {statusPoints.map((loc, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            title={`${loc.name} (${loc.status})`}
            pinColor={
              loc.status === "past"
                ? "gray"
                : loc.status === "next"
                ? "orange"
                : "red"
            }
          />
        ))}

        <Polyline
          coordinates={renderedCoords}
          strokeWidth={5}
          strokeColor="#005cb8"
        />
      </MapView>
    </View>
  );
}

// Giải mã Google Polyline (chuỗi thành tọa độ)
function decodePolyline(encoded: string): LatLng[] {
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;
  const points: LatLng[] = [];

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return points;
}
