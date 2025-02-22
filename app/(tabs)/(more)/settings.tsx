import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { List, Switch } from "react-native-paper";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Header } from "@/components/utils/Header";

export default function SettingsPage() {
  const theme = useTheme();

  // Sample state for settings toggles
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <Header title="Settings" showBack showNotification />

      {/* General Settings */}
      <List.Section>
        <List.Subheader
          style={[styles.subheader, { color: theme.colors.primary }]}
        >
          General
        </List.Subheader>
        <List.Item
          title="Dark Mode"
          right={() => (
            <Switch
              value={darkMode}
              onValueChange={(value) => setDarkMode(value)}
              color={theme.colors.primary}
            />
          )}
          onPress={() => setDarkMode(!darkMode)}
        />
        <List.Item
          title="Auto Update"
          right={() => (
            <Switch
              value={autoUpdate}
              onValueChange={(value) => setAutoUpdate(value)}
              color={theme.colors.primary}
            />
          )}
          onPress={() => setAutoUpdate(!autoUpdate)}
        />
        <List.Item
          title="Language"
          description="English"
          onPress={() => router.push("/")}
          right={() => (
            <List.Icon
              icon="chevron-right"
              color={theme.colors.mutedForeground}
            />
          )}
        />
      </List.Section>

      {/* Notifications Settings */}
      <List.Section>
        <List.Subheader
          style={[styles.subheader, { color: theme.colors.primary }]}
        >
          Notifications
        </List.Subheader>
        <List.Item
          title="Push Notifications"
          right={() => (
            <Switch
              value={pushNotifications}
              onValueChange={(value) => setPushNotifications(value)}
              color={theme.colors.primary}
            />
          )}
          onPress={() => setPushNotifications(!pushNotifications)}
        />
        <List.Item
          title="Email Notifications"
          right={() => (
            <Switch
              value={emailNotifications}
              onValueChange={(value) => setEmailNotifications(value)}
              color={theme.colors.primary}
            />
          )}
          onPress={() => setEmailNotifications(!emailNotifications)}
        />
      </List.Section>

      {/* Account & Security */}
      <List.Section>
        <List.Subheader
          style={[styles.subheader, { color: theme.colors.primary }]}
        >
          Account & Security
        </List.Subheader>
        <List.Item
          title="Account Settings"
          onPress={() => router.push("/")}
          right={() => (
            <List.Icon
              icon="chevron-right"
              color={theme.colors.mutedForeground}
            />
          )}
        />
        <List.Item
          title="Security"
          onPress={() => router.push("/")}
          right={() => (
            <List.Icon
              icon="chevron-right"
              color={theme.colors.mutedForeground}
            />
          )}
        />
      </List.Section>

      {/* Others Settings */}
      <List.Section>
        <List.Subheader
          style={[styles.subheader, { color: theme.colors.primary }]}
        >
          Others
        </List.Subheader>
        <List.Item
          title="Privacy Policy"
          onPress={() => router.push("/")}
          right={() => (
            <List.Icon
              icon="chevron-right"
              color={theme.colors.mutedForeground}
            />
          )}
        />
        <List.Item
          title="Terms & Conditions"
          onPress={() => router.push("/")}
          right={() => (
            <List.Icon
              icon="chevron-right"
              color={theme.colors.mutedForeground}
            />
          )}
        />
        <List.Item
          title="About"
          onPress={() => router.push("/about")}
          right={() => (
            <List.Icon
              icon="chevron-right"
              color={theme.colors.mutedForeground}
            />
          )}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subheader: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
