import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  DataTable,
  Card,
  Surface,
  Chip,
  Divider,
  Badge,
  IconButton,
} from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { Text } from "../utils/Text";
import { useTheme } from "@/lib/hooks/useTheme";
import { Header } from "../utils/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width;

// Define types for our data
interface WorkHourData {
  labels: string[];
  datasets: {
    data: number[];
    color: (opacity?: number) => string;
    strokeWidth: number;
  }[];
  legend: string[];
}

interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  overtime: string;
  status?: "on-time" | "late" | "early-leave";
}

interface AttendanceSummary {
  totalDays: number;
  onTime: number;
  late: number;
  earlyLeave: number;
  overtime: string;
  averageHours: string;
}

// Sample data for the chart (work hours per day)
const sampleChartData: WorkHourData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"], // previous working days
  datasets: [
    {
      data: [8, 7.5, 9, 8.5, 7], // sample work hours per day
      color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`, // primary color
      strokeWidth: 2,
    },
  ],
  legend: ["Work Hours"],
};

// Sample data for the table
const sampleTableData: AttendanceRecord[] = [
  {
    date: "2023-02-20",
    checkIn: "08:30 AM",
    checkOut: "05:00 PM",
    duration: "8.5 hrs",
    overtime: "0.5 hr",
    status: "on-time",
  },
  {
    date: "2023-02-21",
    checkIn: "08:45 AM",
    checkOut: "05:15 PM",
    duration: "8.5 hrs",
    overtime: "0 hr",
    status: "late",
  },
  {
    date: "2023-02-22",
    checkIn: "08:00 AM",
    checkOut: "05:30 PM",
    duration: "9 hrs",
    overtime: "1 hr",
    status: "on-time",
  },
  {
    date: "2023-02-23",
    checkIn: "08:30 AM",
    checkOut: "05:00 PM",
    duration: "8.5 hrs",
    overtime: "0 hr",
    status: "on-time",
  },
  {
    date: "2023-02-24",
    checkIn: "08:15 AM",
    checkOut: "04:45 PM",
    duration: "8.5 hrs",
    overtime: "0 hr",
    status: "early-leave",
  },
];

// Summary calculations
const attendanceSummary: AttendanceSummary = {
  totalDays: sampleTableData.length,
  onTime: sampleTableData.filter((r) => r.status === "on-time").length,
  late: sampleTableData.filter((r) => r.status === "late").length,
  earlyLeave: sampleTableData.filter((r) => r.status === "early-leave").length,
  overtime: "3 hrs",
  averageHours: "8.6 hrs/day",
};

export default function OverviewPage(): JSX.Element {
  const theme = useTheme();
  const [viewOption, setViewOption] = useState<"week" | "month" | "year">(
    "week"
  );
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([5, 10, 15]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, sampleTableData.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const handleViewOptionChange = (option: "week" | "month" | "year"): void => {
    setViewOption(option);
    // In a real app, you would update chart data based on selected view
  };

  const getStatusColor = (
    status?: "on-time" | "late" | "early-leave"
  ): string => {
    switch (status) {
      case "on-time":
        return theme.colors.success || "#4CAF50";
      case "late":
        return theme.colors.warning || "#F44336";
      case "early-leave":
        return theme.colors.info || "#FF9800";
      default:
        return theme.colors.foreground;
    }
  };

  const getStatusText = (
    status?: "on-time" | "late" | "early-leave"
  ): string => {
    switch (status) {
      case "on-time":
        return "On Time";
      case "late":
        return "Late";
      case "early-leave":
        return "Early Leave";
      default:
        return "";
    }
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      />

      {/* Header with gradient */}
      <LinearGradient
        colors={[
          theme.colors.primary,
          theme.colors.primary || theme.colors.primary,
        ]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => {
              /* Handle back navigation */
            }}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text variant="titleLarge" style={styles.headerTitle}>
            Work Overview
          </Text>
          <IconButton
            icon="bell-outline"
            size={24}
            iconColor="white"
            onPress={() => {
              /* Handle notifications */
            }}
          />
        </View>
      </LinearGradient>

      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary Cards */}
        <View style={styles.summaryCardsContainer}>
          <Surface
            style={[
              styles.summaryCard,
              { backgroundColor: theme.colors.cards },
            ]}
            elevation={2}
          >
            <MaterialCommunityIcons
              name="calendar-check"
              size={24}
              color={theme.colors.success}
            />
            <Text style={styles.summaryValue}>
              {attendanceSummary.onTime}/{attendanceSummary.totalDays}
            </Text>
            <Text style={styles.summaryLabel}>On Time</Text>
          </Surface>

          <Surface
            style={[
              styles.summaryCard,
              { backgroundColor: theme.colors.cards },
            ]}
            elevation={2}
          >
            <MaterialCommunityIcons
              name="timer-sand"
              size={24}
              color={theme.colors.warning}
            />
            <Text style={styles.summaryValue}>{attendanceSummary.late}</Text>
            <Text style={styles.summaryLabel}>Late Days</Text>
          </Surface>

          <Surface
            style={[
              styles.summaryCard,
              { backgroundColor: theme.colors.cards },
            ]}
            elevation={2}
          >
            <MaterialCommunityIcons
              name="clock-outline"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.summaryValue}>
              {attendanceSummary.averageHours}
            </Text>
            <Text style={styles.summaryLabel}>Avg. Hours</Text>
          </Surface>
        </View>

        {/* Chart Section */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.chartTitle}>
              Work Hours
            </Text>

            {/* View Options */}
            <View style={styles.viewOptions}>
              {(["week", "month", "year"] as const).map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleViewOptionChange(option)}
                  style={[
                    styles.viewOptionButton,
                    viewOption === option && {
                      // backgroundColor: `${theme.colors.primary}15`,
                      borderColor: theme.colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.viewOptionText,
                      viewOption === option && { color: theme.colors.primary },
                    ]}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.chartContainer}>
              <LineChart
                data={sampleChartData}
                width={screenWidth - 80}
                height={220}
                chartConfig={{
                  backgroundColor: theme.colors.cards,
                  backgroundGradientFrom: theme.colors.cards,
                  backgroundGradientTo: theme.colors.cards,
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`,
                  labelColor: (opacity = 1) => theme.colors.foreground,
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: theme.colors.primary,
                  },
                  propsForLabels: {
                    fontSize: 12,
                  },
                }}
                bezier
                style={styles.chart}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Data Table Section */}
        <Card style={styles.tableCard}>
          <Card.Content>
            <View style={styles.tableHeader}>
              <Text variant="titleMedium" style={styles.tableTitle}>
                Attendance History
              </Text>
              <TouchableOpacity>
                <Text style={{ color: theme.colors.primary }}>Export</Text>
              </TouchableOpacity>
            </View>

            <DataTable>
              <DataTable.Header style={styles.dataTableHeader}>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Time</DataTable.Title>
                <DataTable.Title numeric>Hours</DataTable.Title>
                <DataTable.Title numeric>Status</DataTable.Title>
              </DataTable.Header>

              {sampleTableData.slice(from, to).map((item, index) => (
                <DataTable.Row key={index} style={styles.dataTableRow}>
                  <DataTable.Cell>
                    <Text style={styles.dateText}>{item.date}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <View>
                      <Text style={styles.timeText}>{item.checkIn}</Text>
                      <Text style={styles.timeText}>{item.checkOut}</Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={styles.durationText}>{item.duration}</Text>
                    {parseFloat(item.overtime) > 0 && (
                      <Text style={styles.overtimeText}>+{item.overtime}</Text>
                    )}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Chip
                      style={
                        {
                          // backgroundColor: `${getStatusColor(item.status)}15`,
                        }
                      }
                      textStyle={{
                        color: getStatusColor(item.status),
                        fontSize: 12,
                      }}
                    >
                      {getStatusText(item.status)}
                    </Chip>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}

              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(sampleTableData.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${sampleTableData.length}`}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={itemsPerPage}
                onItemsPerPageChange={onItemsPerPageChange}
                showFastPaginationControls
                selectPageDropdownLabel={"Rows per page"}
              />
            </DataTable>
          </Card.Content>
        </Card>

        {/* Actions Section */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => {
              /* Handle request action */
            }}
          >
            <MaterialCommunityIcons
              name="calendar-plus"
              size={22}
              color="white"
            />
            <Text style={styles.actionButtonText}>Request Leave</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.cards },
            ]}
            onPress={() => {
              /* Handle download action */
            }}
          >
            <MaterialCommunityIcons
              name="download"
              size={22}
              color={theme.colors.primary}
            />
            <Text
              style={[styles.actionButtonText, { color: theme.colors.primary }]}
            >
              Download Report
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  headerGradient: {
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "white",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  summaryCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    width: "30%",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
  },
  chartCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  chartTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  viewOptions: {
    flexDirection: "row",
    marginBottom: 10,
  },
  viewOptionButton: {
    marginRight: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  viewOptionText: {
    fontSize: 14,
    color: "#777",
  },
  tableCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  tableTitle: {
    fontWeight: "bold",
  },
  dataTableHeader: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  dataTableRow: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  dateText: {
    fontSize: 14,
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
  durationText: {
    fontSize: 14,
  },
  overtimeText: {
    fontSize: 12,
    color: "#4CAF50",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "48%",
  },
  actionButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "500",
  },
});
