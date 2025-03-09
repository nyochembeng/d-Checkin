import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { List, Button, Divider, Text } from "react-native-paper";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Header } from "@/components/utils/Header";

export default function MorePage() {
  const theme = useTheme();

  const menuItems = [
    {
      title: "Permissions",
      route: "/permissions",
      icon: "calendar-check-outline",
      description: "View and manage leave requests",
    },
    {
      title: "Notifications",
      route: "/notifications",
      icon: "bell-outline",
      description: "Check your alerts and messages",
    },
    {
      title: "Settings",
      route: "/settings",
      icon: "cog-outline",
      description: "Configure app preferences",
    },
    {
      title: "Report an Issue",
      route: "/report-issue",
      icon: "alert-circle-outline",
      description: "Submit app problems or feedback",
    },
    {
      title: "About",
      route: "/about",
      icon: "information-outline",
      description: "Learn more about this application",
    },
  ];

  const handleLogout = () => {
    // Perform any logout logic here (clear tokens, update state, etc.)
    // Then navigate to the login page
    router.replace("/auth/login");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <Header title="More" showBack showNotification />

      <ScrollView style={styles.scrollContainer}>
        {/* Section Title */}
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          More Options
        </Text>

        <View style={[styles.card, { backgroundColor: theme.colors.cards }]}>
          {/* Render menu items */}
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <List.Item
                title={item.title}
                description={item.description}
                titleStyle={{
                  color: theme.colors.foreground,
                  fontWeight: "500",
                }}
                descriptionStyle={{ color: theme.colors.mutedForeground }}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={item.icon}
                    color={theme.colors.primary}
                  />
                )}
                right={(props) => (
                  <List.Icon
                    {...props}
                    icon="chevron-right"
                    color={theme.colors.mutedForeground}
                  />
                )}
                onPress={() => router.push(item.route as any)}
                style={styles.listItem}
              />
              {index < menuItems.length - 1 && (
                <Divider style={{ marginLeft: 54 }} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Log Out Button */}
        <Button
          mode="contained"
          onPress={handleLogout}
          style={[styles.logoutButton, { backgroundColor: theme.colors.warning }]}
          labelStyle={{ color: "white", fontSize: 16 }}
          icon="logout"
        >
          Log Out
        </Button>

        <View style={styles.versionContainer}>
          <Text
            style={{ color: theme.colors.mutedForeground, textAlign: "center" }}
          >
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 8,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  listItem: {
    paddingVertical: 12,
  },
  logoutButton: {
    marginTop: 24,
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 6,
  },
  versionContainer: {
    marginTop: 24,
    marginBottom: 40,
    alignItems: "center",
  },
});
