import { useTheme } from "@/lib/hooks/useTheme";
import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedForeground,
        tabBarStyle: { backgroundColor: theme.colors.cards },
        headerTitleAlign: "center",
        headerTintColor: theme.colors.primary,
        headerStyle: { backgroundColor: theme.colors.cards },
      }}
    >
      <Tabs.Screen
        name="sessions"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="calendar-month" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="overview"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="history" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(more)"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="more-horiz" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
