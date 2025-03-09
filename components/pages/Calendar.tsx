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
  Dimensions,
} from "react-native";
import { Calendar as RNCalendar, DateData } from "react-native-calendars";
import { Header } from "../utils/Header";
import { Text } from "../utils/Text";
import { useTheme } from "@/lib/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo/vector-icons if not already

// TypeScript interfaces
interface EventItem {
  id: string;
  date: string;
  title: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  overtime: string;
  location?: string;
  status?: "pending" | "completed" | "missed";
}

interface SortOption {
  key: "today" | "week" | "month" | "year";
  label: string;
}

// Sort options for filtering upcoming events
const SORT_OPTIONS: SortOption[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "year", label: "This year" },
];

// Sample events data (replace with your actual data)
const sampleEvents: EventItem[] = [
  {
    id: "1",
    date: "2023-03-20",
    title: "Team Meeting",
    checkIn: "09:00 AM",
    checkOut: "10:00 AM",
    duration: "1 hr",
    overtime: "0 hr",
    location: "Conference Room A",
    status: "completed",
  },
  {
    id: "2",
    date: "2023-03-21",
    title: "Client Presentation",
    checkIn: "11:00 AM",
    checkOut: "12:30 PM",
    duration: "1.5 hrs",
    overtime: "0.5 hr",
    location: "Meeting Room 3",
    status: "completed",
  },
  {
    id: "3",
    date: "2023-03-22",
    title: "Project Workshop",
    checkIn: "02:00 PM",
    checkOut: "05:00 PM",
    duration: "3 hrs",
    overtime: "0 hr",
    location: "Main Hall",
    status: "pending",
  },
  {
    id: "4",
    date: "2023-03-23",
    title: "Sales Meeting",
    checkIn: "10:00 AM",
    checkOut: "11:00 AM",
    duration: "1 hr",
    overtime: "0 hr",
    location: "Virtual Room",
    status: "pending",
  },
];

// Create marked dates object for react-native-calendars based on events
const getMarkedDates = (events: EventItem[]) => {
  const marks: { [date: string]: any } = {};

  const today = new Date().toISOString().split("T")[0];
  marks[today] = { selected: true, selectedColor: "#4285F4" };

  events.forEach((event) => {
    if (marks[event.date]) {
      // If date is already marked (including today), add dot but preserve selected state
      marks[event.date] = {
        ...marks[event.date],
        marked: true,
        dots: [
          ...(marks[event.date].dots || []),
          { color: event.status === "completed" ? "#34A853" : "#FBBC05" },
        ],
      };
    } else {
      // For dates with events but not today
      marks[event.date] = {
        marked: true,
        dotColor: event.status === "completed" ? "#34A853" : "#FBBC05",
      };
    }
  });
  return marks;
};

