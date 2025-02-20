import { View } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Header } from "@/components/utils/Header";

export default function Index() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Header title="Home" showNotification showBack />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link href="/home">Go to Home.</Link>
      </View>
    </View>
  );
}
