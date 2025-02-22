import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import { Card } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "@/components/utils/Text";
import { Header } from "@/components/utils/Header";

// Sample data for sessions of a particular course (based on session id)
const sampleCourseSessions = [
  {
    id: "1",
    date: "2023-03-20",
    time: "09:00 AM - 10:30 AM",
    period: "Morning",
    deadline: "08:50 AM",
  },
  {
    id: "2",
    date: "2023-03-22",
    time: "09:00 AM - 10:30 AM",
    period: "Morning",
    deadline: "08:50 AM",
  },
  {
    id: "3",
    date: "2023-03-24",
    time: "09:00 AM - 10:30 AM",
    period: "Morning",
    deadline: "08:50 AM",
  },
];

// Helper to generate marked dates for react-native-calendars
const getMarkedDates = (sessions: typeof sampleCourseSessions) => {
  const marks: { [date: string]: any } = {};
  sessions.forEach((session) => {
    marks[session.date] = {
      selected: true,
      marked: true,
      selectedColor: "#0C22FF", // use your theme primary or custom color
    };
  });
  return marks;
};

export default function SessionDetail() {
  const theme = useTheme();
  // Retrieve session id from URL parameters if needed
  const { id } = useLocalSearchParams<{ id: string }>();

  // For demonstration, we're using sample data directly.
  // In a real app, you'd fetch sessions based on the course (or session id).
  const [sessions, setSessions] = useState(sampleCourseSessions);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <Header title={`Course Name`} showBack showNotification />

      <View style={styles.miniContainer}>
        {/* Calendar highlighting session dates */}
        <Calendar
          markedDates={getMarkedDates(sessions)}
          theme={{
            backgroundColor: theme.colors.background,
            calendarBackground: theme.colors.background,
            textSectionTitleColor: theme.colors.primary,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: "#ffffff",
            todayTextColor: theme.colors.primary,
            dayTextColor: theme.colors.foreground,
            textDisabledColor: "#d9e1e8",
            dotColor: theme.colors.primary,
            selectedDotColor: "#ffffff",
            arrowColor: theme.colors.primary,
            monthTextColor: theme.colors.primary,
          }}
          style={styles.calendar}
        />

        {/* Upcoming Sessions List */}
        <Text
          variant="titleLarge"
          style={[styles.subHeader, { color: theme.colors.primary }]}
        >
          Upcoming Sessions
        </Text>
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              style={[styles.card, { backgroundColor: theme.colors.cards }]}
            >
              <Card.Title
                title={`Session on ${item.date}`}
                titleStyle={{ color: theme.colors.primary }}
              />
              <Card.Content>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.foreground }}
                >
                  {item.time}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.mutedForeground }}
                >
                  Deadline: {item.deadline} | {item.period}
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
  calendar: {
    borderRadius: 8,
    marginBottom: 20,
  },
  subHeader: {
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginVertical: 8,
    elevation: 3,
    borderRadius: 8,
  },
});
