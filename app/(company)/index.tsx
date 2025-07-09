import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@/libs/hooks/useRoute";
import axios from "axios";
import polyline from "@mapbox/polyline";
import { ScrollView as GestureScrollView } from "react-native-gesture-handler";
import { RouteWithWaypoints } from "@/libs/types/route";
import { useAppDispatch } from "@/libs/stores";
import { getRouteByID } from "@/libs/stores/routeManager/thunk";
import { useAuth } from "@/libs/context/AuthContext";
import isAuth from "@/components/isAuth";

// Interfaces for Goong Maps API response
interface GoongRoute {
  overview_polyline: {
    points: string;
  };
}

interface GoongDirectionsResponse {
  routes: GoongRoute[];
}

const CompanyDetailWithSheet = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["12%", "50%", "80%"], []);
  const [activeTab, setActiveTab] = useState<"route" | "schedule">("route");
  const [tripDirection, setTripDirection] = useState<"go" | "return">("go");
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const router = useRouter();
  const { title, routeID } = useLocalSearchParams();
  const navigation = useNavigation();
  const [isNotCollapsed, setIsNotCollapsed] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const { routeDetail } = useRoute();
  const dispatch = useAppDispatch();

  const { setCompany, packageID } = useAuth();

  const currentRoute = routeDetail as RouteWithWaypoints | undefined;

  useEffect(() => {
    dispatch(getRouteByID(routeID as string));
  }, [routeID]);

  // Parse geoLocation (handles both "lat,lng" and GeoJSON formats)
  const parseGeoLocation = (
    geoLocation: string
  ): { latitude: number; longitude: number } | null => {
    try {
      // Try parsing as GeoJSON
      const parsed = JSON.parse(geoLocation);
      if (
        parsed.type === "Point" &&
        Array.isArray(parsed.coordinates) &&
        parsed.coordinates.length === 2
      ) {
        const [longitude, latitude] = parsed.coordinates;
        if (!isNaN(latitude) && !isNaN(longitude)) {
          return { latitude, longitude };
        }
      }
    } catch (e) {
      // Not GeoJSON, try "lat,lng" format
      const [latitude, longitude] = geoLocation
        .split(",")
        .map((coord) => parseFloat(coord.trim()));
      if (!isNaN(latitude) && !isNaN(longitude)) {
        return { latitude, longitude };
      }
    }
    return null;
  };

  const tripPoints = useMemo(() => {
    if (!currentRoute?.Waypoint) return [];
    const points = currentRoute.Waypoint.map((waypoint) => {
      const coords = parseGeoLocation(waypoint.geoLocation);
      if (!coords) {
        return null;
      }
      return {
        id: waypoint.waypointID,
        name: waypoint.location,
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
    }).filter(
      (point): point is NonNullable<(typeof points)[0]> => point !== null
    );
    return tripDirection === "go" ? points : [...points].reverse();
  }, [currentRoute, tripDirection]);

  const polylineCoordinates = useMemo(() => {
    return tripPoints.map((p) => ({
      latitude: p.latitude,
      longitude: p.longitude,
    }));
  }, [tripPoints]);

  const fetchRoute = async (waypoints: typeof tripPoints) => {
    if (waypoints.length < 2) {
      // Alert.alert("Error", "Insufficient waypoints to fetch route.");
      return;
    }

    try {
      let allCoords: { latitude: number; longitude: number }[] = [];

      for (let i = 0; i < waypoints.length - 1; i++) {
        const origin = `${waypoints[i].latitude},${waypoints[i].longitude}`;
        const destination = `${waypoints[i + 1].latitude},${
          waypoints[i + 1].longitude
        }`;

        const response = await axios.get<GoongDirectionsResponse>(
          "https://rsapi.goong.io/Direction",
          {
            params: {
              origin,
              destination,
              vehicle: "car",
              api_key: process.env.EXPO_PUBLIC_GOONG_MAPS_API_KEY,
            },
          }
        );

        const points: string =
          response.data.routes?.[0]?.overview_polyline?.points;
        if (!points) {
          throw new Error(
            `No route data for segment ${waypoints[i].name} to ${
              waypoints[i + 1].name
            }`
          );
        }

        const decoded = polyline.decode(points).map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));

        // Append decoded coordinates, avoiding duplicates at segment boundaries
        if (i > 0) {
          allCoords.pop(); // Remove last point of previous segment to avoid duplication
        }
        allCoords = [...allCoords, ...decoded];
      }

      setRouteCoords(allCoords);
    } catch (error: any) {
      // Alert.alert(
      //   "Error",
      //   error.response?.data?.message ||
      //     "Failed to fetch route. Please check your API key or network connection."
      // );
    }
  };

  const theme = useMemo(
    () => ({
      color: tripDirection === "go" ? "#005cb8" : "#FF712C",
      text: tripDirection === "go" ? "blue" : "green",
    }),
    [tripDirection]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (title) {
      navigation.setOptions({
        title: title.toString(),
        headerTitleAlign: "center",
      });
    }
  }, [title, navigation]);

  useEffect(() => {
    if (tripPoints.length > 0) {
      fetchRoute(tripPoints);
    }
  }, [tripPoints]);

  const toggleTripDirection = () => {
    setTripDirection((prev) => (prev === "go" ? "return" : "go"));
  };

  const handleSelectRoute = () => {
    // Gọi setCompany nếu có đủ dữ liệu
    if (routeDetail?.companyID && title && routeDetail?.routeID) {
      setCompany(routeDetail.companyID, title.toString(), routeDetail.routeID);
    } else {
      Alert.alert("Thiếu thông tin", "Không thể set công ty do thiếu dữ liệu.");
      return;
    }
    if (packageID) {
      router.push("/(payment)");
    } else {
      router.push("/(package)");
    }
  };

  const renderRoute = () => (
    <View className="px-6 pr-10 py-4">
      {tripPoints.map((point, index) => (
        <View key={point.id} className="flex-row items-start">
          <View className="items-center mr-4">
            <View
              className="w-6 h-6 rounded-full justify-center items-center z-10"
              style={{ backgroundColor: theme.color }}
            >
              <Text className="text-white text-xs font-bold">{index + 1}</Text>
            </View>
            {index !== tripPoints.length - 1 && (
              <View
                className="w-px flex-1 mt-1"
                style={{ backgroundColor: theme.color, minHeight: 30 }}
              />
            )}
          </View>
          <View className="pt-[2px]">
            <Text className="text-base text-gray-800">{point.name}</Text>
          </View>
        </View>
      ))}
      <TouchableOpacity
        onPress={handleSelectRoute}
        className="mt-6 px-4 py-2 rounded-full border"
        style={{
          backgroundColor: theme.color,
          borderColor: theme.color,
        }}
      >
        <Text className="text-white text-center">Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );

  // const renderSchedule = () => (
  //   <View className="p-4 gap-y-2">
  //     <Text className="text-lg font-semibold text-gray-800">
  //       Lịch trình khởi hành:
  //     </Text>
  //     {mockSchedules[tripDirection].map((sch) => (
  //       <TouchableOpacity
  //         key={sch.id}
  //         className="border rounded-lg p-3"
  //         style={{
  //           backgroundColor: `${theme.color}20`,
  //           borderColor: theme.color,
  //         }}
  //         onPress={() => router.push("/(package)")}
  //       >
  //         <Text
  //           className="text-base font-medium"
  //           style={{ color: theme.color }}
  //         >
  //           {sch.time}
  //         </Text>
  //       </TouchableOpacity>
  //     ))}
  //   </View>
  // );

  return (
    <View className="flex-1 bg-gray-100">
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: tripPoints[0]?.latitude || 10.4,
          longitude: tripPoints[0]?.longitude || 106,
          latitudeDelta: 1.5,
          longitudeDelta: 1.5,
        }}
      >
        {tripPoints.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.name}
            pinColor={theme.color}
          />
        ))}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor={theme.color}
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>

      {isReady && (
        <BottomSheet
          ref={sheetRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          enableContentPanningGesture={true}
          handleIndicatorStyle={{ backgroundColor: "#d1d5db" }}
          onChange={(index) => {
            setIsNotCollapsed(index === 0);
          }}
        >
          <BottomSheetView style={{ flex: 1 }}>
            {/* Header and Tabs */}
            <View
              className="flex-row justify-between items-center gap-x-2 py-3 px-2 border-b-2"
              style={{ borderColor: theme.color }}
            >
              <View className="flex-1">
                <Text
                  className="text-base font-semibold"
                  style={{ color: theme.color }}
                >
                  {currentRoute?.routeName || "Route"}
                </Text>
              </View>
              <View className="flex-row items-center gap-x-2">
                <TouchableOpacity
                  onPress={toggleTripDirection}
                  className="px-4 py-2 rounded-full border"
                  style={{
                    backgroundColor: theme.color,
                    borderColor: theme.color,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "500" }}>
                    {tripDirection === "go" ? "Lượt đi" : "Lượt về"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const nextIndex = isNotCollapsed ? 1 : 0;
                    sheetRef.current?.snapToIndex(nextIndex);
                    setIsNotCollapsed(!isNotCollapsed);
                  }}
                  className="bg-[#f0f0f0] rounded-full flex items-center justify-center px-3 py-1"
                >
                  <MaterialIcons
                    size={24}
                    name={
                      isNotCollapsed
                        ? "keyboard-double-arrow-up"
                        : "keyboard-double-arrow-down"
                    }
                    color={"#444"}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row justify-around py-3 px-4">
              <TouchableOpacity
                onPress={() => setActiveTab("route")}
                className="flex-1 items-center py-2 relative"
              >
                <Text
                  className={`text-base font-semibold ${
                    activeTab === "route" ? "" : "text-gray-600"
                  }`}
                  style={{
                    color: activeTab === "route" ? theme.color : "#4A5568",
                  }}
                >
                  Lộ trình
                </Text>
                {activeTab === "route" && (
                  <View
                    className="absolute bottom-0 h-1 w-full rounded-t-sm"
                    style={{ backgroundColor: theme.color }}
                  />
                )}
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={() => setActiveTab("schedule")}
                className="flex-1 items-center py-2 relative"
              >
                <Text
                  className={`text-base font-semibold ${
                    activeTab === "schedule" ? "" : "text-gray-600"
                  }`}
                  style={{
                    color: activeTab === "schedule" ? theme.color : "#4A5568",
                  }}
                >
                  Lịch trình
                </Text>
                {activeTab === "schedule" && (
                  <View
                    className="absolute bottom-0 h-1 w-full rounded-t-sm"
                    style={{ backgroundColor: theme.color }}
                  />
                )}
              </TouchableOpacity> */}
            </View>
            <GestureScrollView
              contentContainerStyle={{ paddingBottom: 20, minHeight: "100%" }}
              nestedScrollEnabled={true}
            >
              {/* {activeTab === "route" ? renderRoute() : renderSchedule()} */}
              {activeTab === "route" ? renderRoute() : renderRoute()}
            </GestureScrollView>
          </BottomSheetView>
        </BottomSheet>
      )}
    </View>
  );
};

export default isAuth(CompanyDetailWithSheet, ["Customer"]);

const mockSchedules = {
  go: [
    { id: 1, time: "06:00 → 10:00" },
    { id: 2, time: "08:30 → 12:30" },
    { id: 3, time: "11:00 → 15:00" },
    { id: 4, time: "13:30 → 17:30" },
    { id: 5, time: "15:00 → 19:00" },
    { id: 6, time: "17:30 → 21:30" },
  ],
  return: [
    { id: 1, time: "07:00 → 11:00" },
    { id: 2, time: "09:30 → 13:30" },
    { id: 3, time: "12:00 → 16:00" },
    { id: 4, time: "14:30 → 18:30" },
    { id: 5, time: "16:00 → 20:00" },
    { id: 6, time: "18:30 → 22:30" },
  ],
};
