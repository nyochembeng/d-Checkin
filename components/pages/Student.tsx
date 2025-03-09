import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Card, IconButton, Surface, Avatar, Badge } from "react-native-paper";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "../utils/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Define interfaces for our data structures
interface DashboardCardItem {
  id: string;
  title: string;
  content: string;
  icon: string;
  route: string;
  color: string;
  bgColor: string;
  badge?: number;
}

interface SessionItem {
  id: number;
  subject: string;
  time: string;
  teacher: string;
  room: string;
}

export default function StudentPage(): JSX.Element {
  const theme = useTheme();
  const [userName] = useState<string>("Jane Doe"); // Consider getting this from context/state management
  const [notifications] = useState<number>(3); // Number of unread notifications

  // Sample data for student dashboard cards
  const dashboardData: DashboardCardItem[] = [
    {
      id: "sessions",
      title: "Upcoming Sessions",
      content: "Math Class at 10:00 AM",
      icon: "calendar-clock",
      route: "/sessions",
      color: theme.colors.primary,
      bgColor: `${theme.colors.primary}15`, // 15% opacity
    },
    {
      id: "attendance",
      title: "My Attendance",
      content: "Present: 18/20 days (90%)",
      icon: "check-circle-outline",
      route: "/attendance",
      color: "#4CAF50",
      bgColor: "#4CAF5015",
    },
    {
      id: "notifications",
      title: "Notifications",
      content: "School assembly at 2:00 PM",
      icon: "bell-outline",
      route: "/notifications",
      color: "#FF9800",
      bgColor: "#FF980015",
      badge: notifications,
    },
    {
      id: "permissions",
      title: "Permissions",
      content: "Field trip permission pending",
      icon: "file-document-outline",
      route: "/permissions",
      color: "#9C27B0",
      bgColor: "#9C27B015",
    },
  ];

  // Mock data for upcoming sessions
  const upcomingSessions: SessionItem[] = [
    {
      id: 1,
      subject: "Mathematics",
      time: "10:00 AM",
      teacher: "Prof. Johnson",
      room: "Room 101",
    },
    {
      id: 2,
      subject: "Physics",
      time: "12:30 PM",
      teacher: "Dr. Smith",
      room: "Lab 3",
    },
  ];

  const handleCardPress = (route: string): void => {
    // router.push(route);
  };

  const renderDashboardCard = (item: DashboardCardItem): JSX.Element => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.cardWrapper}
        onPress={() => handleCardPress(item.route)}
        activeOpacity={0.7}
      >
        <Surface
          style={[styles.card, { backgroundColor: theme.colors.cards }]}
          elevation={2}
        >
          <View
            style={[
              styles.cardIconContainer,
              { backgroundColor: item.bgColor },
            ]}
          >
            <MaterialCommunityIcons
              name={item.icon as any}
              size={24}
              color={item.color}
            />
            {item.badge && (
              <Badge style={styles.badge} size={18}>
                {item.badge}
              </Badge>
            )}
          </View>
          <View style={styles.cardTextContainer}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.primary, fontWeight: "600" }}
            >
              {item.title}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.foreground, marginTop: 4 }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.content}
            </Text>
          </View>
        </Surface>
      </TouchableOpacity>
    );
  };

  const renderSessionItem = (session: SessionItem): JSX.Element => (
    <Surface
      key={session.id}
      style={[styles.sessionItem, { backgroundColor: theme.colors.cards }]}
      elevation={1}
    >
      <View style={styles.sessionTimeContainer}>
        <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
          {session.time}
        </Text>
      </View>
      <View style={styles.sessionInfoContainer}>
        <Text variant="titleMedium" style={{ fontWeight: "600" }}>
          {session.subject}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.foreground }}>
          {session.teacher} • {session.room}
        </Text>
      </View>
      <IconButton
        icon="arrow-right"
        size={20}
        iconColor={theme.colors.primary}
      />
    </Surface>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      />

      {/* Header with Gradient */}
      <LinearGradient
        colors={[
          theme.colors.primary,
          theme.colors.primary || theme.colors.primary,
        ]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.userInfoContainer}>
            <Avatar.Image
              size={50}
              source={{
                uri: "https://randomuser.me/api/portraits/women/17.jpg",
              }}
              style={styles.avatar}
            />
            <View style={styles.userTextContainer}>
              <Text variant="headlineSmall" style={styles.greeting}>
                Hello, {userName.split(" ")[0]}!
              </Text>
              <Text variant="bodyMedium" style={styles.date}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>
          </View>
          <IconButton
            icon="bell-outline"
            size={24}
            iconColor="white"
            style={styles.bellIcon}
            onPress={() => handleCardPress("/notifications")}
          />
          {notifications > 0 && (
            <Badge style={styles.headerBadge}>{notifications}</Badge>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Quick Check-in Button */}
        <TouchableOpacity
          style={styles.checkInButtonContainer}
          onPress={() => handleCardPress("/check-in")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#4CAF50", "#388E3C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkInButton}
          >
            <MaterialCommunityIcons
              name="fingerprint"
              size={24}
              color="white"
            />
            <Text variant="titleMedium" style={styles.checkInText}>
              Check In Now
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Dashboard Cards Grid */}
        <View style={styles.cardsContainer}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Dashboard
          </Text>
          <View style={styles.cardsGrid}>
            {dashboardData.map(renderDashboardCard)}
          </View>
        </View>

        {/* Today's Sessions */}
        <View style={styles.sessionsContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Today's Sessions
            </Text>
            <TouchableOpacity onPress={() => handleCardPress("/sessions")}>
              <Text style={{ color: theme.colors.primary }}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingSessions.map(renderSessionItem)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingVertical: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  userTextContainer: {
    marginLeft: 12,
  },
  greeting: {
    color: "white",
    fontWeight: "bold",
  },
  date: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  bellIcon: {
    marginLeft: "auto",
  },
  headerBadge: {
    position: "absolute",
    top: 8,
    right: 16,
    backgroundColor: "#FF5252",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  checkInButtonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    zIndex: 10,
  },
  checkInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  checkInText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
  },
  cardsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    height: "auto",
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF5252",
  },
  cardTextContainer: {
    flex: 1,
  },
  sessionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 12,
    padding: 12,
  },
  sessionTimeContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sessionInfoContainer: {
    flex: 1,
    marginLeft: 12,
  },
});
