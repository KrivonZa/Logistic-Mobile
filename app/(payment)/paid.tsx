import { useLocalSearchParams, router } from "expo-router";
import { WebView } from "react-native-webview";
import { View } from "react-native";
import isAuth from "@/components/isAuth";

const Paid = () => {
  const { checkoutUrl, orderID } = useLocalSearchParams<{
    checkoutUrl: string;
    orderID: string;
  }>();

  const handleRedirect = (url: string) => {
    if (
      url.startsWith("https://flipship-management.vercel.app/success") ||
      url.startsWith("https://flipship-management.vercel.app/failed")
    ) {
      setTimeout(() => {
        router.replace("/(tabs)/order");
      }, 5000);
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
};

export default isAuth(Paid, ["Customer"]);
