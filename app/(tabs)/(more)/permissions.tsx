import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FAB, List } from "react-native-paper";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/lib/hooks/useTheme";
import { Header } from "@/components/utils/Header";
import { Text } from "@/components/utils/Text";

// Sample permission request data
const samplePermissions = [
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
  const [permissions, setPermissions] = useState(samplePermissions);

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

  const renderPermissionItem = ({
    item,
  }: {
    item: (typeof samplePermissions)[0];
  }) => {
    return (
      <TouchableOpacity onPress={() => handleEdit(item.id)}>
        <List.Item
          title={item.subject}
          description={() => (
            <View>
              <Text style={styles.messageText}>
                {item.message.substring(0, 50)}...
              </Text>
              <Text style={styles.detailText}>
                Status: {item.status} | Applied: {item.dateApplied}
              </Text>
            </View>
          )}
          right={(props) => (
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <MaterialIcons
                name="delete"
                size={16}
                color={theme.colors.danger}
              />
            </TouchableOpacity>
          )}
          titleStyle={{ color: theme.colors.foreground }}
          descriptionStyle={{ color: theme.colors.mutedForeground }}
          style={[styles.listItem, { backgroundColor: theme.colors.cards }]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      {/* Header */}
      <Header title="My Permissions" showBack showNotification />

      <View style={styles.container}>
        <FlatList
          data={permissions}
          keyExtractor={(item) => item.id}
          renderItem={renderPermissionItem}
          contentContainerStyle={styles.listContainer}
        />

        {/* Floating Action Button */}
        <FAB
          icon="plus"
          style={styles.fab}
          variant="primary"
          color={theme.colors.primary}
          animated
          onPress={() => router.push("/apply-permission")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 80,
  },
  listItem: {
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 2,
  },
  detailText: {
    fontSize: 12,
    color: "#777",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
