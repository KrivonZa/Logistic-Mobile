import { useLocalSearchParams, router } from "expo-router";
import { WebView } from "react-native-webview";
import { View } from "react-native";

export default function Paid() {
  const { checkoutUrl, orderID } = useLocalSearchParams<{
    checkoutUrl: string;
    orderID: string;
  }>();

  const handleRedirect = (url: string) => {
    if (
      url.startsWith("https://www.google.com/") ||
      url.startsWith("https://vi.wikipedia.org/")
    ) {
      router.replace("/(tabs)/order");
    }
  };

  return (
    <View className="flex-1">
      <WebView
        source={{ uri: checkoutUrl }}
        javaScriptEnabled
        onNavigationStateChange={(navState) => {
          handleRedirect(navState.url);
        }}
      />
    </View>
  );
}
