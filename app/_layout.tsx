import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import ReduxProvider from "@/app/provider";
import { AuthProvider } from "@/libs/context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createSocket } from "@/libs/thirdParty/socket/socket";

import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat.ttf"),
    MontserratItalic: require("../assets/fonts/Montserrat-Italic.ttf"),
    Roboto: require("../assets/fonts/Roboto.ttf"),
    RobotoItalic: require("../assets/fonts/Roboto-Italic.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      (async () => {
        try {
          const socketInstance = await createSocket();

          socketInstance.on("connect", () => {
            console.log("🔌 Socket connected:", socketInstance.id);
          });
        } catch (err) {
          console.error("❌ Failed to connect socket:", err);
        }
      })();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ReduxProvider>
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(chat)" options={{ headerShown: false }} />
              <Stack.Screen name="(search)" options={{ headerShown: false }} />
              <Stack.Screen name="(company)" options={{ headerShown: false }} />
              <Stack.Screen name="(package)" options={{ headerShown: false }} />
              <Stack.Screen name="(payment)" options={{ headerShown: false }} />
              <Stack.Screen name="(order)" options={{ headerShown: false }} />
              <Stack.Screen name="(rating)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(delivery)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(notification)"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="(profile)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="dark" />
          </AuthProvider>
        </ReduxProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
