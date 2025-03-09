import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Divider } from "react-native-paper";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { useTheme } from "@/lib/hooks/useTheme";
import { Text } from "../utils/Text";

interface SidebarProps {
  isVisible: boolean;
  activePage: string;
  onPageChange: (page: string) => void;
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  hasSubmenu?: boolean;
  onPress: () => void;
}

interface MenuGroup {
  title: string;
  items: {
    id: string;
    label: string;
    icon: string;
    iconType: "ionicons" | "material" | "materialCommunity" | "fontAwesome";
    submenu?: Array<{
      id: string;
      label: string;
    }>;
  }[];
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  isActive,
  hasSubmenu = false,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        isActive && { backgroundColor: `${theme.colors.primary}15` },
      ]}
      onPress={onPress}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemIcon}>{icon}</View>
        <Text
          style={[
            styles.menuItemLabel,
            isActive && { color: theme.colors.primary, fontWeight: "600" },
          ]}
        >
          {label}
        </Text>
      </View>

      {hasSubmenu && (
        <MaterialIcons
          name="keyboard-arrow-down"
          size={20}
          color={theme.colors.accent}
        />
      )}
    </TouchableOpacity>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  activePage,
  onPageChange,
}) => {
  const theme = useTheme();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleSubmenu = (id: string) => {
    if (expandedMenus.includes(id)) {
      setExpandedMenus(expandedMenus.filter((item) => item !== id));
    } else {
      setExpandedMenus([...expandedMenus, id]);
    }
  };

  const menuGroups: MenuGroup[] = [
    {
      title: "Main",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: "home-outline",
          iconType: "ionicons",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          id: "users",
          label: "User Management",
          icon: "people-outline",
          iconType: "ionicons",
          submenu: [
            { id: "students", label: "Students" },
            { id: "employees", label: "Employees" },
            { id: "admins", label: "Administrators" },
          ],
        },
        {
          id: "permissions",
          label: "Permissions",
          icon: "lock-open-outline",
          iconType: "ionicons",
          submenu: [
            { id: "requests", label: "Leave Requests" },
            { id: "approvals", label: "Approvals" },
          ],
        },
        {
          id: "attendance",
          label: "Attendance",
          icon: "calendar-check-outline",
          iconType: "materialCommunity",
          submenu: [
            { id: "records", label: "Records" },
            { id: "manual", label: "Manual Entry" },
          ],
        },
        {
          id: "sessions",
          label: "Sessions",
          icon: "timer-outline",
          iconType: "ionicons",
          submenu: [
            { id: "create", label: "Create Session" },
            { id: "manage", label: "Manage Sessions" },
          ],
        },
      ],
    },
    {
      title: "Analysis",
      items: [
        {
          id: "reports",
          label: "Reports",
          icon: "file-document-outline",
          iconType: "materialCommunity",
        },
        {
          id: "analytics",
          label: "Analytics",
          icon: "chart-line",
          iconType: "materialCommunity",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          id: "settings",
          label: "Settings",
          icon: "settings-outline",
          iconType: "ionicons",
        },
        {
          id: "support",
          label: "Contact Support",
          icon: "headset",
          iconType: "fontAwesome",
        },
        {
          id: "about",
          label: "About",
          icon: "info-circle",
          iconType: "fontAwesome",
        },
      ],
    },
  ];

  const renderIcon = (
    iconName: string,
    iconType: string,
    isActive: boolean
  ) => {
    const color = isActive ? theme.colors.primary : theme.colors.primary;
    const size = 20;

    switch (iconType) {
      case "ionicons":
        return <Ionicons name={iconName as any} size={size} color={color} />;
      case "material":
        return (
          <MaterialIcons name={iconName as any} size={size} color={color} />
        );
      case "materialCommunity":
        return (
          <MaterialCommunityIcons
            name={iconName as any}
            size={size}
            color={color}
          />
        );
      case "fontAwesome":
        return (
          <FontAwesome5 name={iconName as any} size={size} color={color} />
        );
      default:
        return <Ionicons name="help-outline" size={size} color={color} />;
    }
  };

  if (!isVisible) return null;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.logoSection}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primary]}
            style={styles.logoBackground}
          >
            <Text style={styles.logoText}>d</Text>
          </LinearGradient>
          <Text style={styles.logoTitle}>d-Checkin</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuGroups.map((group, groupIndex) => (
            <View key={group.title} style={styles.menuGroup}>
              {groupIndex > 0 && <Divider style={styles.divider} />}
              <Text style={styles.menuGroupTitle}>{group.title}</Text>

              {group.items.map((item) => {
                const isActive = activePage === item.id;
                const isExpanded = expandedMenus.includes(item.id);

                return (
                  <View key={item.id}>
                    <MenuItem
                      icon={renderIcon(item.icon, item.iconType, isActive)}
                      label={item.label}
                      isActive={isActive}
                      hasSubmenu={Boolean(
                        item.submenu && item.submenu.length > 0
                      )}
                      onPress={() => {
                        if (item.submenu && item.submenu.length > 0) {
                          toggleSubmenu(item.id);
                        } else {
                          onPageChange(item.id);
                        }
                      }}
                    />

                    {isExpanded && item.submenu && (
                      <View style={styles.submenuContainer}>
                        {item.submenu.map((subItem) => {
                          const isSubActive =
                            activePage === `${item.id}-${subItem.id}`;

                          return (
                            <TouchableOpacity
                              key={subItem.id}
                              style={[
                                styles.submenuItem,
                                isSubActive && {
                                  backgroundColor: theme.colors.primary,
                                },
                              ]}
                              onPress={() =>
                                onPageChange(`${item.id}-${subItem.id}`)
                              }
                            >
                              <View style={styles.submenuDot} />
                              <Text
                                style={[
                                  styles.submenuLabel,
                                  isSubActive && {
                                    color: theme.colors.primary,
                                    fontWeight: "600",
                                  },
                                ]}
                              >
                                {subItem.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Divider />
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>
            v{Constants.expoConfig?.version || "1.0.0"}
          </Text>
          <TouchableOpacity style={styles.logoutButton}>
            <MaterialCommunityIcons
              name="logout"
              size={18}
              color={theme.colors.warning}
            />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: "100%",
    borderRightWidth: 1,
    borderRightColor: "rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
  },
  scrollContainer: {
    flex: 1,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  logoBackground: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  menuGroup: {
    marginBottom: 16,
  },
  menuGroupTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    opacity: 0.7,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  divider: {
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemIcon: {
    width: 24,
    alignItems: "center",
    marginRight: 12,
  },
  menuItemLabel: {
    fontSize: 14,
  },
  submenuContainer: {
    marginLeft: 36,
    marginBottom: 8,
  },
  submenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 2,
  },
  submenuDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.4)",
    marginRight: 10,
  },
  submenuLabel: {
    fontSize: 13,
  },
  footer: {
    padding: 16,
  },
  versionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  versionText: {
    fontSize: 12,
    opacity: 0.7,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 14,
    color: "red",
    marginLeft: 6,
  },
});

export default Sidebar;
