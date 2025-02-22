import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { List } from "react-native-paper";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";
import { Header } from "@/components/utils/Header";

// Sample courses data for the history list
const sampleCourses = [
  { id: "course1", title: "Mathematics 101" },
  { id: "course2", title: "Physics 202" },
  { id: "course3", title: "Chemistry 303" },
];

export default function HistoryPage() {
  const theme = useTheme();

  const renderItem = ({ item }: { item: (typeof sampleCourses)[0] }) => (
    <TouchableOpacity
    // onPress={() => router.push(`/history/${item.id}`)}
    >
      <List.Item
        title={item.title}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        titleStyle={{ color: theme.colors.foreground }}
        style={[styles.item, { backgroundColor: theme.colors.cards }]}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Session History" showBack showNotification />

      <FlatList
        data={sampleCourses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
    margin: 16,
  },
  item: {
    marginVertical: 6,
    borderRadius: 8,
    elevation: 2,
  },
});
