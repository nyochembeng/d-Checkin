import { Link, Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! This screen doesn't exist." }} />
      <View style={styles.container}>
        <Text>Not Found</Text>
        <Link href="/">Go to home</Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
