import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import {
  Avatar,
  Badge,
  Searchbar,
  IconButton,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "../utils/Text";

interface HeaderProps {
  toggleSidebar: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  title = "Dashboard",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="light" style={styles.blurContainer}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
              <Ionicons
                name="menu-outline"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primary]}
                style={styles.logoBackground}
              >
                <Text style={styles.logoText}>d</Text>
              </LinearGradient>
              <Text style={styles.logoTitle}>d-Checkin</Text>
            </View>

            {title && <Text style={styles.pageTitle}>{title}</Text>}
          </View>

          <View style={styles.rightSection}>
            <Searchbar
              placeholder="Search..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
              iconColor={theme.colors.primary}
              inputStyle={styles.searchInput}
            />

            <View style={styles.notificationContainer}>
              <IconButton
                icon="bell-outline"
                size={24}
                onPress={() => {}}
                style={styles.iconButton}
              />
              <Badge style={styles.badge}>3</Badge>
            </View>

            <TouchableOpacity style={styles.profileContainer}>
              <Avatar.Image
                size={40}
                source={require("../../assets/images/icon.png")}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Admin User</Text>
                <Text style={styles.profileRole}>Administrator</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-down"
                size={20}
                color={theme.colors.accent}
              />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 1000,
  },
  blurContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    marginRight: 16,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  logoBackground: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    height: 40,
    width: 240,
    marginRight: 16,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 20,
  },
  searchInput: {
    fontSize: 14,
  },
  notificationContainer: {
    position: "relative",
    marginRight: 16,
  },
  iconButton: {
    margin: 0,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  profileInfo: {
    marginLeft: 12,
    marginRight: 8,
  },
  profileName: {
    fontSize: 14,
    fontWeight: "600",
  },
  profileRole: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default Header;
