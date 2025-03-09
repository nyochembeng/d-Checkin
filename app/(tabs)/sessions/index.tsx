import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Card, Chip, Divider } from "react-native-paper";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "@/components/utils/Text";
import { Header } from "@/components/utils/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Define types for session data
interface Session {
  id: string;
  courseTitle: string;
  time: string;
  period: string;
  deadline: string;
  location: string;
  instructor: string;
}

// Define type for grouped sessions
interface GroupedSession {
  day: string;
  data: Session[];
}

// Sample data for upcoming sessions
const sampleSessions: Session[] = [
  {
    id: "1",
    courseTitle: "Math 101",
    time: "Mon, 9:00 AM - 10:30 AM",
    period: "Morning",
    deadline: "8:50 AM",
    location: "Room 203",
    instructor: "Dr. Johnson",
  },
  {
    id: "2",
    courseTitle: "Physics 202",
    time: "Tue, 11:00 AM - 12:30 PM",
    period: "Late Morning",
    deadline: "10:50 AM",
    location: "Lab 104",
    instructor: "Prof. Smith",
  },
  {
    id: "3",
    courseTitle: "Chemistry 303",
    time: "Wed, 2:00 PM - 3:30 PM",
    period: "Afternoon",
    deadline: "1:50 PM",
    location: "Science Building B12",
    instructor: "Dr. Williams",
  },
  {
    id: "4",
    courseTitle: "History 104",
    time: "Thu, 1:00 PM - 2:30 PM",
    period: "Afternoon",
    deadline: "12:50 PM",
    location: "Humanities Hall 305",
    instructor: "Prof. Davis",
  },
];

// Group sessions by day
const groupSessionsByDay = (sessions: Session[]): GroupedSession[] => {
  const grouped: Record<string, Session[]> = {};
  sessions.forEach((session) => {
    const day = session.time.split(",")[0];
    if (!grouped[day]) {
      grouped[day] = [];
    }
    grouped[day].push(session);
  });
  return Object.entries(grouped).map(([day, daySessions]) => ({
    day,
    data: daySessions,
  }));
};

export default function SessionsPage(): React.ReactElement {
  const theme = useTheme();
  const [filterActive, setFilterActive] = useState<boolean>(false);
  const groupedSessions = groupSessionsByDay(sampleSessions);

  // Navigate to the session detail page when a session is pressed.
  const handleSessionPress = (sessionId: string): void => {
    // router.push(`/session/${sessionId}`);
  };

  // Get status color based on deadline proximity
  const getStatusColor = (deadlineTime: string): string => {
    // This is a placeholder logic - in a real app, compare with current time
    const hour = parseInt(deadlineTime.split(":")[0]);
    if (hour < 9) return theme.colors.success;
    if (hour < 12) return theme.colors.warning;
    return theme.colors.primary;
  };

  const renderSessionCard = (item: Session): React.ReactElement => (
    <TouchableOpacity
      onPress={() => handleSessionPress(item.id)}
      activeOpacity={0.7}
      key={item.id}
    >
      <Card style={[styles.card, { backgroundColor: theme.colors.cards }]}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(item.deadline) },
            ]}
          />
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.primary,
              fontWeight: "600",
              flex: 1,
            }}
          >
            {item.courseTitle}
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={theme.colors.mutedForeground}
          />
        </View>

        <Divider style={{ marginVertical: 8 }} />

        <Card.Content>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color={theme.colors.foreground}
              style={styles.icon}
            />
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.foreground }}
            >
              {item.time}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={16}
              color={theme.colors.mutedForeground}
              style={styles.icon}
            />
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.mutedForeground }}
            >
              {item.location}
            </Text>
          </View>

          <View style={styles.chipContainer}>
            <Chip style={styles.chip} textStyle={{ fontSize: 12 }}>
              Check-in by {item.deadline}
            </Chip>
            <View style={styles.instructorChip}>
              <MaterialCommunityIcons
                name="account-outline"
                size={14}
                color={theme.colors.mutedForeground}
              />
              <Text
                variant="bodySmall"
                style={{ marginLeft: 4, color: theme.colors.mutedForeground }}
              >
                {item.instructor}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  // Define types for filter buttons
  type FilterOption = {
    id: string;
    label: string;
    icon?: string;
  };

  // Filter options
  const filterOptions: FilterOption[] = [
    { id: "all", label: "All Sessions", icon: "filter-outline" },
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "morning", label: "Morning" },
    { id: "afternoon", label: "Afternoon" },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar backgroundColor={theme.colors.background} />
      <Header title="Upcoming Sessions" showBack showNotification />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterButton,
                option.id === "all" &&
                  filterActive && { backgroundColor: theme.colors.accent },
              ]}
              onPress={() =>
                option.id === "all" ? setFilterActive(!filterActive) : null
              }
            >
              {option.icon && (
                <MaterialCommunityIcons
                  name={option.icon as any}
                  size={16}
                  color={
                    option.id === "all" && filterActive
                      ? theme.colors.primary
                      : theme.colors.mutedForeground
                  }
                />
              )}
              <Text
                variant="bodySmall"
                style={{
                  color:
                    option.id === "all" && filterActive
                      ? theme.colors.primary
                      : theme.colors.mutedForeground,
                  marginLeft: option.icon ? 4 : 0,
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.minContainer}
        showsVerticalScrollIndicator={false}
      >
        {groupedSessions.map((group, index) => (
          <View key={index} style={styles.dayGroup}>
            <Text
              variant="titleSmall"
              style={{
                color: theme.colors.foreground,
                marginBottom: 8,
                fontWeight: "600",
              }}
            >
              {group.day}
            </Text>
            {group.data.map((item) => renderSessionCard(item))}
          </View>
        ))}

        <View style={styles.emptySpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  minContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    marginVertical: 8,
    elevation: 2,
    borderRadius: 12,
    // overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  statusIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  chipContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  chip: {
    height: "auto",
  },
  instructorChip: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginRight: 8,
  },
  dayGroup: {
    marginBottom: 16,
  },
  emptySpace: {
    height: 80,
  },
});
