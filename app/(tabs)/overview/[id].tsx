import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Card, Chip, SegmentedButtons, Divider, Badge } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import { useLocalSearchParams, router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "@/components/utils/Text";
import { Header } from "@/components/utils/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

// Enhanced course data structure
interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  schedule: string;
  room: string;
  totalSessions: number;
}

// Sample course data
const sampleCourse: Course = {
  id: "course1",
  title: "Mathematics 101",
  code: "MATH101",
  instructor: "Dr. Sarah Johnson",
  schedule: "Mon, Wed, Fri • 10:00 AM - 11:30 AM",
  room: "Hall B201",
  totalSessions: 30
};

// Enhanced attendance record structure
interface AttendanceRecord {
  id: string;
  date: string;
  dayOfWeek: string;
  checkIn: string;
  checkOut: string | null;
  status: "Present" | "Late" | "Absent" | "Excused";
  notes: string | null;
}

// Status colors mapping
const statusColors = {
  "Present": "#4CAF50",
  "Late": "#FFC107",
  "Absent": "#F44336",
  "Excused": "#2196F3"
};

// Sample attendance overview data for pie chart
const sampleAttendanceOverview = [
  {
    name: "Present",
    count: 20,
    color: statusColors.Present,
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  },
  {
    name: "Absent",
    count: 5,
    color: statusColors.Absent,
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  },
  {
    name: "Late",
    count: 3,
    color: statusColors.Late,
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  },
  {
    name: "Excused",
    count: 2,
    color: statusColors.Excused,
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  },
];

// Sample detailed attendance records
const sampleRecords: AttendanceRecord[] = [
  { 
    id: "1", 
    date: "Mar 20, 2025", 
    dayOfWeek: "Monday",
    checkIn: "08:30 AM", 
    checkOut: "10:00 AM",
    status: "Present",
    notes: null
  },
  { 
    id: "2", 
    date: "Mar 21, 2025", 
    dayOfWeek: "Tuesday",
    checkIn: "09:05 AM", 
    checkOut: "10:30 AM",
    status: "Late",
    notes: "Traffic delay"
  },
  { 
    id: "3", 
    date: "Mar 22, 2025", 
    dayOfWeek: "Wednesday",
    checkIn: "-", 
    checkOut: null,
    status: "Absent",
    notes: null
  },
  { 
    id: "4", 
    date: "Mar 23, 2025", 
    dayOfWeek: "Thursday",
    checkIn: "08:28 AM", 
    checkOut: "10:02 AM",
    status: "Present",
    notes: null
  },
  { 
    id: "5", 
    date: "Mar 24, 2025", 
    dayOfWeek: "Friday",
    checkIn: "08:45 AM", 
    checkOut: "09:50 AM",
    status: "Excused",
    notes: "Doctor's appointment"
  },
];

