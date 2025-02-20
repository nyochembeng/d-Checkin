import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { Text } from "@/components/utils/Text";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { MaterialIcons } from "@expo/vector-icons";

const tips = [
  "Do you know? Our biometric system can speed up your check-ins by up to 50%.",
  "Do you know? Checking out before leaving helps maintain accurate work hours records.",
  "Do you know? Keeping your profile details up to date ensures smooth access to all features.",
  "Do you know? Reporting any issues immediately helps HR resolve them faster.",
  "Do you know? You can view your complete work hours history on your dashboard anytime.",
];

export default function CheckInOut() {
  const theme = useTheme();

  // Simulated employee status (true means checked in, false means not)
  // In a real app, this should be fetched from your backend or Redux store
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [currentTip, setCurrentTip] = useState<string>("");

  // Randomly select a tip every 30 seconds
  useEffect(() => {
    const updateTip = () => {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setCurrentTip(randomTip);
    };

    updateTip();
    const tipInterval = setInterval(updateTip, 30000);
    return () => clearInterval(tipInterval);
  }, []);

  // Handler for check-in/out button
  const handleAction = () => {
    if (isCheckedIn) {
      // Case: Employee wants to check out.
      Alert.alert("Confirm Checkout", "Are you sure you want to check out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            // Navigate to biometric authentication page for checkout.
            // router.push("/biometric-authentication?action=checkout");
          },
        },
      ]);
    } else {
      // Case: Employee wants to check in.
      Alert.alert("Confirm Check-In", "Do you want to check in now?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            // Navigate to biometric authentication page for checkin.
            // router.push("/biometric-authentication?action=checkin");
          },
        },
      ]);
    }
  };

  // Handler for edge cases (e.g., employee forgot to check in/out)
  // You could add additional buttons or options to resolve these scenarios.
  const handleEdgeCase = () => {
    Alert.alert(
      "Edge Case Detected",
      isCheckedIn
        ? "It seems you forgot to check out. Would you like to proceed with checkout for today and start a new check-in for tomorrow?"
        : "It seems you forgot to check in earlier. Would you like to check in now?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed",
          onPress: () => {
            // router.push(`"/biometric-authentication?edgeCase=true`);
          },
        },
      ]
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header with back arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} />
        </TouchableOpacity>
      </View>

      <Text
        variant="headlineMedium"
        style={[styles.title, { color: theme.colors.primary }]}
      >
        {isCheckedIn ? "You haven't checked out" : "You are not checked in"}
      </Text>

      {/* Tips */}
      <Text style={[styles.tip, { color: theme.colors.foreground }]}>
        {currentTip}
      </Text>

      <Button
        mode="contained"
        onPress={handleAction}
        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
      >
        {isCheckedIn ? "Check Out" : "Check In"}
      </Button>

      {/* Optional button for handling edge cases */}
      <Button
        mode="outlined"
        onPress={handleEdgeCase}
        style={styles.edgeCaseButton}
      >
        Handle Edge Case
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    paddingTop: 40,
  },
  header: {
    width: "100%",
    marginBottom: 200,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  tip: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  actionButton: {
    width: "80%",
    marginBottom: 20,
  },
  edgeCaseButton: {
    width: "80%",
  },
});