export default function CalendarPage() {
  const theme = useTheme();
  const [sortOption, setSortOption] = useState<SortOption["key"]>("week"); // Default view: This week
  const [events, setEvents] = useState<EventItem[]>(sampleEvents);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

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

    // First filter by date range
    const dateFilteredEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= start && eventDate < end;
    });

    // Then filter by selected date if needed
    return selectedDate
      ? dateFilteredEvents.filter((event) => event.date === selectedDate)
      : dateFilteredEvents;
  }, [events, sortOption, selectedDate]);

  const handleDateSelect = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

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
    <View
      style={[
        styles.mainContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {/* Header */}
      <Header title="Calendar" showBack showNotification />

      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Month View Calendar using react-native-calendars */}
          <View style={styles.calendarCard}>
            <RNCalendar
              markedDates={getMarkedDates(events)}
              onDayPress={handleDateSelect}
              theme={{
                backgroundColor: theme.colors.cards,
                calendarBackground: theme.colors.cards,
                textSectionTitleColor: theme.colors.primary,
                selectedDayBackgroundColor: theme.colors.primary,
                todayTextColor: theme.colors.primary,
                dayTextColor: theme.colors.foreground,
                textDisabledColor: theme.colors.mutedForeground,
                dotColor: theme.colors.primary,
                selectedDotColor: "#ffffff",
                arrowColor: theme.colors.primary,
                monthTextColor: theme.colors.primary,
                indicatorColor: theme.colors.primary,
                textDayFontWeight: "400",
                textMonthFontWeight: "600",
                textDayHeaderFontWeight: "500",
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
              style={styles.calendar}
            />
          </View>

          {/* Sorting Options */}
          <View style={styles.sortContainer}>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setSortOption(option.key)}
                style={[
                  styles.sortOptionButton,
                  sortOption === option.key && {
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortOption === option.key && {
                      color: "#FFF",
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Upcoming Events */}
          <View style={styles.eventsContainer}>
            <View style={styles.eventHeaderRow}>
              <Text
                variant="titleMedium"
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.foreground },
                ]}
              >
                {selectedDate ? (
                  <>
                    Events for{" "}
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    <TouchableOpacity
                      onPress={() => setSelectedDate("")}
                      style={styles.clearDateButton}
                    >
                      <Text
                        style={{ color: theme.colors.primary, marginLeft: 8 }}
                      >
                        Clear
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  `Upcoming Events (${filteredEvents.length})`
                )}
              </Text>
            </View>

            {/* Events List */}
            {filteredEvents.length > 0 ? (
              <FlatList
                data={filteredEvents}
                keyExtractor={(item) => item.id}
                scrollEnabled={false} // Disable scroll as parent ScrollView handles it
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      // Handle event item tap
                      Alert.alert("Event Details", `Details for ${item.title}`);
                    }}
                  >
                    <View
                      style={[
                        styles.eventItem,
                        {
                          backgroundColor: theme.colors.cards,
                          borderLeftColor:
                            item.status === "completed"
                              ? "#34A853"
                              : item.status === "missed"
                              ? "#EA4335"
                              : "#FBBC05",
                        },
                      ]}
                    >
                      <View style={styles.eventHeader}>
                        <Text
                          style={[
                            styles.eventTitle,
                            { color: theme.colors.foreground },
                          ]}
                          numberOfLines={1}
                        >
                          {item.title || "No Title"}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor:
                                item.status === "completed"
                                  ? "#E8F5E9"
                                  : item.status === "missed"
                                  ? "#FFEBEE"
                                  : "#FFF8E1",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              {
                                color:
                                  item.status === "completed"
                                    ? "#34A853"
                                    : item.status === "missed"
                                    ? "#EA4335"
                                    : "#FBBC05",
                              },
                            ]}
                          >
                            {item.status === "completed"
                              ? "Completed"
                              : item.status === "missed"
                              ? "Missed"
                              : "Upcoming"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.eventDetails}>
                        <View style={styles.eventMetaRow}>
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color={theme.colors.mutedForeground}
                          />
                          <Text
                            style={[
                              styles.eventMeta,
                              { color: theme.colors.mutedForeground },
                            ]}
                          >
                            {item.checkIn} - {item.checkOut} ({item.duration})
                          </Text>
                        </View>

                        <View style={styles.eventMetaRow}>
                          <Ionicons
                            name="location-outline"
                            size={16}
                            color={theme.colors.mutedForeground}
                          />
                          <Text
                            style={[
                              styles.eventMeta,
                              { color: theme.colors.mutedForeground },
                            ]}
                          >
                            {item.location || "No location specified"}
                          </Text>
                        </View>

                        {item.overtime !== "0 hr" && (
                          <View style={styles.eventMetaRow}>
                            <Ionicons
                              name="hourglass-outline"
                              size={16}
                              color={theme.colors.mutedForeground}
                            />
                            <Text
                              style={[
                                styles.eventMeta,
                                { color: theme.colors.mutedForeground },
                              ]}
                            >
                              Overtime: {item.overtime}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.eventsList}
              />
            ) : (
              <View style={styles.noEventsContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={48}
                  color={theme.colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.noEventsText,
                    { color: theme.colors.mutedForeground },
                  ]}
                >
                  No events scheduled for this period
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  calendarCard: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  calendar: {
    borderRadius: 12,
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  sortOptionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 8,
    marginBottom: 8,
  },
  sortOptionText: {
    fontSize: 14,
    color: "#666",
  },
  eventsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  eventHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: "600",
  },
  clearDateButton: {
    paddingHorizontal: 4,
  },
  eventsList: {
    paddingBottom: 16,
  },
  eventItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  eventDetails: {
    marginTop: 4,
  },
  eventMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  eventMeta: {
    fontSize: 14,
    marginLeft: 4,
  },
  noEventsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  noEventsText: {
    marginTop: 12,
    textAlign: "center",
  },
});
