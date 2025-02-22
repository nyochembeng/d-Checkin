import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { Text } from "@/components/utils/Text";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { MaterialIcons } from "@expo/vector-icons";

// Sample tips
const tips = [
  "Do you know? Our biometric system can speed up your check-ins by up to 50%.",
  "Do you know? Checking out before leaving helps maintain accurate work hours records.",
  "Do you know? Keeping your profile details up to date ensures smooth access to all features.",
  "Do you know? Reporting any issues immediately helps HR resolve them faster.",
  "Do you know? You can view your complete work hours history on your dashboard anytime.",
];

// For demonstration: change this to "employee" or "student"
const userRole: "employee" | "student" = "student";

// Sample course details (for students)
const courseDetails = {
  courseTitle: "Advanced Mathematics",
  period: "09:00 AM - 11:00 AM",
  checkInDeadline: "08:50 AM",
  status: "On Time", // or "Late"
};

export default function CheckInOut() {
  const theme = useTheme();
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
      // Employee: checkout; Student: simply navigate (if applicable)
      // router.push("/biometric-authentication?action=checkout");
    } else {
      // router.push("/biometric-authentication?action=checkin");
    }
  };

  // Handler for edge cases (only for employees)
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
            // router.push("/biometric-authentication?edgeCase=true");
          },
        },
      ]
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header with close icon */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <View style={styles.headerCenter}/>
        <TouchableOpacity
          style={styles.headerRight}
          onPress={() => router.back()}
        >
          <MaterialIcons
            name="close"
            size={24}
            color={theme.colors.foreground}
          />
        </TouchableOpacity>
      </View>

      <Text
        variant="headlineMedium"
        style={[styles.title, { color: theme.colors.primary }]}
      >
        {isCheckedIn ? "You haven't checked out" : "You are not checked in"}
      </Text>

      {/* Tip Message */}
      <Text style={[styles.tip, { color: theme.colors.foreground }]}>
        {currentTip}
      </Text>

      {/* For students: display course details below tips */}
      {userRole === "student" && (
        <View
          style={[
            styles.courseContainer,
            { borderColor: theme.colors.primary },
          ]}
        >
          <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
            {courseDetails.courseTitle}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.foreground }}>
            Period: {courseDetails.period}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.foreground }}>
            Check-in Deadline: {courseDetails.checkInDeadline}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.foreground }}>
            Status: {courseDetails.status}
          </Text>
        </View>
      )}

      {/* Check-In/Out Button */}
      <Button
        mode="contained"
        onPress={handleAction}
        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
      >
        {isCheckedIn ? "Check Out" : "Check In"}
      </Button>

      {/* For employees: display the edge case button */}
      {userRole === "employee" && (
        <Button
          mode="outlined"
          onPress={handleEdgeCase}
          style={styles.edgeCaseButton}
        >
          Handle Edge Case
        </Button>
      )}
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 150,
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 4,
    alignItems: "center",
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
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
  courseContainer: {
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  actionButton: {
    width: "80%",
    marginBottom: 20,
  },
  edgeCaseButton: {
    width: "80%",
  },
});
