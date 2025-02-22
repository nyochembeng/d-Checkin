import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Button, Card } from "react-native-paper";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "../utils/Text";

export default function EmployeePage() {
  const theme = useTheme();

  // Sample state to indicate whether the employee is checked in
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Sample data for the cards. In a real app, fetch these from your API/store.
  const overviewData = { lastRecord: "Checked out at 05:00 PM" }; // or "No record" if empty
  const sessionsData = { calendarUpdate: "Leave approved!" };
  const notificationsData = { latest: "3 new notifications" };
  const permissionsData = { latest: "Leave request approved" };

  const handleCheckAction = () => {
    // Navigate to biometric authentication page.
    // Pass an action based on current status.
    const action = isCheckedIn ? "checkout" : "checkin";
    router.push(`/auth/biometric-authentication?action=${action}`);
  };

  const handleCardPress = (route: string) => {
    // router.push(route);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Greeting */}
      <View style={styles.greetingContainer}>
        <Text
          variant="headlineMedium"
          style={[styles.greeting, { color: theme.colors.primary }]}
        >
          Welcome, John Doe!
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.message, { color: theme.colors.foreground }]}
        >
          {isCheckedIn
            ? "You are hard working."
            : "Have a productive day at work."}
        </Text>
      </View>

      {/* Check-In/Out Button */}
      <Button
        mode="contained"
        onPress={handleCheckAction}
        style={[
          styles.checkButton,
          // {
          //   backgroundColor: isCheckedIn
          //     ? theme.colors.danger
          //     : theme.colors.success,
          // },
        ]}
      >
        {isCheckedIn ? "Check Out" : "Check In"}
      </Button>

      {/* Grid Cards */}
      <View style={styles.cardsContainer}>
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
                {overviewData.lastRecord || "No records yet."}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleCardPress("/overview")}>View</Button>
            </Card.Actions>
          </Card>
        </TouchableOpacity>

        {/* Calendar Card */}
        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={() => handleCardPress("/sessions")}
        >
          <Card style={[styles.card, { backgroundColor: theme.colors.cards }]}>
            <Card.Title
              title="Calendar"
              titleStyle={{ color: theme.colors.primary }}
            />
            <Card.Content>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.foreground }}
              >
                {sessionsData.calendarUpdate || "No updates available."}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleCardPress("/sessions")}>
                Checkout
              </Button>
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
                {permissionsData.latest || "No updates available."}
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
