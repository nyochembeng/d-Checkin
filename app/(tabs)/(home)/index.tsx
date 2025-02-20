import { View } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";

export default function Index() {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/auth/register-biometrics">Home</Link>
    </View>
  );
}
