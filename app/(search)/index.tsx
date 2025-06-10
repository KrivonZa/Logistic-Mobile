import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert, Keyboard } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SearchScreen(): JSX.Element {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (): void => {
    if (searchTerm.trim() === '') {
      Alert.alert("Lỗi", "Vui lòng nhập địa điểm bạn muốn tìm.");
      return;
    }
    router.push({
      pathname: "/(search)/two-point",
      params: { destinationQuery: searchTerm }
    });
    Keyboard.dismiss();
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#005cb8" />

      <View className="w-full justify-end py-4 px-4 bg-primary">
        <Text className="text-2xl font-bold text-white mb-4">Bạn muốn đi đâu?</Text>

        <View className="flex-row items-center w-full bg-white rounded-lg px-4 py-3 shadow-md">
          <MaterialIcons name="search" size={20} color="#005cb8" />
          <TextInput
            className="flex-1 ml-3 text-label text-base"
            placeholder="Tìm kiếm địa điểm..."
            placeholderTextColor="#6B7280"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')} className="ml-2 p-1">
              <MaterialIcons name="clear" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSearch}
          className="w-full bg-secondary py-3 rounded-lg items-center justify-center mt-4 shadow-md"
        >
          <Text className="text-white text-base font-semibold">Tìm kiếm</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4 bg-gray-50">
        <Text className="text-lg font-bold text-label mb-3">Truy cập nhanh</Text>
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity className="flex-1 items-center bg-white p-4 mx-1 rounded-lg shadow-sm border border-gray-100">
            <MaterialIcons name="home" size={28} color="#005cb8" />
            <Text className="text-label text-sm mt-2 font-medium">Nhà</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center bg-white p-4 mx-1 rounded-lg shadow-sm border border-gray-100">
            <MaterialIcons name="work" size={28} color="#00b3d6" />
            <Text className="text-label text-sm mt-2 font-medium">Cơ quan</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center bg-white p-4 mx-1 rounded-lg shadow-sm border border-gray-100">
            <MaterialIcons name="favorite" size={28} color="#FF712C" />
            <Text className="text-label text-sm mt-2 font-medium">Yêu thích</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-bold text-label mb-3">Tìm kiếm gần đây</Text>
        <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-lg mb-3 shadow-sm border border-gray-100">
          <MaterialIcons name="history" size={24} color="#6B7280" className="mr-3" />
          <View className="flex-1">
            <Text className="text-label text-base font-medium">123 Đường ABC</Text>
            <Text className="text-gray-500 text-sm">Phường XYZ, Quận 1</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={16} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-lg mb-3 shadow-sm border border-gray-100">
          <MaterialIcons name="history" size={24} color="#6B7280" className="mr-3" />
          <View className="flex-1">
            <Text className="text-label text-base font-medium">456 Đường DEF</Text>
            <Text className="text-gray-500 text-sm">Phường UVW, Quận 7</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={16} color="#D1D5DB" />
        </TouchableOpacity>

        <Text className="text-lg font-bold text-label mt-4 mb-3">Địa điểm phổ biến</Text>
        <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-lg mb-3 shadow-sm border border-gray-100">
          <MaterialCommunityIcons name="map-marker" size={24} color="#00b3d6" className="mr-3" />
          <Text className="text-label text-base">Sân bay Tân Sơn Nhất</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-lg mb-3 shadow-sm border border-gray-100">
          <MaterialCommunityIcons name="map-marker" size={24} color="#00b3d6" className="mr-3" />
          <Text className="text-label text-base">Nhà thờ Đức Bà</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}