import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import LottieView from "lottie-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "@/components/utils/Text";

const fingerprintInProgress = require("@/assets/lottie/fingerprint_in_progress.json");
const fingerprintComplete = require("@/assets/lottie/fingerprint_complete.json");
const faceInProgress = require("@/assets/lottie/face_in_progress.json");
const faceComplete = require("@/assets/lottie/face_complete.json");

const { width } = Dimensions.get("window");

export default function BiometricAuthentication() {
  const theme = useTheme();
  const { method } = useLocalSearchParams<{ method: "fingerprint" | "face" }>();
  const [isComplete, setIsComplete] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressValue = useRef(new Animated.Value(0)).current;

  // Define method-specific content
  const methodContent = {
    fingerprint: {
      title: "Fingerprint Registration",
      subtitle: "Secure access with your unique fingerprint",
      hints: [
        "Place your finger on the sensor",
        "Press firmly but gently",
        "Hold until the scan completes",
        "Lift and place your finger again",
      ],
    },
    face: {
      title: "Face Recognition Setup",
      subtitle: "Quick and contactless authentication",
      hints: [
        "Position your face in the center",
        "Ensure good lighting",
        "Keep a neutral expression",
        "Avoid covering your face",
      ],
    },
  };

  // Get content based on the current method
  const content = method ? methodContent[method] : methodContent.fingerprint;

  // Progress animation
  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: false,
    }).start();
  }, []);

  // Hint rotation with fade effect
  useEffect(() => {
    const rotateHints = () => {
      if (isComplete) return;

      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Update hint
        setCurrentHintIndex(
          (prevIndex) => (prevIndex + 1) % content.hints.length
        );

        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    };

    const interval = setInterval(rotateHints, 3000);
    return () => clearInterval(interval);
  }, [fadeAnim, content.hints, isComplete]);

  // Simulate completion after 10 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsComplete(true);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [method]);

  // Navigate when registration is complete
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        router.replace("/auth/authentication-successful");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  // Choose animations based on selected method and completion state
  const inProgressAnimation =
    method === "fingerprint" ? fingerprintInProgress : faceInProgress;
  const completeAnimation =
    method === "fingerprint" ? fingerprintComplete : faceComplete;
  const animationSource = isComplete ? completeAnimation : inProgressAnimation;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />

      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isComplete}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.foreground}
          />
        </TouchableOpacity>
      </View>

      {/* Title and subtitle */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.colors.foreground }]}>
          {isComplete ? "Setup Complete!" : content.title}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.foreground }]}>
          {isComplete
            ? "Your biometric authentication is ready to use"
            : content.subtitle}
        </Text>
      </View>

      {/* Progress indicator */}
      {!isComplete && (
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                backgroundColor: theme.colors.primary,
                width: progressValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      )}

      {/* Lottie Animation */}
      <View style={styles.animationContainer}>
        <LottieView
          source={animationSource}
          autoPlay
          loop={!isComplete}
          style={styles.lottie}
        />
      </View>

      {/* Hint Messages */}
      {!isComplete && (
        <Animated.View style={[styles.hintContainer, { opacity: fadeAnim }]}>
          <View
            style={[
              styles.hintBox,
              { backgroundColor: `${theme.colors.primary}15` },
            ]}
          >
            <Ionicons
              name="information-circle"
              size={22}
              color={theme.colors.primary}
              style={styles.hintIcon}
            />
            <Text style={[styles.hintText, { color: theme.colors.foreground }]}>
              {content.hints[currentHintIndex]}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Success message */}
      {isComplete && (
        <View style={styles.successContainer}>
          <Text style={[styles.successText, { color: theme.colors.primary }]}>
            Registration successful
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 16,
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  progressContainer: {
    height: 4,
    width: width - 48,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    marginBottom: 40,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  animationContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  lottie: {
    width: 240,
    height: 240,
  },
  hintContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 32,
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "100%",
  },
  hintIcon: {
    marginRight: 10,
  },
  hintText: {
    fontSize: 16,
    flex: 1,
  },
  successContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  successText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
