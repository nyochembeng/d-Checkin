import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
} from "react-native";
import { Card } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "@/components/utils/Text";
import { Header } from "@/components/utils/Header";

const screenWidth = Dimensions.get("window").width;

// Sample data for attendance overview (pie chart)
const sampleAttendanceOverview = [
  {
    name: "Present",
    count: 20,
    color: "#4CAF50",
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  },
  {
    name: "Absent",
    count: 5,
    color: "#F44336",
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  },
  {
    name: "Late",
    count: 3,
    color: "#FFC107",
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  },
  {
    name: "Excused",
    count: 2,
    color: "#2196F3",
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  },
];

// Sample detailed attendance records for the course
const sampleRecords = [
  { id: "1", date: "2023-03-20", checkIn: "08:30 AM", status: "Present" },
  { id: "2", date: "2023-03-21", checkIn: "09:05 AM", status: "Late" },
  { id: "3", date: "2023-03-22", checkIn: "-", status: "Absent" },
  { id: "4", date: "2023-03-23", checkIn: "08:28 AM", status: "Present" },
  { id: "5", date: "2023-03-24", checkIn: "08:45 AM", status: "Excused" },
];

export default function HistoryDetailsPage() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  // In a real app, use the id to fetch course-specific attendance data.
  const [attendanceOverview] = useState(sampleAttendanceOverview);
  const [records] = useState(sampleRecords);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title={`Course Name`} showBack showNotification />

      <View style={styles.miniContainer}>
        <PieChart
          data={attendanceOverview}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: theme.colors.background,
            backgroundGradientFrom: theme.colors.background,
            backgroundGradientTo: theme.colors.background,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => theme.colors.foreground,
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />

        <Text
          variant="titleLarge"
          style={[
            styles.subHeader,
            { color: theme.colors.primary, marginTop: 20 },
          ]}
        >
          Detailed Overview
        </Text>
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              style={[styles.card, { backgroundColor: theme.colors.cards }]}
            >
              <Card.Title
                title={item.date}
                titleStyle={{ color: theme.colors.primary }}
              />
              <Card.Content>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.foreground }}
                >
                  Check-In: {item.checkIn}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.mutedForeground }}
                >
                  Status: {item.status}
                </Text>
              </Card.Content>
            </Card>
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  miniContainer: {
    flex: 1,
    padding: 16,
  },
  subHeader: {
    marginBottom: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginVertical: 8,
    elevation: 2,
    borderRadius: 8,
  },
});
