import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { router, usePathname } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "./Text";

type HeaderProps = {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showNotification = false,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.left}>
        {usePathname() === "/home" ? (
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
        ) : (
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => router.back()}
          />
        )}
      </View>
      <View style={styles.center}>
        <Text
          variant="headlineSmall"
          style={[styles.title, { color: theme.colors.primary }]}
        >
          {title}
        </Text>
      </View>
      <View style={styles.right}>
        {showNotification && (
          <IconButton
            icon="bell"
            size={24}
            onPress={() => router.push("/notifications")}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  left: {
    flex: 1,
    alignItems: "flex-start",
  },
  dateBadge: {
    backgroundColor: "#eee",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  dateBadgeText: {
    fontSize: 12,
    color: "#333",
  },
  center: {
    flex: 3,
    alignItems: "center",
  },
  right: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    fontWeight: "bold",
  },
});
