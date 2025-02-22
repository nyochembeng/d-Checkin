import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Button, Card } from "react-native-paper";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "../utils/Text";

export default function StudentPage() {
  const theme = useTheme();

  // Sample data for student dashboard cards
  const overviewData = { lastAttendance: "Present on 2023-03-20" };
  const sessionsData = { nextSession: "Math Class at 10:00 AM" };
  const notificationsData = { latest: "School assembly at 2:00 PM" };
  const permissionsData = { latest: "Field trip permission pending" };

  const handleCardPress = (route: string) => {
    // router.push(route);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <Text
          variant="headlineMedium"
          style={[styles.greeting, { color: theme.colors.primary }]}
        >
          Welcome, Jane Doe!
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.message, { color: theme.colors.foreground }]}
        >
          Have a great day at school!
        </Text>
      </View>

      {/* Cards Grid */}
      <View style={styles.cardsContainer}>
        {/* Sessions Card */}
        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={() => handleCardPress("/sessions")}
        >
          <Card style={[styles.card, { backgroundColor: theme.colors.cards }]}>
            <Card.Title
              title="Sessions"
              titleStyle={{ color: theme.colors.primary }}
            />
            <Card.Content>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.foreground }}
              >
                {sessionsData.nextSession || "No upcoming sessions."}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleCardPress("/sessions")}>
                Checkout
              </Button>
            </Card.Actions>
          </Card>
        </TouchableOpacity>

        {/* Overview Card */}
        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={() => handleCardPress("/overview")}
        >
          <Card style={[styles.card, { backgroundColor: theme.colors.cards }]}>
            <Card.Title
              title="Overview"
              titleStyle={{ color: theme.colors.primary }}
            />
            <Card.Content>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.foreground }}
              >
                {overviewData.lastAttendance || "No attendance records."}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleCardPress("/overview")}>View</Button>
            </Card.Actions>
          </Card>
        </TouchableOpacity>

        {/* Notifications Card */}
        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={() => handleCardPress("/notifications")}
        >
          <Card style={[styles.card, { backgroundColor: theme.colors.cards }]}>
            <Card.Title
              title="Notifications"
              titleStyle={{ color: theme.colors.primary }}
            />
            <Card.Content>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.foreground }}
              >
                {notificationsData.latest || "No notifications."}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleCardPress("/notifications")}>
                Read
              </Button>
            </Card.Actions>
          </Card>
        </TouchableOpacity>

        {/* Permissions Card */}
        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={() => handleCardPress("/permissions")}
        >
          <Card style={[styles.card, { backgroundColor: theme.colors.cards }]}>
            <Card.Title
              title="Permissions"
              titleStyle={{ color: theme.colors.primary }}
            />
            <Card.Content>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.foreground }}
              >
                {permissionsData.latest || "No permission updates."}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleCardPress("/permissions")}>
                Checkout
              </Button>
            </Card.Actions>
          </Card>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  greetingContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  greeting: {
    fontWeight: "bold",
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginTop: 4,
  },
  checkButton: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    width: "50%",
    alignSelf: "center",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  cardWrapper: {
    width: "100%",
    marginVertical: 8,
  },
  card: {
    elevation: 3,
    borderRadius: 8,
  },
});
