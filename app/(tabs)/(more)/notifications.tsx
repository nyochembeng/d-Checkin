import { Header } from "@/components/utils/Header";
import { useTheme } from "@/lib/hooks/useTheme";
import React, { useState } from "react";
import { StyleSheet, FlatList, Alert, ScrollView } from "react-native";
import { List, IconButton } from "react-native-paper";

// Sample notifications data
const sampleNotifications = [
  {
    id: "1",
    message: "Your permission request has been approved.",
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  },
  {
    id: "4",
    message: "New message from HR regarding benefits.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    id: "2",
    message: "New announcement: Office will be closed tomorrow.",
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: "3",
    message: "Reminder: Update your profile information.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
];

// Helper function to get relative time string
const getRelativeTime = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime(); // in milliseconds
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (60 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));

  if (seconds < 10) {
    return "just now";
  } else if (seconds < 60) {
    return `${seconds} sec ago`;
  } else if (minutes < 60) {
    return `${minutes} min ago`;
  } else if (hours < 24) {
    return `${hours} hr ago`;
  } else if (days === 1) {
    return "yesterday";
  } else {
    return timestamp.toLocaleDateString();
  }
};

export default function NotificationsPage() {
  const theme = useTheme();
  const [notifications, setNotifications] = useState(sampleNotifications);

  const handleDelete = (notificationId: string) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () =>
            setNotifications((prev) =>
              prev.filter((notification) => notification.id !== notificationId)
            ),
          style: "destructive",
        },
      ]
    );
  };

  const renderNotificationItem = ({
    item,
  }: {
    item: (typeof sampleNotifications)[0];
  }) => {
    return (
      <List.Item
        title={item.message}
        description={getRelativeTime(item.timestamp)}
        titleNumberOfLines={2}
        descriptionStyle={{ color: theme.colors.mutedForeground }}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
            iconColor={theme.colors.mutedForeground}
            onPress={() => handleDelete(item.id)}
          />
        )}
        style={[styles.listItem, { backgroundColor: theme.colors.cards }]}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Header title="Notifications" showBack />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContainer}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
  },
});
