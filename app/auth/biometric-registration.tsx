import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text as RNText } from "@/components/ui/Text";

const fingerprintInProgress = require("@/assets/lottie/fingerprint_in_progress.json");
const fingerprintComplete = require("@/assets/lottie/fingerprint_complete.json");
const faceInProgress = require("@/assets/lottie/face_in_progress.json");
const faceComplete = require("@/assets/lottie/face_complete.json");

export default function BiometricRegistration() {
  const theme = useTheme();
  const { method } = useLocalSearchParams<{ method: "fingerprint" | "face" }>(); // Pass selected method via params
  const [isComplete, setIsComplete] = useState(false);
  const [hint, setHint] = useState("");

  // Simulate registration process
  useEffect(() => {
    // For demonstration: change hint every 4 seconds until registration complete.
    const hints =
      method === "fingerprint"
        ? [
            "Place your finger on the sensor.",
            "Ensure your finger covers the entire sensor area.",
            "Press firmly and hold for a moment.",
          ]
        : [
            "Make sure your face is well-lit.",
            "Position your face in the center of the frame.",
            "Remove any obstructions (glasses, hat, etc.) if possible.",
          ];

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * hints.length);
      setHint(hints[randomIndex]);
    }, 4000);

    // Simulate completion after 10 seconds.
    const timeout = setTimeout(() => {
      setIsComplete(true);
      clearInterval(interval);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [method]);

  // Automatically navigate when registration is complete (simulate delay for final animation)
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        router.replace("/auth/registration-successful");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  // Choose animations based on selected method and completion state.
  const inProgressAnimation =
    method === "fingerprint" ? fingerprintInProgress : faceInProgress;
  const completeAnimation =
    method === "fingerprint" ? fingerprintComplete : faceComplete;
  const animationSource = isComplete ? completeAnimation : inProgressAnimation;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header with back arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Hint */}
      {!isComplete && (
        <RNText style={[styles.hintText, { color: theme.colors.foreground }]}>
          {method === "fingerprint"
            ? "Place your fingers in the fingerprint sensor."
            : "Hold your device in a selfie position."}
        </RNText>
      )}

      {/* Lottie Animation */}
      <LottieView
        source={animationSource}
        autoPlay
        loop={!isComplete}
        style={styles.lottie}
      />

      {/* Hint Message */}
      {!isComplete && (
        <RNText style={[styles.hintText, { color: theme.colors.foreground }]}>
          {hint}
        </RNText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    width: "100%",
    marginBottom: 200,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  hintText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
});
