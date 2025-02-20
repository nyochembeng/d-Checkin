import React, { useState } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { DataTable } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { Text } from "../utils/Text";
import { useTheme } from "@/lib/hooks/useTheme";
import { Header } from "../utils/Header";

const screenWidth = Dimensions.get("window").width;

// Sample data for the chart (work hours per day)
const sampleChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"], // previous working days
  datasets: [
    {
      data: [8, 7.5, 9, 8.5, 7], // sample work hours per day
      color: (opacity = 1) => `rgba(12, 34, 255, ${opacity})`, // primary color
      strokeWidth: 2,
    },
  ],
  legend: ["Work Hours"],
};

// Sample data for the table
const sampleTableData = [
  {
    date: "2023-02-20",
    checkIn: "08:30 AM",
    checkOut: "05:00 PM",
    duration: "8.5 hrs",
    overtime: "0.5 hr",
  },
  {
    date: "2023-02-21",
    checkIn: "08:45 AM",
    checkOut: "05:15 PM",
    duration: "8.5 hrs",
    overtime: "0 hr",
  },
  {
    date: "2023-02-22",
    checkIn: "08:00 AM",
    checkOut: "05:30 PM",
    duration: "9 hrs",
    overtime: "1 hr",
  },
  {
    date: "2023-02-23",
    checkIn: "08:30 AM",
    checkOut: "05:00 PM",
    duration: "8.5 hrs",
    overtime: "0 hr",
  },
  {
    date: "2023-02-24",
    checkIn: "08:15 AM",
    checkOut: "05:45 PM",
    duration: "9.5 hrs",
    overtime: "1.5 hr",
  },
];

export default function OverviewPage() {
  const theme = useTheme();
  const [viewOption, setViewOption] = useState<"week" | "month" | "year">(
    "week"
  );
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([5, 10, 15]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, sampleTableData.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  // In a real app, you might allow switching viewOption to update the chart data.
  // For now, the sample data is static.

  return (
    <View>
      {/* Header */}
      <Header title="Overview" showNotification showBack />

      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text
          variant="headlineMedium"
          style={[styles.header, { color: theme.colors.primary }]}
        >
          Work Hours Overview
        </Text>

        {/* Chart Section */}
        <View style={styles.chartContainer}>
          <LineChart
            data={sampleChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.background,
              backgroundGradientFrom: theme.colors.background,
              backgroundGradientTo: theme.colors.background,
              color: (opacity = 1) => theme.colors.primary,
              labelColor: (opacity = 1) => theme.colors.foreground,
              style: {
                borderRadius: 16,
              },
            }}
            style={styles.chart}
          />
        </View>

        {/* View Options - You can add buttons to change viewOption if desired */}
        <View style={styles.viewOptions}>
          <Text
            style={[
              styles.viewOptionText,
              viewOption === "week" && { color: theme.colors.primary },
            ]}
          >
            Week
          </Text>
          <Text
            style={[
              styles.viewOptionText,
              viewOption === "month" && { color: theme.colors.primary },
            ]}
          >
            Month
          </Text>
          <Text
            style={[
              styles.viewOptionText,
              viewOption === "year" && { color: theme.colors.primary },
            ]}
          >
            Year
          </Text>
        </View>

        {/* Data Table Section */}
        <Text
          variant="titleLarge"
          style={[styles.tableHeader, { color: theme.colors.primary }]}
        >
          Daily Summary
        </Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Date</DataTable.Title>
            <DataTable.Title numeric>Check-In</DataTable.Title>
            <DataTable.Title numeric>Check-Out</DataTable.Title>
            <DataTable.Title numeric>Duration</DataTable.Title>
            <DataTable.Title numeric>Overtime</DataTable.Title>
          </DataTable.Header>

          {sampleTableData.slice(from, to).map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{item.date}</DataTable.Cell>
              <DataTable.Cell numeric>{item.checkIn}</DataTable.Cell>
              <DataTable.Cell numeric>{item.checkOut}</DataTable.Cell>
              <DataTable.Cell numeric>{item.duration}</DataTable.Cell>
              <DataTable.Cell numeric>{item.overtime}</DataTable.Cell>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
  },
  viewOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  viewOptionText: {
    fontSize: 16,
    color: "#777",
  },
  tableHeader: {
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold",
  },
});
