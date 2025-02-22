import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card } from "react-native-paper";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "@/components/utils/Text";
import { Header } from "@/components/utils/Header";

// Sample data for upcoming sessions
const sampleSessions = [
  {
    id: "1",
    courseTitle: "Math 101",
    time: "Mon, 9:00 AM - 10:30 AM",
    period: "Morning",
    deadline: "8:50 AM",
  },
  {
    id: "2",
    courseTitle: "Physics 202",
    time: "Tue, 11:00 AM - 12:30 PM",
    period: "Late Morning",
    deadline: "10:50 AM",
  },
  {
    id: "3",
    courseTitle: "Chemistry 303",
    time: "Wed, 2:00 PM - 3:30 PM",
    period: "Afternoon",
    deadline: "1:50 PM",
  },
  {
    id: "4",
    courseTitle: "History 104",
    time: "Thu, 1:00 PM - 2:30 PM",
    period: "Afternoon",
    deadline: "12:50 PM",
  },
];

export default function SessionsPage() {
  const theme = useTheme();

  // Navigate to the session detail page when a session is pressed.
  const handleSessionPress = (sessionId: string) => {
    // router.push(`/session/${sessionId}`);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Upcoming Sessions" showBack showNotification />

      <View style={styles.minContainer}>
        <FlatList
          data={sampleSessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSessionPress(item.id)}>
              <Card
                style={[styles.card, { backgroundColor: theme.colors.cards }]}
              >
                <Card.Title
                  title={item.courseTitle}
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
                {/* Optionally, add Card.Actions if needed */}
              </Card>
            </TouchableOpacity>
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
  minContainer: {
    flex: 1,
    padding: 16,
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
