import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import debounce from "lodash/debounce";

export default function SearchScreen(): JSX.Element {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any | null>(
    null
  );
  const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  const loadRecentSearches = async () => {
    try {
      const existing = await AsyncStorage.getItem("recent_searches");
      if (existing) {
        setRecentSearches(JSON.parse(existing));
      }
    } catch (error) {
      console.error("Lỗi khi load lịch sử:", error);
    }
  };

  const updateRecentSearches = async (newSearch: string) => {
    try {
      const existing = await AsyncStorage.getItem("recent_searches");
      let updated: string[] = existing ? JSON.parse(existing) : [];
      updated = [newSearch, ...updated.filter((item) => item !== newSearch)];
      if (updated.length > 5) updated = updated.slice(0, 5);
      await AsyncStorage.setItem("recent_searches", JSON.stringify(updated));
      setRecentSearches(updated);
    } catch (error) {
      console.error("Lỗi khi cập nhật lịch sử:", error);
    }
  };

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const fetchSuggestions = async (input: string) => {
    try {
      const response = await axios.get(
        "https://rsapi.goong.io/Place/AutoComplete",
        {
          params: {
            input,
            api_key: process.env.EXPO_PUBLIC_GOONG_MAPS_API_KEY,
          },
        }
      );
      setSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error("Lỗi khi lấy gợi ý:", error);
    }
  };

  const debouncedFetch = useRef(debounce(fetchSuggestions, 200)).current;

  useEffect(() => {
    if (searchTerm.trim().length > 0 && !hasSelectedSuggestion) {
      debouncedFetch(searchTerm);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearch = (): void => {
    if (searchTerm.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập địa điểm bạn muốn tìm.");
      return;
    }

    const selected =
      selectedSuggestion ||
      suggestions.find((s) => s.description === searchTerm);
    if (!selected || !selected.place_id) {
      Alert.alert("Lỗi", "Vui lòng chọn địa điểm hợp lệ từ gợi ý.");
      return;
    }

    axios
      .get("https://rsapi.goong.io/Place/Detail", {
        params: {
          place_id: selected.place_id,
          api_key: process.env.EXPO_PUBLIC_GOONG_MAPS_API_KEY,
        },
      })
      .then((res) => {
        const loc = res.data.result.geometry.location;
        updateRecentSearches(selected.description);
        setSelectedSuggestion(null); // reset lại sau khi search xong

        router.push({
          pathname: "/(search)/two-point",
          params: {
            lat: loc.lat.toString(),
            lng: loc.lng.toString(),
            description: selected.description,
          },
        });
      })
      .catch(() => {
        Alert.alert("Lỗi", "Không thể lấy tọa độ vị trí.");
      });

    Keyboard.dismiss();
    setSuggestions([]);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#005cb8" />

      <View className="w-full justify-end py-4 px-4 bg-primary">
        <Text className="text-2xl font-bold text-white mb-4">
          Bạn muốn đi đâu?
        </Text>

        <View className="flex-row items-center w-full bg-white rounded-lg px-4 py-3 shadow-md">
          <MaterialIcons name="search" size={20} color="#005cb8" />
          <TextInput
            ref={inputRef}
            className="flex-1 ml-3 text-label text-base"
            placeholder="Tìm kiếm địa điểm..."
            placeholderTextColor="#6B7280"
            value={searchTerm}
            onChangeText={(text) => {
              setSearchTerm(text);
              setHasSelectedSuggestion(false);
            }}
            returnKeyType="search"
            numberOfLines={1}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchTerm("")}
              className="ml-2 p-1"
            >
              <MaterialIcons name="clear" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {suggestions.length > 0 ? (
          <View className="mt-2 bg-white rounded-lg shadow-md border border-gray-100 max-h-60">
            <ScrollView keyboardShouldPersistTaps="handled">
              {suggestions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="px-4 py-3 border-b border-gray-100"
                  onPress={() => {
                    setSearchTerm(item.description);
                    setSelectedSuggestion(item);
                    setSuggestions([]);
                    setHasSelectedSuggestion(true);
                    Keyboard.dismiss();
                    inputRef.current?.blur();
                  }}
                >
                  <Text className="text-label text-base">
                    {item.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          searchTerm.length > 0 &&
          !hasSelectedSuggestion && (
            <Text className="text-sm text-white mt-2">
              Không có gợi ý phù hợp.
            </Text>
          )
        )}

        <TouchableOpacity
          onPress={handleSearch}
          className="w-full bg-secondary py-3 rounded-lg items-center justify-center mt-4 shadow-md"
        >
          <Text className="text-white text-base font-semibold">Tìm kiếm</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4 bg-gray-50">
        <Text className="text-lg font-bold text-label mb-3">
          Truy cập nhanh
        </Text>
        <View className="flex-row justify-between mb-6">
          {[
            { icon: "home", label: "Nhà", color: "#005cb8" },
            { icon: "work", label: "Cơ quan", color: "#00b3d6" },
            { icon: "favorite", label: "Yêu thích", color: "#FF712C" },
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              className="flex-1 items-center bg-white p-4 mx-1 rounded-lg shadow-sm border border-gray-100"
              onPress={() =>
                Alert.alert("Thông báo", "Chức năng đang phát triển")
              }
            >
              <MaterialIcons
                name={item.icon as any}
                size={28}
                color={item.color}
              />
              <Text className="text-label text-sm mt-2 font-medium">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-lg font-bold text-label mb-3">
          Tìm kiếm gần đây
        </Text>
        <View className="pb-6">
          {recentSearches.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              className="flex-row items-center p-4 bg-white rounded-lg mb-3 shadow-sm border border-gray-100"
              // onPress={() => {
              //   setSearchTerm(item);
              //   setHasSelectedSuggestion(true);
              //   inputRef.current?.focus();
              // }}
              onPress={() => {
                Alert.alert("Thông báo", "Chức năng đang phát triển");
              }}
            >
              <MaterialIcons
                name="history"
                size={24}
                color="#6B7280"
                className="mr-3"
              />
              <View className="flex-1">
                <Text className="text-label text-base font-medium">{item}</Text>
              </View>
              <MaterialIcons
                name="arrow-forward-ios"
                size={16}
                color="#D1D5DB"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
