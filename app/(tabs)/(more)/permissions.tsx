import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  ScrollView,
} from "react-native";
import { FAB, List, Chip, Divider, Searchbar } from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/lib/hooks/useTheme";
import { Header } from "@/components/utils/Header";
import { Text } from "@/components/utils/Text";
import { format } from "date-fns";

// Define type for permission request
type Permission = {
  id: string;
  subject: string;
  message: string;
  status: "Pending" | "Approved" | "Rejected";
  dateApplied: string;
};

// Sample permission request data
const samplePermissions: Permission[] = [
  {
    id: "1",
    subject: "Missed Class - Medical Emergency",
    message: "I was unable to attend the class due to a medical emergency.",
    status: "Pending",
    dateApplied: "2023-03-20",
  },
  {
    id: "2",
    subject: "Leave Request - Family Function",
    message: "Requesting a day off to attend a family function.",
    status: "Approved",
    dateApplied: "2023-03-18",
  },
  {
    id: "3",
    subject: "Permission to Leave Early",
    message: "I need to leave early due to an urgent appointment.",
    status: "Rejected",
    dateApplied: "2023-03-15",
  },
];

export default function PermissionsPage() {
  const theme = useTheme();
  const [permissions, setPermissions] =
    useState<Permission[]>(samplePermissions);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");

  // Refresh data function
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Simulate data loading on screen focus
  useFocusEffect(
    useCallback(() => {
      // You would typically fetch updated data from your API here
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  const handleEdit = (permissionId: string) => {
    // Navigate to Apply Permission page with the permissionId to edit
    router.push(`/apply-permission?id=${permissionId}`);
  };

  const handleDelete = (permissionId: string) => {
    Alert.alert(
      "Delete Permission",
      "Are you sure you want to delete this permission request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            // Delete permission logic here
            setPermissions((prev) =>
              prev.filter((permission) => permission.id !== permissionId)
            );
          },
          style: "destructive",
        },
      ]
    );
  };

  // Filter permissions based on search and status filter
  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "All" || permission.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Get status chip style based on status
  const getStatusChipStyle = (status: Permission["status"]) => {
    switch (status) {
      case "Approved":
        return {
          // backgroundColor: `${theme.colors.success}20`,
          textColor: theme.colors.success,
        };
      case "Rejected":
        return {
          // backgroundColor: `${theme.colors.danger}20`,
          textColor: theme.colors.danger,
        };
      case "Pending":
      default:
        return {
          // backgroundColor: `${theme.colors.warning}20`,
          textColor: theme.colors.warning,
        };
    }
  };

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const renderPermissionItem = ({ item }: { item: Permission }) => {
    const statusStyle = getStatusChipStyle(item.status);

    return (
      <TouchableOpacity
        onPress={() => handleEdit(item.id)}
        style={[styles.permissionCard, { backgroundColor: theme.colors.cards }]}
      >
        <View style={styles.permissionHeader}>
          <Text
            style={[styles.permissionTitle, { color: theme.colors.foreground }]}
            numberOfLines={1}
          >
            {item.subject}
          </Text>
          <Chip
            // style={{ backgroundColor: statusStyle.backgroundColor }}
            textStyle={{ color: statusStyle.textColor, fontSize: 12 }}
            compact
          >
            {item.status}
          </Chip>
        </View>

        <Text
          style={[styles.messageText, { color: theme.colors.mutedForeground }]}
          numberOfLines={2}
        >
          {item.message}
        </Text>

        <View style={styles.permissionFooter}>
          <Text
            style={[styles.dateText, { color: theme.colors.mutedForeground }]}
          >
            Applied: {formatDate(item.dateApplied)}
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => handleEdit(item.id)}
              style={styles.actionButton}
            >
              <MaterialIcons
                name="edit"
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.actionButton}
            >
              <MaterialIcons
                name="delete"
                size={20}
                color={theme.colors.danger}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="list-alt"
        size={50}
        color={theme.colors.mutedForeground}
      />
      <Text style={[styles.emptyText, { color: theme.colors.mutedForeground }]}>
        No permission requests found
      </Text>
      {searchQuery || activeFilter !== "All" ? (
        <TouchableOpacity
          onPress={() => {
            setSearchQuery("");
            setActiveFilter("All");
          }}
          style={[
            styles.clearButton,
            { backgroundColor: theme.colors.primary + "20" },
          ]}
        >
          <Text
            style={[styles.clearButtonText, { color: theme.colors.primary }]}
          >
            Clear filters
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => router.push("/apply-permission")}
          style={[
            styles.clearButton,
            { backgroundColor: theme.colors.primary + "20" },
          ]}
        >
          <Text
            style={[styles.clearButtonText, { color: theme.colors.primary }]}
          >
            Create new request
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar backgroundColor={theme.colors.background} />

      {/* Header */}
      <Header title="My Permissions" showBack showNotification />

      {/* Search Bar */}
      <Searchbar
        placeholder="Search permissions..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchBar, { backgroundColor: theme.colors.cards }]}
        iconColor={theme.colors.mutedForeground}
        inputStyle={{ color: theme.colors.foreground }}
        placeholderTextColor={theme.colors.mutedForeground}
      />

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {(["All", "Pending", "Approved", "Rejected"] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  activeFilter === filter
                    ? theme.colors.primary
                    : theme.colors.cards,
              },
            ]}
          >
            <Text
              style={{
                color:
                  activeFilter === filter
                    ? theme.colors.cards
                    : theme.colors.mutedForeground,
              }}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Divider style={styles.divider} />

      {/* Permissions List */}
      <FlatList
        data={filteredPermissions}
        keyExtractor={(item) => item.id}
        renderItem={renderPermissionItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <FAB
        icon={() => <MaterialIcons name="add" size={24} color="#fff" />}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push("/apply-permission")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    marginHorizontal: 16,
    marginTop: 8,
    elevation: 1,
    borderRadius: 12,
  },
  filtersContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  filtersContent: {
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  divider: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  permissionCard: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  permissionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 8,
  },
  permissionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 30,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
  clearButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearButtonText: {
    fontWeight: "500",
  },
});