export default function HistoryDetailsPage() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  // In a real app, use the id to fetch course-specific attendance data
  const [course] = useState(sampleCourse);
  const [attendanceOverview] = useState(sampleAttendanceOverview);
  const [records] = useState(sampleRecords);
  const [viewMode, setViewMode] = useState("list");
  const [filterValue, setFilterValue] = useState("all");

  // Calculate attendance statistics
  const totalSessions = attendanceOverview.reduce((sum, item) => sum + item.count, 0);
  const presentCount = attendanceOverview.find(item => item.name === "Present")?.count || 0;
  const lateCount = attendanceOverview.find(item => item.name === "Late")?.count || 0;
  const attendanceRate = ((presentCount + lateCount) / totalSessions * 100).toFixed(1);

  // Filter records based on selected filter
  const filteredRecords = records.filter(record => {
    if (filterValue === "all") return true;
    return record.status.toLowerCase() === filterValue.toLowerCase();
  });

  // Render a single attendance record
  const renderAttendanceRecord = ({ item }: { item: AttendanceRecord }) => (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.cards }]}
      mode="elevated"
    >
      <Card.Content>
        <View style={styles.recordHeader}>
          <View>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.foreground, fontWeight: "bold" }}
            >
              {item.date}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.mutedForeground }}
            >
              {item.dayOfWeek}
            </Text>
          </View>
          <Chip 
            style={[styles.statusChip, { backgroundColor: statusColors[item.status] + "20" }]}
          >
            <Text style={{ color: statusColors[item.status], fontWeight: "bold" }}>
              {item.status}
            </Text>
          </Chip>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.timeContainer}>
          <View style={styles.timeBlock}>
            <MaterialCommunityIcons 
              name="login" 
              size={18} 
              color={theme.colors.primary} 
            />
            <View style={styles.timeTextContainer}>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.mutedForeground }}
              >
                Check-in
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.foreground }}
              >
                {item.checkIn}
              </Text>
            </View>
          </View>
          
          <View style={styles.timeBlock}>
            <MaterialCommunityIcons 
              name="logout" 
              size={18} 
              color={theme.colors.primary} 
            />
            <View style={styles.timeTextContainer}>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.mutedForeground }}
              >
                Check-out
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.foreground }}
              >
                {item.checkOut || "-"}
              </Text>
            </View>
          </View>
        </View>
        
        {item.notes && (
          <View style={styles.notesContainer}>
            <MaterialCommunityIcons 
              name="note-text-outline" 
              size={16} 
              color={theme.colors.mutedForeground} 
            />
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.mutedForeground, marginLeft: 4 }}
            >
              {item.notes}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title={course.title} showBack showNotification />
      
      <ScrollView style={styles.scrollContainer}>
        {/* Course Info Card */}
        <Card
          style={[styles.courseInfoCard, { backgroundColor: theme.colors.cards }]}
          mode="elevated"
        >
          <Card.Content>
            <View style={styles.courseHeaderRow}>
              <View>
                <Text
                  variant="titleLarge"
                  style={{ color: theme.colors.foreground, fontWeight: "bold" }}
                >
                  {course.title}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.primary, marginTop: 2 }}
                >
                  {course.code}
                </Text>
              </View>
              <Badge size={24} style={{ backgroundColor: theme.colors.primary }}>
                {course.totalSessions}
              </Badge>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.courseDetailsRow}>
              <View style={styles.courseDetailItem}>
                <MaterialCommunityIcons 
                  name="account-tie" 
                  size={16} 
                  color={theme.colors.mutedForeground} 
                />
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.mutedForeground, marginLeft: 6 }}
                >
                  {course.instructor}
                </Text>
              </View>
              <View style={styles.courseDetailItem}>
                <MaterialCommunityIcons 
                  name="calendar-clock" 
                  size={16} 
                  color={theme.colors.mutedForeground} 
                />
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.mutedForeground, marginLeft: 6 }}
                >
                  {course.schedule}
                </Text>
              </View>
              <View style={styles.courseDetailItem}>
                <MaterialCommunityIcons 
                  name="map-marker" 
                  size={16} 
                  color={theme.colors.mutedForeground} 
                />
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.mutedForeground, marginLeft: 6 }}
                >
                  {course.room}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Attendance Summary Section */}
        <View style={styles.sectionContainer}>
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: theme.colors.foreground }]}
          >
            Attendance Summary
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text
                variant="headlineMedium"
                style={{ color: theme.colors.primary, fontWeight: "bold" }}
              >
                {attendanceRate}%
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.mutedForeground }}
              >
                Overall Rate
              </Text>
            </View>
            
            <View style={styles.statCard}>
              <Text
                variant="headlineMedium"
                style={{ color: statusColors.Present, fontWeight: "bold" }}
              >
                {presentCount}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.mutedForeground }}
              >
                Present
              </Text>
            </View>
            
            <View style={styles.statCard}>
              <Text
                variant="headlineMedium"
                style={{ color: statusColors.Absent, fontWeight: "bold" }}
              >
                {attendanceOverview.find(item => item.name === "Absent")?.count || 0}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.mutedForeground }}
              >
                Absent
              </Text>
            </View>
            
            <View style={styles.statCard}>
              <Text
                variant="headlineMedium"
                style={{ color: statusColors.Late, fontWeight: "bold" }}
              >
                {lateCount}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.mutedForeground }}
              >
                Late
              </Text>
            </View>
          </View>
          
          <PieChart
            data={attendanceOverview}
            width={screenWidth - 32}
            height={180}
            chartConfig={{
              backgroundColor: theme.colors.background,
              backgroundGradientFrom: theme.colors.background,
              backgroundGradientTo: theme.colors.background,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => theme.colors.foreground,
              style: {
                borderRadius: 16,
              },
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            hasLegend={true}
            center={[screenWidth / 6, 0]}
            style={styles.pieChart}
          />
        </View>
        
        {/* Attendance Records Section */}
        <View style={styles.sectionContainer}>
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: theme.colors.foreground }]}
          >
            Attendance Records
          </Text>
          
          <View style={styles.filterContainer}>
            <SegmentedButtons
              value={viewMode}
              onValueChange={setViewMode}
              buttons={[
                { value: 'list', label: 'List' },
                { value: 'calendar', label: 'Calendar' },
              ]}
              style={styles.segmentedButtons}
            />
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterScrollView}
            >
              <TouchableOpacity onPress={() => setFilterValue("all")}>
                <Chip 
                  selected={filterValue === "all"} 
                  onPress={() => setFilterValue("all")}
                  style={[
                    styles.filterChip, 
                    filterValue === "all" && { backgroundColor: theme.colors.primary }
                  ]}
                  textStyle={{ 
                    color: filterValue === "all" ? theme.colors.background : theme.colors.foreground 
                  }}
                >
                  All
                </Chip>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => setFilterValue("present")}>
                <Chip 
                  selected={filterValue === "present"} 
                  onPress={() => setFilterValue("present")}
                  style={[
                    styles.filterChip, 
                    filterValue === "present" && { backgroundColor: statusColors.Present }
                  ]}
                  textStyle={{ 
                    color: filterValue === "present" ? "#FFF" : theme.colors.foreground 
                  }}
                >
                  Present
                </Chip>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => setFilterValue("late")}>
                <Chip 
                  selected={filterValue === "late"} 
                  onPress={() => setFilterValue("late")}
                  style={[
                    styles.filterChip, 
                    filterValue === "late" && { backgroundColor: statusColors.Late }
                  ]}
                  textStyle={{ 
                    color: filterValue === "late" ? "#000" : theme.colors.foreground 
                  }}
                >
                  Late
                </Chip>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => setFilterValue("absent")}>
                <Chip 
                  selected={filterValue === "absent"} 
                  onPress={() => setFilterValue("absent")}
                  style={[
                    styles.filterChip, 
                    filterValue === "absent" && { backgroundColor: statusColors.Absent }
                  ]}
                  textStyle={{ 
                    color: filterValue === "absent" ? "#FFF" : theme.colors.foreground 
                  }}
                >
                  Absent
                </Chip>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => setFilterValue("excused")}>
                <Chip 
                  selected={filterValue === "excused"} 
                  onPress={() => setFilterValue("excused")}
                  style={[
                    styles.filterChip, 
                    filterValue === "excused" && { backgroundColor: statusColors.Excused }
                  ]}
                  textStyle={{ 
                    color: filterValue === "excused" ? "#FFF" : theme.colors.foreground 
                  }}
                >
                  Excused
                </Chip>
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          {viewMode === "list" ? (
            <FlatList
              data={filteredRecords}
              keyExtractor={(item) => item.id}
              renderItem={renderAttendanceRecord}
              contentContainerStyle={styles.listContainer}
              scrollEnabled={false}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons 
                    name="calendar-remove" 
                    size={48} 
                    color={theme.colors.mutedForeground} 
                  />
                  <Text
                    variant="bodyLarge"
                    style={{ color: theme.colors.mutedForeground, marginTop: 12 }}
                  >
                    No records found
                  </Text>
                </View>
              )}
            />
          ) : (
            <View style={styles.calendarPlaceholder}>
              <MaterialCommunityIcons 
                name="calendar-month" 
                size={48} 
                color={theme.colors.primary} 
              />
              <Text
                variant="bodyLarge"
                style={{ color: theme.colors.mutedForeground, marginTop: 12 }}
              >
                Calendar view coming soon
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  courseInfoCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 3,
  },
  courseHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  divider: {
    marginVertical: 10,
  },
  courseDetailsRow: {
    gap: 8,
  },
  courseDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    minWidth: 72,
  },
  pieChart: {
    marginVertical: 8,
  },
  filterContainer: {
    marginBottom: 12,
  },
  segmentedButtons: {
    marginBottom: 12,
  },
  filterScrollView: {
    flexDirection: "row",
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginVertical: 8,
    elevation: 2,
    borderRadius: 12,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusChip: {
    borderRadius: 12,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeTextContainer: {
    marginLeft: 8,
  },
  notesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  calendarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    marginVertical: 8,
  },
});