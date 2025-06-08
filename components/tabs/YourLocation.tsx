import { useEffect, useRef, useState } from "react";
import {
  View,
  Dimensions,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { height } = Dimensions.get("window");

export default function YourLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setLoading(false);
    })();
  }, []);

  const goToCurrentLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc);
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          2000
        );
      }
    } catch (err) {
      alert("Không thể lấy được vị trí hiện tại");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!location) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Không thể lấy được vị trí.</Text>
      </View>
    );
  }

  const { latitude, longitude } = location.coords;

  return (
    <View className="flex-1 py-6 px-4 relative">
      <Text className="text-lg font-bold text-gray-800 mb-6">
        Vị trí hiện tại
      </Text>
      <View className="rounded-2xl overflow-hidden relative">
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{
            width: "100%",
            height: height / 4,
          }}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={{ latitude, longitude }} title="Vị trí của bạn" />
        </MapView>
        <View className="absolute top-3 right-3 flex-row gap-x-2">
          <TouchableOpacity
            onPress={goToCurrentLocation}
            className="bg-white p-2 rounded-full shadow items-center"
          >
            <Ionicons name="locate" size={26} color="#005cb8" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(maps)")}
            className="bg-white p-2 rounded-full shadow items-center"
          >
            <Ionicons name="expand" size={26} color="#005cb8" />
          </TouchableOpacity>
        </View>
        <View className="absolute -bottom-3 right-2">
          <Image
            source={require("@/assets/images/transparent-icon-blue.png")}
            style={{ width: 60, height: 60, resizeMode: "contain" }}
          />
        </View>
      </View>
    </View>
  );
}
