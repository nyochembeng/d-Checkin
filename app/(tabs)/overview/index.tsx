import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
} from "react-native";
import {
  List,
  Chip,
  Divider,
  Card,
  Avatar,
  Searchbar,
} from "react-native-paper";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Header } from "@/components/utils/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Enhanced course data structure
interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  lastAttendance: string;
  attendanceRate: number;
  totalSessions: number;
  attendedSessions: number;
  upcoming: {
    date: string;
    time: string;
    room: string;
  } | null;
}

// Sample courses data with richer information
const sampleCourses: Course[] = [
  {
    id: "course1",
    title: "Mathematics 101",
    code: "MATH101",
    instructor: "Dr. Sarah Johnson",
    lastAttendance: "2025-03-01",
    attendanceRate: 92,
    totalSessions: 24,
    attendedSessions: 22,
    upcoming: {
      date: "March 5, 2025",
      time: "10:00 AM - 11:30 AM",
      room: "Hall B201",
    },
  },
  {
    id: "course2",
    title: "Physics 202",
    code: "PHYS202",
    instructor: "Prof. Michael Chen",
    lastAttendance: "2025-03-02",
    attendanceRate: 85,
    totalSessions: 20,
    attendedSessions: 17,
    upcoming: {
      date: "March 6, 2025",
      time: "2:00 PM - 3:30 PM",
      room: "Lab C103",
    },
  },
  {
    id: "course3",
    title: "Chemistry 303",
    code: "CHEM303",
    instructor: "Dr. Elena Rodriguez",
    lastAttendance: "2025-02-28",
    attendanceRate: 100,
    totalSessions: 15,
    attendedSessions: 15,
    upcoming: null,
  },
];

export default function HistoryPage() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Filter courses based on search query
  const filteredCourses = sampleCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get attendance color based on percentage
  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "#4CAF50"; // Green
    if (percentage >= 75) return "#FFC107"; // Yellow
    return "#F44336"; // Red
  };

  // Render each course card
  const renderCourseCard = ({ item }: { item: Course }) => (
    <TouchableOpacity
      // onPress={() => router.push(`/history/${item.id}`)}
      style={styles.cardContainer}
    >
      <Card
        style={[styles.card, { backgroundColor: theme.colors.cards }]}
        mode="elevated"
      >
        <Card.Content>
          <View style={styles.courseHeader}>
            <View style={styles.courseInfo}>
              <Text
                style={[styles.courseTitle, { color: theme.colors.foreground }]}
              >
                {item.title}
              </Text>
              <Text style={[styles.courseCode, { color: theme.colors.accent }]}>
                {item.code} • {item.instructor}
              </Text>
            </View>
            <Avatar.Text
              size={48}
              label={item.code.substring(0, 2)}
            />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.attendanceContainer}>
            <View style={styles.attendanceInfo}>
              <Text
                style={[styles.attendanceLabel, { color: theme.colors.accent }]}
              >
                Attendance Rate
              </Text>
              <View style={styles.attendanceRow}>
                <Text
                  style={[
                    styles.attendanceValue,
                    { color: getAttendanceColor(item.attendanceRate) },
                  ]}
                >
                  {item.attendanceRate}%
                </Text>
                <Text
                  style={[
                    styles.attendanceFraction,
                    { color: theme.colors.accent },
                  ]}
                >
                  ({item.attendedSessions}/{item.totalSessions})
                </Text>
              </View>
            </View>

            <View style={styles.attendanceBarContainer}>
              <View
                style={[
                  styles.attendanceBar,
                  {
                    backgroundColor: getAttendanceColor(item.attendanceRate),
                    width: `${item.attendanceRate}%`,
                  },
                ]}
              />
              <View
                style={[
                  styles.attendanceBarBg,
                  {
                    backgroundColor: theme.colors.muted,
                    width: `${100 - item.attendanceRate}%`,
                  },
                ]}
              />
            </View>
          </View>

          {item.upcoming && (
            <View style={styles.upcomingSession}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={18}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  styles.upcomingText,
                  { color: theme.colors.foreground },
                ]}
              >
                Next: {item.upcoming.date} • {item.upcoming.time} •{" "}
                {item.upcoming.room}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Session History" showBack showNotification />

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search courses..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchbar, { backgroundColor: theme.colors.cards }]}
          iconColor={theme.colors.accent}
          inputStyle={{ color: theme.colors.foreground }}
        />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={selectedFilter === "all"}
            onPress={() => setSelectedFilter("all")}
            style={[
              styles.filterChip,
              selectedFilter === "all" && {
                backgroundColor: theme.colors.primary,
              },
            ]}
            textStyle={{
              color:
                selectedFilter === "all"
                  ? theme.colors.background
                  : theme.colors.foreground,
            }}
          >
            All Courses
          </Chip>
          <Chip
            selected={selectedFilter === "today"}
            onPress={() => setSelectedFilter("today")}
            style={[
              styles.filterChip,
              selectedFilter === "today" && {
                backgroundColor: theme.colors.primary,
              },
            ]}
            textStyle={{
              color:
                selectedFilter === "today"
                  ? theme.colors.background
                  : theme.colors.foreground,
            }}
          >
            Today
          </Chip>
          <Chip
            selected={selectedFilter === "this-week"}
            onPress={() => setSelectedFilter("this-week")}
            style={[
              styles.filterChip,
              selectedFilter === "this-week" && {
                backgroundColor: theme.colors.primary,
              },
            ]}
            textStyle={{
              color:
                selectedFilter === "this-week"
                  ? theme.colors.background
                  : theme.colors.foreground,
            }}
          >
            This Week
          </Chip>
          <Chip
            selected={selectedFilter === "low-attendance"}
            onPress={() => setSelectedFilter("low-attendance")}
            style={[
              styles.filterChip,
              selectedFilter === "low-attendance" && {
                backgroundColor: theme.colors.primary,
              },
            ]}
            textStyle={{
              color:
                selectedFilter === "low-attendance"
                  ? theme.colors.background
                  : theme.colors.foreground,
            }}
          >
            Low Attendance
          </Chip>
        </ScrollView>
      </View>

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={renderCourseCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {filteredCourses.length === 0 && (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="calendar-search"
            size={64}
            color={theme.colors.accent}
          />
          <Text style={[styles.emptyText, { color: theme.colors.foreground }]}>
            No courses match your search
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  searchbar: {
    elevation: 2,
    borderRadius: 12,
    height: 46,
  },
  filterContainer: {
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  filterChip: {
    marginHorizontal: 4,
    marginVertical: 4,
    borderRadius: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  courseInfo: {
    flex: 1,
    marginRight: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  courseCode: {
    fontSize: 14,
  },
  divider: {
    marginVertical: 10,
  },
  attendanceContainer: {
    marginVertical: 8,
  },
  attendanceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  attendanceLabel: {
    fontSize: 14,
  },
  attendanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  attendanceValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  attendanceFraction: {
    fontSize: 14,
    marginLeft: 4,
  },
  attendanceBarContainer: {
    height: 6,
    flexDirection: "row",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 4,
  },
  attendanceBar: {
    height: "100%",
  },
  attendanceBarBg: {
    height: "100%",
  },
  upcomingSession: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  upcomingText: {
    fontSize: 13,
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
  },
});
