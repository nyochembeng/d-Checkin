import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "../utils/Text";
import { Ionicons } from "@expo/vector-icons";

// TypeScript interfaces
interface CardData {
  id: string;
  title: string;
  icon: string;
  route: string;
  message: string;
  actionText: string;
  badgeCount?: number;
}

export default function EmployeePage() {
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [workDuration, setWorkDuration] = useState<string>("0h 0m");

  // Fetch user info (would come from a user context or API in a real app)
  const userInfo = {
    name: "John Doe",
    position: "Software Engineer",
    avatarUrl: null, // Would be an actual URL in production
    department: "Engineering",
  };

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());

      // If checked in, update duration
      if (isCheckedIn && checkInTime) {
        const durationMs = new Date().getTime() - checkInTime.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor(
          (durationMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        setWorkDuration(`${hours}h ${minutes}m`);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [isCheckedIn, checkInTime]);

  // Sample data for cards
  const cardsData: CardData[] = [
    {
      id: "overview",
      title: "Overview",
      icon: "stats-chart",
      route: "/overview",
      message: isCheckedIn
        ? `Working for ${workDuration}`
        : "Last checkout: 5:30 PM yesterday",
      actionText: "View Details",
    },
    {
      id: "calendar",
      title: "Calendar",
      icon: "calendar",
      route: "/calendar",
      message: "Meeting at 2:00 PM today",
      actionText: "View Calendar",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: "notifications",
      route: "/notifications",
      message: "Leave request approved",
      actionText: "View All",
      badgeCount: 3,
    },
    {
      id: "permissions",
      title: "Leave & Permissions",
      icon: "document-text",
      route: "/permissions",
      message: "2 pending requests",
      actionText: "Manage",
    },
  ];

  const handleCheckAction = () => {
    if (isCheckedIn) {
      // Handle checkout
      setIsCheckedIn(false);
      setCheckInTime(null);
      setWorkDuration("0h 0m");
    } else {
      // Handle checkin
      setIsCheckedIn(true);
      setCheckInTime(new Date());
    }

    // In a real app, you would navigate to biometric authentication
    // router.push(`/auth/biometric-authentication?action=${isCheckedIn ? 'checkout' : 'checkin'}`);
  };

  const handleCardPress = (route: string) => {
    console.log(`Navigating to ${route}`);
    // router.push(route);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Format time for display
  const formatTime = () => {
    return currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format date for display
  const formatDate = () => {
    return currentTime.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Status Bar */}
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      />

      {/* Header with background */}
      <View style={styles.header}>
        <ImageBackground
          source={{
            uri: "https://images.pexels.com/photos/28879424/pexels-photo-28879424/free-photo-of-voyageur-lisant-sur-un-siege-de-train-avec-des-bagages.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
          }}
          style={styles.headerBackground}
        >
          <View style={styles.headerOverlay}>
            {/* User Welcome */}
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {userInfo.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Text>
                </View>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.greeting}>{getGreeting()},</Text>
                <Text style={styles.userName}>{userInfo.name}</Text>
                <Text style={styles.userPosition}>
                  {userInfo.department} • {userInfo.position}
                </Text>
              </View>
            </View>

            {/* Date & Time Display */}
            <View style={styles.dateTimeContainer}>
              <Text style={styles.time}>{formatTime()}</Text>
              <Text style={styles.date}>{formatDate()}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Check-In/Out Status Card */}
        <View
          style={[styles.statusCard, { backgroundColor: theme.colors.cards }]}
        >
          <View style={styles.statusInfo}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: isCheckedIn ? "#34A853" : "#FBBC05" },
              ]}
            />
            <View>
              <Text
                style={[styles.statusTitle, { color: theme.colors.foreground }]}
              >
                {isCheckedIn ? "Currently Working?" : "Not Checked In!"}
              </Text>
              <Text
                style={[
                  styles.statusSubtitle,
                  { color: theme.colors.mutedForeground },
                ]}
              >
                {isCheckedIn
                  ? `Checked in at ${checkInTime?.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Start your workday by checking in"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.checkButton,
              {
                backgroundColor: isCheckedIn ? "#f5e1e1" : "#e3f2e7",
              },
            ]}
            onPress={handleCheckAction}
          >
            <Ionicons
              name={isCheckedIn ? "log-out-outline" : "log-in-outline"}
              size={20}
              color={isCheckedIn ? "#EA4335" : "#34A853"}
            />
            <Text
              style={[
                styles.checkButtonText,
                { color: isCheckedIn ? "#EA4335" : "#34A853" },
              ]}
            >
              {isCheckedIn ? "Check Out" : "Check In"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats Row */}
        {isCheckedIn && (
          <View style={styles.quickStatsContainer}>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.cards }]}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text
                style={[styles.statValue, { color: theme.colors.foreground }]}
              >
                {workDuration}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.mutedForeground },
                ]}
              >
                Working Time
              </Text>
            </View>

            <View
              style={[styles.statCard, { backgroundColor: theme.colors.cards }]}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text
                style={[styles.statValue, { color: theme.colors.foreground }]}
              >
                2
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.mutedForeground },
                ]}
              >
                Today's Events
              </Text>
            </View>

            <View
              style={[styles.statCard, { backgroundColor: theme.colors.cards }]}
            >
              <Ionicons
                name="flag-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text
                style={[styles.statValue, { color: theme.colors.foreground }]}
              >
                1
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.mutedForeground },
                ]}
              >
                Task Due
              </Text>
            </View>
          </View>
        )}

        {/* Section Title */}
        <View style={styles.sectionTitleContainer}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.foreground }]}
          >
            Quick Access
          </Text>
        </View>

        {/* Cards Grid */}
        <View style={styles.cardsContainer}>
          {cardsData.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.cardWrapper, { width: "47%" }]}
              onPress={() => handleCardPress(card.route)}
            >
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.colors.cards,
                    borderColor: theme.colors.primary,
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${theme.colors.primary}15` },
                    ]}
                  >
                    <Ionicons
                      name={card.icon as any}
                      size={24}
                      color={theme.colors.primary}
                    />
                  </View>

                  {card.badgeCount && (
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    >
                      <Text style={styles.badgeText}>{card.badgeCount}</Text>
                    </View>
                  )}
                </View>

                <Text
                  style={[styles.cardTitle, { color: theme.colors.foreground }]}
                >
                  {card.title}
                </Text>

                <Text
                  style={[
                    styles.cardMessage,
                    { color: theme.colors.mutedForeground },
                  ]}
                  numberOfLines={2}
                >
                  {card.message}
                </Text>

                <View style={styles.cardAction}>
                  <Text
                    style={[
                      styles.cardActionText,
                      { color: theme.colors.primary },
                    ]}
                  >
                    {card.actionText}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={theme.colors.primary}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: height * 0.23,
    overflow: "hidden",
  },
  headerBackground: {
    flex: 1,
    justifyContent: "center",
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
  },
  greeting: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
  },
  userName: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  userPosition: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
  },
  dateTimeContainer: {
    alignItems: "flex-end",
  },
  time: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  date: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: -20,
  },
  statusCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusSubtitle: {
    fontSize: 14,
  },
  checkButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  checkButtonText: {
    marginLeft: 5,
    fontWeight: "600",
  },
  quickStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "31%",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  sectionTitleContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardWrapper: {
    marginBottom: 15,
  },
  card: {
    borderRadius: 12,
    padding: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    height: 160,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 32,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  cardMessage: {
    fontSize: 14,
    marginTop: 5,
  },
  cardAction: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  cardActionText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 5,
  },
});
