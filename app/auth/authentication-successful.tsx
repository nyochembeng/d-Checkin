import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Text } from "@/components/utils/Text";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import LottieView from "lottie-react-native";

const success = require("@/assets/lottie/success.json");

export default function RegistrationSuccess() {
  const theme = useTheme();
  const handleGoHome = () => {
    router.replace("/");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text
        variant="headlineMedium"
        style={[styles.title, { color: theme.colors.primary }]}
      >
        Registration Successful!
      </Text>
      <LottieView
        source={success}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
      <Text style={[styles.message, { color: theme.colors.foreground }]}>
        Your biometric data has been successfully registered.
      </Text>
      <Button mode="contained" onPress={handleGoHome} style={styles.button}>
        Next
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  lottie: {
    width: 100,
    height: 100,
    margin: 20,
  },
  message: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    alignSelf: "center",
    width: 100,
  },
});
