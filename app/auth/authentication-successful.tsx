import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { Button } from "react-native-paper";
import { Text } from "@/components/utils/Text";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import LottieView from "lottie-react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const success = require("@/assets/lottie/success.json");
const { width } = Dimensions.get("window");

export default function RegistrationSuccess() {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const method = "face Id";

  useEffect(() => {
    // Sequence of animations for a more dynamic entrance
    Animated.sequence([
      // First show the content with fade and scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleGoHome = () => {
    router.replace("/");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />

      {/* Success content with animation */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Success icon and animation */}
        <View style={styles.successIconContainer}>
          <View
            style={[
              styles.successBackground,
              { backgroundColor: `${theme.colors.primary}15` },
            ]}
          >
            <LottieView
              source={success}
              autoPlay
              loop={false}
              style={styles.lottie}
            />
          </View>
        </View>

        {/* Title and message */}
        <Text
          variant="headlineMedium"
          style={[styles.title, { color: theme.colors.foreground }]}
        >
          Registration Complete!
        </Text>

        <Text style={[styles.message, { color: theme.colors.foreground }]}>
          Your {method} has been successfully registered and is ready to
          use.
        </Text>

        {/* Security message */}
        <View style={styles.securityContainer}>
          <MaterialCommunityIcons
            name="shield-check"
            size={20}
            color={theme.colors.primary}
          />
          <Text
            style={[styles.securityText, { color: theme.colors.foreground }]}
          >
            Your data is encrypted and stored securely on your device
          </Text>
        </View>
      </Animated.View>

      {/* Button with better styling */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Button
          mode="contained"
          onPress={handleGoHome}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          labelStyle={styles.buttonLabel}
        >
          Continue to Home
        </Button>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  successIconContainer: {
    marginBottom: 32,
  },
  successBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "center",
    maxWidth: width * 0.8,
  },
  securityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    width: "100%",
  },
  securityText: {
    marginLeft: 12,
    fontSize: 14,
    flex: 1,
  },
  button: {
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 0,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 2,
  },
});
