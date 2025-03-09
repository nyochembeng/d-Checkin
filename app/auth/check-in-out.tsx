import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
} from "react-native";
import { Button } from "react-native-paper";
import { Text } from "@/components/utils/Text";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

// Sample tips
const tips = [
  "Our biometric system can speed up your check-ins by up to 50%.",
  "Checking out before leaving helps maintain accurate work hours records.",
  "Keeping your profile details up to date ensures smooth access to all features.",
  "Reporting any issues immediately helps HR resolve them faster.",
  "You can view your complete work hours history on your dashboard anytime.",
];

// For demonstration: change this to "employee" or "student"
const userRole: "employee" | "student" = "student";

// Sample course details (for students)
const courseDetails = {
  courseTitle: "Advanced Mathematics",
  period: "09:00 AM - 11:00 AM",
  checkInDeadline: "08:50 AM",
  status: "On Time", // or "Late"
  location: "Room 202, Building B",
  instructor: "Dr. Samuel Johnson",
};

const { width } = Dimensions.get("window");

export default function CheckInOut() {
  const theme = useTheme();
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const currentDate = new Date().toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Calculate time status for students
  const getTimeStatus = () => {
    // In a real app, this would use actual time comparisons
    const status = courseDetails.status;
    if (status === "On Time") {
      return {
        color: "#4CAF50",
        icon: "check-circle",
        text: "On Time",
      };
    } else {
      return {
        color: "#FFC107",
        icon: "alert-circle",
        text: "Late",
      };
    }
  };

  const timeStatus = getTimeStatus();

  // Cycle through tips with animation
  useEffect(() => {
    const cycleTips = () => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Update tip
        setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);

        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    };

    const interval = setInterval(cycleTips, 10000);
    return () => clearInterval(interval);
  }, [fadeAnim]);

  // Handler for check-in/out button
  const handleAction = () => {
    if (isCheckedIn) {
      // Employee: checkout; Student: simply navigate
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
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />

      {/* Header with close icon */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.foreground }]}>
          {userRole === "student" ? "Class Check-In" : "Work Check-In"}
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <MaterialIcons
            name="close"
            size={24}
            color={theme.colors.foreground}
          />
        </TouchableOpacity>
      </View>

      {/* Date and Time */}
      <View style={styles.dateTimeContainer}>
        <Text style={[styles.time, { color: theme.colors.foreground }]}>
          {currentTime}
        </Text>
        <Text style={[styles.date, { color: theme.colors.foreground }]}>
          {currentDate}
        </Text>
      </View>

      {/* Status Card */}
      <View
        style={[styles.statusCard, { backgroundColor: theme.colors.cards }]}
      >
        <View
          style={[
            styles.statusIconContainer,
            {
              backgroundColor: `${
                isCheckedIn ? theme.colors.primary : "#E0E0E0"
              }20`,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={isCheckedIn ? "login-variant" : "logout-variant"}
            size={36}
            color={isCheckedIn ? theme.colors.primary : theme.colors.foreground}
          />
        </View>
        <Text
          variant="headlineMedium"
          style={[styles.statusTitle, { color: theme.colors.foreground }]}
        >
          {isCheckedIn ? "You're Currently Checked In" : "Not Checked In"}
        </Text>
        <Text
          style={[styles.statusSubtitle, { color: theme.colors.foreground }]}
        >
          {isCheckedIn
            ? "Don't forget to check out before leaving"
            : "Please check in to record your attendance"}
        </Text>
      </View>

      {/* For students: display course details */}
      {userRole === "student" && (
        <View
          style={[styles.courseCard, { backgroundColor: theme.colors.cards }]}
        >
          <View style={styles.courseHeader}>
            <Text
              variant="titleMedium"
              style={[styles.courseTitle, { color: theme.colors.foreground }]}
            >
              {courseDetails.courseTitle}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${timeStatus.color}20` },
              ]}
            >
              <MaterialCommunityIcons
                name={timeStatus.icon as any}
                size={16}
                color={timeStatus.color}
              />
              <Text style={[styles.statusText, { color: timeStatus.color }]}>
                {timeStatus.text}
              </Text>
            </View>
          </View>

          <View style={styles.courseDetailsRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={18}
              color={theme.colors.foreground}
            />
            <Text
              style={[
                styles.courseDetailText,
                { color: theme.colors.foreground },
              ]}
            >
              {courseDetails.period}
            </Text>
          </View>

          <View style={styles.courseDetailsRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={18}
              color={theme.colors.foreground}
            />
            <Text
              style={[
                styles.courseDetailText,
                { color: theme.colors.foreground },
              ]}
            >
              {courseDetails.location}
            </Text>
          </View>

          <View style={styles.courseDetailsRow}>
            <MaterialCommunityIcons
              name="account-outline"
              size={18}
              color={theme.colors.foreground}
            />
            <Text
              style={[
                styles.courseDetailText,
                { color: theme.colors.foreground },
              ]}
            >
              {courseDetails.instructor}
            </Text>
          </View>

          <View style={styles.courseDetailsRow}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={18}
              color={theme.colors.foreground}
            />
            <Text
              style={[
                styles.courseDetailText,
                { color: theme.colors.foreground },
              ]}
            >
              Check-in Deadline: {courseDetails.checkInDeadline}
            </Text>
          </View>
        </View>
      )}

      {/* Tip Message */}
      <View style={styles.tipContainer}>
        <MaterialCommunityIcons
          name="lightbulb-outline"
          size={20}
          color={theme.colors.primary}
        />
        <Animated.View style={[styles.tipTextContainer, { opacity: fadeAnim }]}>
          <Text style={[styles.tipText, { color: theme.colors.foreground }]}>
            {tips[currentTipIndex]}
          </Text>
        </Animated.View>
      </View>

      {/* Check-In/Out Button */}
      <Button
        mode="contained"
        onPress={handleAction}
        style={styles.actionButton}
        contentStyle={styles.actionButtonContent}
        labelStyle={styles.actionButtonLabel}
      >
        {isCheckedIn ? "Check Out" : "Check In"}
      </Button>

      {/* For employees: display the edge case button */}
      {userRole === "employee" && (
        <Button
          mode="outlined"
          onPress={handleEdgeCase}
          style={styles.edgeCaseButton}
          labelStyle={{ color: theme.colors.primary }}
        >
          Report Issue with Check-In/Out
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  dateTimeContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  time: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
  },
  statusCard: {
    width: "100%",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    elevation: 1,
  },
  statusIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  statusSubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  courseCard: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 1,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  courseTitle: {
    fontWeight: "700",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  courseDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  courseDetailText: {
    marginLeft: 8,
    fontSize: 14,
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  tipTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButton: {
    borderRadius: 12,
    marginBottom: 16,
  },
  actionButtonContent: {
    height: 52,
  },
  actionButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  edgeCaseButton: {
    borderRadius: 12,
  },
});
