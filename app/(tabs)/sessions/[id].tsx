import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from "react-native";
import { Card, Divider, Button, Avatar } from "react-native-paper";
import { Calendar, DateData } from "react-native-calendars";
import { useLocalSearchParams, router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "@/components/utils/Text";
import { Header } from "@/components/utils/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Define interfaces for type safety
interface CourseSession {
  id: string;
  date: string;
  time: string;
  period: string;
  deadline: string;
  location?: string;
  instructor?: string;
  attendanceStatus?: "present" | "absent" | "pending" | "late" | "excused";
}

interface MarkedDates {
  [date: string]: {
    selected?: boolean;
    marked?: boolean;
    selectedColor?: string;
    dotColor?: string;
    customStyles?: {
      container?: {
        backgroundColor?: string;
      };
      text?: {
        color?: string;
      };
    };
  };
}

// Sample data for sessions of a particular course (based on session id)
const sampleCourseSessions: CourseSession[] = [
  {
    id: "1",
    date: "2023-03-20",
    time: "09:00 AM - 10:30 AM",
    period: "Morning",
    deadline: "08:50 AM",
    location: "Room 203",
    instructor: "Dr. Johnson",
    attendanceStatus: "present",
  },
  {
    id: "2",
    date: "2023-03-22",
    time: "09:00 AM - 10:30 AM",
    period: "Morning",
    deadline: "08:50 AM",
    location: "Room 203",
    instructor: "Dr. Johnson",
    attendanceStatus: "pending",
  },
  {
    id: "3",
    date: "2023-03-24",
    time: "09:00 AM - 10:30 AM",
    period: "Morning",
    deadline: "08:50 AM",
    location: "Room 203",
    instructor: "Dr. Johnson",
    attendanceStatus: "absent",
  },
  {
    id: "4",
    date: "2023-03-27",
    time: "09:00 AM - 10:30 AM",
    period: "Morning",
    deadline: "08:50 AM",
    location: "Room 203",
    instructor: "Dr. Johnson",
    attendanceStatus: "pending",
  },
];

// Course details
const courseDetails = {
  name: "Mathematics 101",
  code: "MATH101",
  instructor: "Dr. Johnson",
  description:
    "Introduction to fundamental mathematical concepts and techniques.",
  totalSessions: 16,
  completedSessions: 3,
};

// Helper to generate marked dates for react-native-calendars
const getMarkedDates = (sessions: CourseSession[]): MarkedDates => {
  const marks: MarkedDates = {};

  sessions.forEach((session) => {
    let dotColor;

    // Set color based on attendance status
    switch (session.attendanceStatus) {
      case "present":
        dotColor = "#4CAF50"; // Green
        break;
      case "absent":
        dotColor = "#F44336"; // Red
        break;
      case "pending":
      default:
        dotColor = "#2196F3"; // Blue
        break;
    }

    marks[session.date] = {
      marked: true,
      dotColor: dotColor,
      selected: true,
      selectedColor: "rgba(33, 150, 243, 0.1)", // Light blue background
      customStyles: {
        container: {
          backgroundColor: "rgba(33, 150, 243, 0.1)",
        },
        text: {
          color: "#000000",
          // fontWeight: 'bold',
        },
      },
    };
  });

  return marks;
};

export default function SessionDetail(): React.ReactElement {
  const theme = useTheme();
  // Retrieve session id from URL parameters if needed
  const { id } = useLocalSearchParams<{ id: string }>();
  const [sessions, setSessions] =
    useState<CourseSession[]>(sampleCourseSessions);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredSessions, setFilteredSessions] =
    useState<CourseSession[]>(sessions);
  const [scrollY] = useState(new Animated.Value(0));

  // Filter sessions based on selected date
  useEffect(() => {
    if (selectedDate) {
      setFilteredSessions(
        sessions.filter((session) => session.date === selectedDate)
      );
    } else {
      setFilteredSessions(sessions);
    }
  }, [selectedDate, sessions]);

  const handleDateSelect = (date: DateData) => {
    if (selectedDate === date.dateString) {
      // If the same date is selected again, clear the filter
      setSelectedDate(null);
    } else {
      setSelectedDate(date.dateString);
    }
  };

  const handleSessionPress = (sessionId: string) => {
    // Navigate to detailed session view or attendance check-in
    // router.push(`/check-in/${sessionId}`);
  };

  // Calculate course progress
  const progressPercentage =
    (courseDetails.completedSessions / courseDetails.totalSessions) * 100;

  // Render attendance status badge
  const renderAttendanceStatus = (
    status?: "present" | "absent" | "pending" | "late" | "excused"
  ) => {
    let statusColor;
    let statusText;
    let iconName;

    switch (status) {
      case "present":
        statusColor = theme.colors.success;
        statusText = "Present";
        iconName = "check-circle";
        break;
      case "absent":
        statusColor = theme.colors.danger;
        statusText = "Absent";
        iconName = "close-circle";
        break;
      case "late":
        statusColor = theme.colors.warning;
        statusText = "Late";
        iconName = "check-circle";
        break;
      case "excused":
        statusColor = theme.colors.info;
        statusText = "Excused";
        iconName = "check-circle";
        break;
      case "pending":
      default:
        statusColor = theme.colors.info;
        statusText = "Upcoming";
        iconName = "clock-outline";
        break;
    }

    return (
      <View
        style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}
      >
        <MaterialCommunityIcons
          name={iconName as any}
          size={14}
          color={statusColor}
        />
        <Text style={[styles.statusText, { color: statusColor }]}>
          {statusText}
        </Text>
      </View>
    );
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Animation for header
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar backgroundColor={theme.colors.background} />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.headerContainer,
          { opacity: headerOpacity, backgroundColor: theme.colors.background },
        ]}
      >
        <Header title={courseDetails.name} showBack showNotification />

        {/* Course Info Card */}
        <Card
          style={[
            styles.courseInfoCard,
            { backgroundColor: theme.colors.cards },
          ]}
        >
          <Card.Content>
            <View style={styles.courseHeaderRow}>
              <View style={styles.courseDetails}>
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.foreground, fontWeight: "bold" }}
                >
                  {courseDetails.name}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.mutedForeground }}
                >
                  {courseDetails.code} • {courseDetails.instructor}
                </Text>
              </View>
              <Avatar.Text
                size={40}
                label={courseDetails.name.substring(0, 2).toUpperCase()}
                color={theme.colors.primary}
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.progressContainer}>
              <View style={styles.progressInfo}>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.foreground }}
                >
                  Course Progress
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.primary }}
                >
                  {courseDetails.completedSessions}/
                  {courseDetails.totalSessions} sessions
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      backgroundColor: theme.colors.primary,
                      width: `${progressPercentage}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Calendar View */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.foreground, fontWeight: "bold" }}
            >
              Session Calendar
            </Text>
            {selectedDate && (
              <TouchableOpacity onPress={() => setSelectedDate(null)}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.primary }}
                >
                  Clear Filter
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Card
            style={[
              styles.calendarCard,
              { backgroundColor: theme.colors.cards },
            ]}
          >
            <Calendar
              markedDates={getMarkedDates(sessions)}
              onDayPress={handleDateSelect}
              theme={{
                backgroundColor: theme.colors.cards,
                calendarBackground: theme.colors.cards,
                textSectionTitleColor: theme.colors.primary,
                selectedDayBackgroundColor: theme.colors.primary,
                selectedDayTextColor: "#ffffff",
                todayTextColor: theme.colors.primary,
                dayTextColor: theme.colors.foreground,
                textDisabledColor: theme.colors.muted,
                dotColor: theme.colors.primary,
                selectedDotColor: "#ffffff",
                arrowColor: theme.colors.primary,
                monthTextColor: theme.colors.foreground,
              }}
              style={styles.calendar}
            />
          </Card>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#4CAF50" }]}
              />
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.mutedForeground }}
              >
                Present
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#F44336" }]}
              />
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.mutedForeground }}
              >
                Absent
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#2196F3" }]}
              />
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.mutedForeground }}
              >
                Upcoming
              </Text>
            </View>
          </View>
        </View>

        {/* Sessions List */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.foreground, fontWeight: "bold" }}
            >
              {selectedDate
                ? `Sessions on ${formatDate(selectedDate)}`
                : "All Sessions"}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.mutedForeground }}
            >
              {filteredSessions.length}{" "}
              {filteredSessions.length === 1 ? "session" : "sessions"}
            </Text>
          </View>

          {filteredSessions.length > 0 ? (
            filteredSessions.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSessionPress(item.id)}
                activeOpacity={0.7}
              >
                <Card
                  style={[
                    styles.sessionCard,
                    { backgroundColor: theme.colors.cards },
                  ]}
                >
                  <Card.Content>
                    <View style={styles.sessionHeader}>
                      <View>
                        <Text
                          variant="titleSmall"
                          style={{
                            color: theme.colors.foreground,
                            fontWeight: "bold",
                          }}
                        >
                          {formatDate(item.date)}
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.mutedForeground }}
                        >
                          {item.time}
                        </Text>
                      </View>
                      {renderAttendanceStatus(item.attendanceStatus)}
                    </View>

                    <Divider style={styles.sessionDivider} />

                    <View style={styles.sessionDetails}>
                      <View style={styles.sessionInfoRow}>
                        <MaterialCommunityIcons
                          name="map-marker-outline"
                          size={16}
                          color={theme.colors.mutedForeground}
                          style={styles.icon}
                        />
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.mutedForeground }}
                        >
                          {item.location}
                        </Text>
                      </View>

                      <View style={styles.sessionInfoRow}>
                        <MaterialCommunityIcons
                          name="account-outline"
                          size={16}
                          color={theme.colors.mutedForeground}
                          style={styles.icon}
                        />
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.mutedForeground }}
                        >
                          {item.instructor}
                        </Text>
                      </View>

                      <View style={styles.sessionInfoRow}>
                        <MaterialCommunityIcons
                          name="clock-outline"
                          size={16}
                          color={theme.colors.mutedForeground}
                          style={styles.icon}
                        />
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.mutedForeground }}
                        >
                          Check-in by {item.deadline}
                        </Text>
                      </View>
                    </View>

                    {item.attendanceStatus === "pending" && (
                      <View style={styles.actionContainer}>
                        <Button
                          mode="contained"
                          onPress={() => handleSessionPress(item.id)}
                          style={styles.checkInButton}
                          contentStyle={{ height: 36 }}
                          labelStyle={{ fontSize: 14 }}
                        >
                          Check In
                        </Button>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Card
              style={[
                styles.emptyCard,
                { backgroundColor: theme.colors.cards },
              ]}
            >
              <Card.Content style={styles.emptyContent}>
                <MaterialCommunityIcons
                  name="calendar-blank"
                  size={40}
                  color={theme.colors.mutedForeground}
                />
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.mutedForeground, marginTop: 8 }}
                >
                  No sessions found for this date
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => setSelectedDate(null)}
                  style={{ marginTop: 16 }}
                >
                  View All Sessions
                </Button>
              </Card.Content>
            </Card>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  courseInfoCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
  },
  courseHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseDetails: {
    flex: 1,
  },
  divider: {
    marginVertical: 12,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  sectionContainer: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  calendarCard: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  calendar: {
    borderRadius: 12,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  sessionCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  sessionDivider: {
    marginVertical: 10,
  },
  sessionDetails: {
    marginTop: 4,
  },
  sessionInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
  },
  actionContainer: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  checkInButton: {
    borderRadius: 8,
  },
  emptyCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 32,
  },
  bottomSpace: {
    height: 40,
  },
});
