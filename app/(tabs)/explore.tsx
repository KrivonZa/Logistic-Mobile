import { useEffect, useState } from "react";
import { Text, View, Dimensions, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";

const { height } = Dimensions.get("window");

export default function ExploreScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);

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
    <View className="flex-1 px-10 justify-center items-center">
      <Text className="text-4xl text-center mb-4">
        Whereas disregard and contempt for human rights have resulted
      </Text>

      <TouchableWithoutFeedback onPress={() => router.push("/(maps)")}>
        <MapView
          style={{
            width: "100%",
            height: height / 3,
            borderRadius: 12,
            overflow: "hidden",
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
      </TouchableWithoutFeedback>
    </View>
  );
}
