import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const mockPoints = [
  { id: 1, name: "Bến xe Miền Tây", latitude: 10.737, longitude: 106.628 },
  { id: 2, name: "Bến xe Mỹ Tho", latitude: 10.353, longitude: 106.365 },
  { id: 3, name: "Bến xe Cái Bè", latitude: 10.407, longitude: 105.956 },
  { id: 4, name: "Bến xe Vĩnh Long", latitude: 10.254, longitude: 105.964 },
  { id: 5, name: "Bến xe Cần Thơ", latitude: 10.035, longitude: 105.768 },
];

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

export default function CompanyDetailWithSheet() {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["12%", "50%", "80%"], []);
  const [activeTab, setActiveTab] = useState("route");
  const [tripDirection, setTripDirection] = useState("go");
  const router = useRouter();
  const { title } = useLocalSearchParams();
  const navigation = useNavigation();
  const [isNotCollapsed, setIsNotCollapsed] = useState(true);

  const tripPoints = useMemo(() => {
    return tripDirection === "go" ? mockPoints : [...mockPoints].reverse();
  }, [tripDirection]);

  const polylineCoordinates = useMemo(() => {
    return tripPoints.map((p) => ({
      latitude: p.latitude,
      longitude: p.longitude,
    }));
  }, [tripPoints]);

  const theme = useMemo(() => {
    return tripDirection === "go"
      ? { color: "#005cb8", text: "blue" }
      : { color: "#FF712C", text: "green" };
  }, [tripDirection]);

  const [isReady, setIsReady] = useState(false);

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

  const toggleTripDirection = () => {
    setTripDirection((prevDirection) =>
      prevDirection === "go" ? "return" : "go"
    );
  };

  const renderRoute = () => (
    <View className="px-6 py-4">
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
    </View>
  );

  const renderSchedule = () => (
    <View className="p-4 gap-y-2">
      <Text className="text-lg font-semibold text-gray-800">
        Lịch trình khởi hành:
      </Text>
      {mockSchedules[tripDirection as "go" | "return"].map((sch) => (
        <TouchableOpacity
          key={sch.id}
          className="border rounded-lg p-3"
          style={{
            backgroundColor: `${theme.color}20`,
            borderColor: theme.color,
          }}
          onPress={() => router.push("/(package)")}
        >
          <Text
            className="text-base font-medium"
            style={{ color: theme.color }}
          >
            {sch.time}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 10.4,
          longitude: 106,
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
        <Polyline
          coordinates={polylineCoordinates}
          strokeColor={theme.color}
          strokeWidth={4}
          lineCap="round"
          lineJoin="round"
        />
      </MapView>

      {isReady && (
        <BottomSheet
          ref={sheetRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          handleIndicatorStyle={{ backgroundColor: "#d1d5db" }}
          onChange={(index) => {
            setIsNotCollapsed(index === 0);
          }}
        >
          <BottomSheetView className="flex-1 bg-white">
            <View
              className="flex-row justify-between items-center gap-x-2 py-3 px-2 border-b-2"
              style={{
                borderColor: theme.color,
              }}
            >
              <View className="flex-1">
                <Text
                  className="text-base font-semibold"
                  style={{
                    color: theme.color,
                  }}
                >
                  Bến xe Miền Tây - Bến xe Cần thơ
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
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "500",
                    }}
                  >
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
              <TouchableOpacity
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
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
              {activeTab === "route" ? renderRoute() : renderSchedule()}
            </ScrollView>
          </BottomSheetView>
        </BottomSheet>
      )}
    </View>
  );
}
