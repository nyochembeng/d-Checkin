import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Divider } from "react-native-paper";
import { Header } from "@/components/utils/Header";
import { useTheme } from "@/lib/hooks/useTheme";

export default function AboutPage() {
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="About" showBack />

      <View style={styles.content}>
        <Text
          variant="headlineMedium"
          style={[styles.title, { color: theme.colors.primary }]}
        >
          d-Checkin
        </Text>

        <Text
          variant="bodyLarge"
          style={[styles.version, { color: theme.colors.foreground }]}
        >
          Version 1.0.0
        </Text>

        <Divider style={styles.divider} />

        <Text
          variant="bodyMedium"
          style={[styles.description, { color: theme.colors.foreground }]}
        >
          Welcome to d-Checkin! This app is designed to streamline your daily
          activities, from biometric check-ins and attendance management to
          issue reporting and permissions.
          {"\n\n"}
          Our goal is to provide a seamless and efficient experience for both
          students and employees. We continually work to improve our app with
          new features and optimizations.
          {"\n\n"}
          If you have any questions or feedback, please feel free to reach out
          via our support channels.
        </Text>

        <Divider style={styles.divider} />

        <Text
          variant="bodySmall"
          style={[styles.credits, { color: theme.colors.mutedForeground }]}
        >
          © {new Date().getFullYear()} d-Checkin. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  version: {
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    padding: 8,
  },
  divider: {
    marginVertical: 12,
  },
  credits: {
    textAlign: "center",
    marginTop: 10,
  },
});
