import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { List, Button } from "react-native-paper";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Header } from "@/components/utils/Header";

export default function MorePage() {
  const theme = useTheme();
  const menuItems = [
    { title: "Permissions", route: "/permissions" },
    { title: "Notifications", route: "/notifications" },
    { title: "Settings", route: "/settings" },
    { title: "Report an Issue", route: "/report-issue" },
    { title: "About", route: "/about" },
  ];

  const handleLogout = () => {
    // Perform any logout logic here (clear tokens, update state, etc.)
    // Then navigate to the login page
    router.replace("/auth/login");
  };

  return (
    <ScrollView style={[styles.container]}>
      {/* Header */}
      <Header title="More" showBack showNotification />

      {/* Render menu items */}
      {menuItems.map((item, index) => (
        <List.Item
          key={index}
          title={item.title}
          titleStyle={{ color: theme.colors.foreground }}
          left={(props) => (
            <List.Icon
              {...props}
              icon="chevron-right"
              color={theme.colors.mutedForeground}
            />
          )}
          onPress={() => router.push(item.route as any)}
          style={styles.listItem}
        />
      ))}

      {/* Log Out Button */}
      <Button
        mode="outlined"
        onPress={handleLogout}
        style={[styles.logoutButton, { borderColor: theme.colors.primary }]}
        color={theme.colors.primary}
      >
        Log Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    marginVertical: 5,
  },
  logoutButton: {
    marginTop: 20,
    marginHorizontal: 20,
  },
});
