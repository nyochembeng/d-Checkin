import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { Header } from "../utils/Header";
import { Text } from "../utils/Text";
import { useTheme } from "@/lib/hooks/useTheme";

// Sample sort options for filtering upcoming events
const SORT_OPTIONS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "year", label: "This year" },
];

// Sample events data (replace with your actual data)
const sampleEvents = [
  {
    id: "1",
    date: "2023-03-20",
    title: "Team Meeting",
    checkIn: "09:00 AM",
    checkOut: "10:00 AM",
    duration: "1 hr",
    overtime: "0 hr",
  },
  {
    id: "2",
    date: "2023-03-21",
    title: "Client Presentation",
    checkIn: "11:00 AM",
    checkOut: "12:30 PM",
    duration: "1.5 hrs",
    overtime: "0.5 hr",
  },
  {
    id: "3",
    date: "2023-03-22",
    title: "Project Workshop",
    checkIn: "02:00 PM",
    checkOut: "05:00 PM",
    duration: "3 hrs",
    overtime: "0 hr",
  },
  {
    id: "4",
    date: "2023-03-23",
    title: "Sales Meeting",
    checkIn: "10:00 AM",
    checkOut: "11:00 AM",
    duration: "1 hr",
    overtime: "0 hr",
  },
];

// Create marked dates object for react-native-calendars based on sample events
const getMarkedDates = (events: typeof sampleEvents) => {
  const marks: { [date: string]: any } = {};
  events.forEach((event) => {
    // Mark the date with a dot (you can customize dotColor and selected style)
    marks[event.date] = { marked: true, dotColor: "blue" };
  });
  return marks;
};

export default function CalendarPage() {
  const theme = useTheme();
  const [sortOption, setSortOption] = useState("year"); // Default view: This year
  const [events, setEvents] = useState(sampleEvents); // using sample events for demonstration
  const [loading, setLoading] = useState(false);

  // Filter events based on selected period (today, week, month, year)
  const filteredEvents = useMemo(() => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (sortOption) {
      case "today":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case "week":
        const dayOfWeek = now.getDay();
        start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - dayOfWeek
        );
        end = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - dayOfWeek + 7
        );
        break;
      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case "year":
      default:
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear() + 1, 0, 1);
        break;
    }

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= start && eventDate < end;
    });
  }, [events, sortOption]);

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      {/* Header */}
      <Header title="Calendar" showBack showNotification />

      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Month View Calendar using react-native-calendars */}
        <RNCalendar
          // Provide marked dates from the sample events
          markedDates={getMarkedDates(events)}
          theme={{
            backgroundColor: theme.colors.background,
            calendarBackground: theme.colors.background,
            textSectionTitleColor: theme.colors.primary,
            selectedDayBackgroundColor: theme.colors.primary,
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

        {/* Upcoming Events & Sorting */}
        <View style={styles.eventsContainer}>
          <Text
            variant="titleLarge"
            style={[styles.sectionTitle, { color: theme.colors.primary }]}
          >
            Upcoming Events
          </Text>

          {/* Sorting Options */}
          <View style={styles.sortContainer}>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setSortOption(option.key)}
              >
                <Text
                  style={[
                    styles.sortOption,
                    sortOption === option.key && {
                      color: theme.colors.primary,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Events List */}
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.eventItem,
                  { borderColor: theme.colors.mutedForeground },
                ]}
              >
                <Text
                  style={[
                    styles.eventTitle,
                    { color: theme.colors.foreground },
                  ]}
                  numberOfLines={1}
                >
                  {item.title || "No Title"}
                </Text>
                <Text
                  style={[
                    styles.eventTime,
                    { color: theme.colors.mutedForeground },
                  ]}
                >
                  {item.date} | Check-In: {item.checkIn} | Check-Out:{" "}
                  {item.checkOut}
                </Text>
                <Text
                  style={[
                    styles.eventTime,
                    { color: theme.colors.mutedForeground },
                  ]}
                >
                  Duration: {item.duration} | Overtime: {item.overtime}
                </Text>
              </View>
            )}
          />
        </View>

        {/* You can add additional buttons or actions here if needed */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  calendar: {
    borderRadius: 8,
    marginBottom: 20,
  },
  eventsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    textAlign: "center",
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  sortOption: {
    marginHorizontal: 8,
    fontSize: 14,
    color: "#777",
  },
  eventItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  eventTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
  },
});
