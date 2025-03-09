import React, { useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Animated,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import {
  List,
  Chip,
  Surface,
  Badge,
  Divider,
  IconButton,
  Menu,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Header } from "@/components/utils/Header";
import { Text } from "@/components/utils/Text";
import { useTheme } from "@/lib/hooks/useTheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Notification type definition
type Notification = {
  id: string;
  message: string;
  timestamp: Date;
  type: "permission" | "announcement" | "reminder" | "hr" | "system";
  read: boolean;
  details?: string;
};

// Sample notifications data
const sampleNotifications: Notification[] = [
  {
    id: "1",
    message: "Your permission request has been approved.",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    type: "permission",
    read: false,
    details:
      "Your time-off request for March 12-15 has been approved by your supervisor.",
  },
  {
    id: "4",
    message: "New message from HR regarding benefits.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: "hr",
    read: false,
    details:
      "The HR department has updated the employee benefits package. Please review the changes in your portal.",
  },
  {
    id: "2",
    message: "New announcement: Office will be closed tomorrow.",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    type: "announcement",
    read: true,
    details:
      "Due to scheduled maintenance, the office will be closed on March 10. Please work from home.",
  },
  {
    id: "3",
    message: "Reminder: Update your profile information.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    type: "reminder",
    read: true,
    details:
      "Please ensure your contact information and emergency contacts are up to date in the system.",
  },
];

// Helper function for relative time
const getRelativeTime = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (60 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds} sec ago`;
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days === 1) return "yesterday";
  return timestamp.toLocaleDateString();
};

// Get notification type icon and color
const getNotificationTypeDetails = (type: Notification["type"], theme: any) => {
  switch (type) {
    case "permission":
      return {
        icon: "check-circle",
        color: theme.colors.success,
        label: "Permission",
      };
    case "announcement":
      return {
        icon: "campaign",
        color: theme.colors.primary,
        label: "Announcement",
      };
    case "reminder":
      return {
        icon: "alarm",
        color: theme.colors.warning,
        label: "Reminder",
      };
    case "hr":
      return {
        icon: "people",
        color: theme.colors.info,
        label: "HR",
      };
    case "system":
    default:
      return {
        icon: "settings",
        color: theme.colors.mutedForeground,
        label: "System",
      };
  }
};

export default function NotificationsPage() {
  const theme = useTheme();
  const [notifications, setNotifications] =
    useState<Notification[]>(sampleNotifications);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<
    Notification["type"] | "All"
  >("All");
  const [expandedNotification, setExpandedNotification] = useState<
    string | null
  >(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [groupByType, setGroupByType] = useState<boolean>(false);

  const menuAnchorRef = useRef<View>(null);
  const windowWidth = Dimensions.get("window").width;

  // Group notifications if enabled
  const groupedNotifications = useCallback(() => {
    if (!groupByType) return filteredNotifications;

    // First, sort by type
    const sortedByType = [...filteredNotifications].sort((a, b) =>
      a.type.localeCompare(b.type)
    );

    return sortedByType;
  }, [notifications, activeFilter, groupByType]);

  // Refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      // Here you'd typically fetch new notifications
      setRefreshing(false);
    }, 1000);
  }, []);

  // Filter notifications
  const filteredNotifications = notifications.filter(
    (notification) =>
      activeFilter === "All" || notification.type === activeFilter
  );

  // Handle all notification actions
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  }, []);

  const deleteAllRead = useCallback(() => {
    setNotifications((prev) =>
      prev.filter((notification) => !notification.read)
    );
  }, []);

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Delete notification
  const handleDelete = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  // Mark as read
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  // Toggle notification expansion
  const toggleExpand = (notificationId: string) => {
    setExpandedNotification(
      expandedNotification === notificationId ? null : notificationId
    );
  };

  // Swipeable delete action
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    notification: Notification
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[
          styles.deleteContainer,
          {
            transform: [{ scale: trans }],
            backgroundColor: theme.colors.danger,
          },
        ]}
      >
        <MaterialIcons name="delete" size={24} color="#fff" />
      </Animated.View>
    );
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const { icon, color, label } = getNotificationTypeDetails(item.type, theme);
    const isExpanded = expandedNotification === item.id;

    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
        onSwipeableRightOpen={() => handleDelete(item.id)}
        key={item.id}
      >
        <Surface
          style={[
            styles.notificationCard,
            // {
            //   backgroundColor: item.read
            //     ? theme.colors.background
            //     : `${theme.colors.primary}10`,
            // },
          ]}
        >
          <TouchableOpacity
            style={styles.notificationContent}
            onPress={() => toggleExpand(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.notificationIconContainer}>
              <View
                style={[
                  styles.iconBackground,
                  // { backgroundColor: `${color}20` },
                ]}
              >
                <MaterialIcons name={icon as any} size={24} color={color} />
              </View>
              {!item.read && (
                <View
                  style={[
                    styles.unreadDot,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
              )}
            </View>

            <View style={styles.notificationTextContainer}>
              <View style={styles.notificationHeader}>
                <Text
                  style={[
                    styles.notificationMessage,
                    {
                      color: theme.colors.foreground,
                      fontWeight: item.read ? "normal" : "bold",
                    },
                  ]}
                  numberOfLines={isExpanded ? undefined : 2}
                >
                  {item.message}
                </Text>
                <Text
                  style={[
                    styles.notificationBadge,
                    { backgroundColor: color, color: "#fff" },
                  ]}
                >
                  {label}
                </Text>
              </View>

              <Text
                style={[
                  styles.notificationTime,
                  { color: theme.colors.mutedForeground },
                ]}
              >
                {getRelativeTime(item.timestamp)}
              </Text>

              {isExpanded && item.details && (
                <View style={styles.expandedContent}>
                  <Divider style={styles.expandDivider} />
                  <Text
                    style={[
                      styles.detailsText,
                      { color: theme.colors.foreground },
                    ]}
                  >
                    {item.details}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.notificationActions}>
              {!item.read ? (
                <TouchableOpacity
                  onPress={() => handleMarkAsRead(item.id)}
                  style={styles.actionButton}
                >
                  <MaterialIcons
                    name="done"
                    size={20}
                    color={theme.colors.mutedForeground}
                  />
                </TouchableOpacity>
              ) : (
                <MaterialIcons
                  name={
                    isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"
                  }
                  size={20}
                  color={theme.colors.mutedForeground}
                />
              )}
            </View>
          </TouchableOpacity>
        </Surface>
      </Swipeable>
    );
  };

  // Render filter chips with icons
  const renderFilterChip = (filter: string) => {
    const isAll = filter === "All";
    const { icon, color } = isAll
      ? { icon: "filter-list", color: theme.colors.primary }
      : getNotificationTypeDetails(filter as Notification["type"], theme);

    return (
      <Chip
        key={filter}
        onPress={() => setActiveFilter(filter as Notification["type"] | "All")}
        selected={activeFilter === filter}
        style={[
          styles.filterChip,
          {
            // backgroundColor:
            //   activeFilter === filter ? `${color}15` : theme.colors.cards,
            borderColor: activeFilter === filter ? color : "transparent",
            borderWidth: 1,
          },
        ]}
        textStyle={{
          color: activeFilter === filter ? color : theme.colors.mutedForeground,
        }}
        icon={() => (
          <MaterialIcons
            name={icon as any}
            size={16}
            color={
              activeFilter === filter ? color : theme.colors.mutedForeground
            }
          />
        )}
      >
        {filter === "All"
          ? "All"
          : filter.charAt(0).toUpperCase() + filter.slice(1)}
      </Chip>
    );
  };

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <StatusBar backgroundColor={theme.colors.background} />

        {/* Header */}
        <Header
          title="Notifications"
          showBack
          rightContent={
            <View ref={menuAnchorRef} style={styles.headerRightContent}>
              {unreadCount > 0 && (
                <Badge style={styles.badge}>{unreadCount}</Badge>
              )}
              <IconButton
                icon="more-vert"
                iconColor={theme.colors.foreground}
                size={24}
                onPress={() => setShowMenu(true)}
              />
              <Menu
                visible={showMenu}
                onDismiss={() => setShowMenu(false)}
                anchor={menuAnchorRef.current}
              >
                <Menu.Item
                  onPress={() => {
                    markAllAsRead();
                    setShowMenu(false);
                  }}
                  title="Mark all as read"
                  leadingIcon="done-all"
                />
                <Menu.Item
                  onPress={() => {
                    deleteAllRead();
                    setShowMenu(false);
                  }}
                  title="Delete read notifications"
                  leadingIcon="delete-sweep"
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setGroupByType(!groupByType);
                    setShowMenu(false);
                  }}
                  title={`${groupByType ? "Disable" : "Enable"} grouping`}
                  leadingIcon={groupByType ? "format-list-bulleted" : "sort"}
                />
              </Menu>
            </View>
          }
        />

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["All", "permission", "announcement", "reminder", "hr"].map(
              renderFilterChip
            )}
          </ScrollView>
        </View>

        <Divider style={styles.divider} />

        {/* Notifications List */}
        <FlatList
          data={groupedNotifications()}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <MaterialIcons
                name="notifications-off"
                size={50}
                color={theme.colors.mutedForeground}
              />
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.mutedForeground },
                ]}
              >
                No notifications
                {activeFilter !== "All" ? ` for ${activeFilter}` : ""}
              </Text>
              {activeFilter !== "All" && (
                <TouchableOpacity
                  onPress={() => setActiveFilter("All")}
                  style={[
                    styles.clearFilterButton,
                    { borderColor: theme.colors.primary },
                  ]}
                >
                  <Text style={{ color: theme.colors.primary }}>
                    Show all notifications
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerRightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    zIndex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterChip: {
    marginRight: 8,
    height: 36,
  },
  divider: {
    marginHorizontal: 16,
    height: 1,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  notificationCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    overflow: "hidden",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },
  notificationIconContainer: {
    position: "relative",
    marginRight: 16,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  notificationTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  notificationMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  notificationBadge: {
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
    textAlign: "center",
  },
  notificationTime: {
    fontSize: 12,
  },
  notificationActions: {
    paddingTop: 4,
    alignItems: "center",
  },
  actionButton: {
    padding: 4,
  },
  deleteContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  clearFilterButton: {
    marginTop: 16,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  expandedContent: {
    marginTop: 8,
  },
  expandDivider: {
    marginVertical: 8,
  },
  detailsText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
