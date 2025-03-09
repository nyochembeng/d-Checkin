import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  Text,
  Card,
  useTheme,
  Avatar,
  ActivityIndicator,
  Button,
  IconButton,
  Divider,
} from "react-native-paper";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { LineChart, BarChart } from "react-native-chart-kit";
import { format, parseISO, subDays } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

// Type definitions
interface StatCardData {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

interface DashboardData {
  stats: {
    totalEmployees: number;
    pendingPermissions: number;
    systemAlerts: number;
    notifications: number;
    employeeChange: number;
    permissionsChange: number;
    alertsChange: number;
    notificationsChange: number;
  };
  attendanceTrends: {
    lastThreeMonths: {
      dates: string[];
      datasets: {
        [key: string]: number[];
      };
    };
    weeklyOverview: {
      days: string[];
      hours: number[];
    };
  };
  recentActivity: {
    id: string;
    type: string;
    user: {
      name: string;
      avatar?: string;
    };
    action: string;
    time: string;
  }[];
  upcomingSessions: {
    id: string;
    title: string;
    time: string;
    location: string;
    attendees: number;
  }[];
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [activeChartPeriod, setActiveChartPeriod] = useState<
    "day" | "week" | "month"
  >("month");

  const screenWidth =
    Dimensions.get("window").width - (sidebarVisible ? 280 : 0) - 48;

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // Mock data
      const mockData: DashboardData = {
        stats: {
          totalEmployees: 52,
          pendingPermissions: 7,
          systemAlerts: 8,
          notifications: 14,
          employeeChange: 0.23,
          permissionsChange: -16.37,
          alertsChange: 1.07,
          notificationsChange: 62.4,
        },
        attendanceTrends: {
          lastThreeMonths: {
            dates: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
            datasets: {
              "November 2024": generateRandomData(31, 200, 500),
              "December 2024": generateRandomData(31, 200, 500),
              "Last Month": generateRandomData(31, 200, 500),
            },
          },
          weeklyOverview: {
            days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            hours: [360, 280, 310, 380, 270, 260, 0],
          },
        },
        recentActivity: generateRecentActivity(5),
        upcomingSessions: generateUpcomingSessions(3),
      };

      setDashboardData(mockData);
      setLoading(false);
    }, 1500);
  }, []);

  // Helper function to generate random data for charts
  function generateRandomData(
    length: number,
    min: number,
    max: number
  ): number[] {
    return Array.from({ length }, () =>
      Math.floor(Math.random() * (max - min + 1) + min)
    );
  }

  // Helper function to generate recent activity data
  function generateRecentActivity(count: number) {
    const actionTypes = [
      { type: "check-in", action: "checked in" },
      { type: "check-out", action: "checked out" },
      { type: "permission", action: "requested leave" },
      { type: "alert", action: "missed check-in" },
    ];

    return Array.from({ length: count }, (_, i) => {
      const actionType =
        actionTypes[Math.floor(Math.random() * actionTypes.length)];
      const minutesAgo = Math.floor(Math.random() * 120);

      return {
        id: `activity-${i}`,
        type: actionType.type,
        user: {
          name: `User ${i + 1}`,
          avatar:
            Math.random() > 0.5
              ? undefined
              : `https://randomuser.me/api/portraits/men/${i}.jpg`,
        },
        action: actionType.action,
        time: `${minutesAgo} minutes ago`,
      };
    });
  }

  // Helper function to generate upcoming sessions
  function generateUpcomingSessions(count: number) {
    const locations = [
      "Room A101",
      "Conference Hall B",
      "Main Office",
      "Remote",
    ];
    const sessionNames = [
      "Team Meeting",
      "Project Review",
      "Training Session",
      "Client Presentation",
      "Department Briefing",
    ];

    return Array.from({ length: count }, (_, i) => {
      const hoursFromNow = Math.floor(Math.random() * 48) + 1;

      return {
        id: `session-${i}`,
        title: sessionNames[Math.floor(Math.random() * sessionNames.length)],
        time: `in ${hoursFromNow} hours`,
        location: locations[Math.floor(Math.random() * locations.length)],
        attendees: Math.floor(Math.random() * 30) + 10,
      };
    });
  }

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const statCards: StatCardData[] = dashboardData
    ? [
        {
          title: "Total Employees",
          value: dashboardData.stats.totalEmployees,
          change: dashboardData.stats.employeeChange,
          icon: (
            <Avatar.Icon
              size={48}
              icon="account-group"
              style={[
                styles.statIcon,
                { backgroundColor: "rgba(103, 58, 183, 0.1)" },
              ]}
              color="#673AB7"
            />
          ),
        },
        {
          title: "Permissions",
          value: dashboardData.stats.pendingPermissions,
          change: dashboardData.stats.permissionsChange,
          icon: (
            <Avatar.Icon
              size={48}
              icon="file-document-outline"
              style={[
                styles.statIcon,
                { backgroundColor: "rgba(233, 30, 99, 0.1)" },
              ]}
              color="#E91E63"
            />
          ),
        },
        {
          title: "System Alerts",
          value: dashboardData.stats.systemAlerts,
          change: dashboardData.stats.alertsChange,
          icon: (
            <Avatar.Icon
              size={48}
              icon="alert-circle-outline"
              style={[
                styles.statIcon,
                { backgroundColor: "rgba(255, 152, 0, 0.1)" },
              ]}
              color="#FF9800"
            />
          ),
        },
        {
          title: "Notifications",
          value: dashboardData.stats.notifications,
          change: dashboardData.stats.notificationsChange,
          icon: (
            <Avatar.Icon
              size={48}
              icon="bell-outline"
              style={[
                styles.statIcon,
                { backgroundColor: "rgba(33, 150, 243, 0.1)" },
              ]}
              color="#2196F3"
            />
          ),
        },
      ]
    : [];

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      strokeWidth: 1,
      stroke: "rgba(0, 0, 0, 0.1)",
    },
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "check-in":
        return (
          <MaterialCommunityIcons name="login" size={24} color="#4CAF50" />
        );
      case "check-out":
        return (
          <MaterialCommunityIcons name="logout" size={24} color="#2196F3" />
        );
      case "permission":
        return <FontAwesome5 name="calendar-alt" size={20} color="#673AB7" />;
      case "alert":
        return <Ionicons name="warning" size={24} color="#FF9800" />;
      default:
        return <Ionicons name="ellipse" size={24} color="gray" />;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading dashboard data...</Text>
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error loading dashboard data.</Text>
      </View>
    );
  }

  const monthlyData = {
    labels: dashboardData.attendanceTrends.lastThreeMonths.dates.filter(
      (_, i) => i % 5 === 0
    ), // Show fewer labels
    datasets: [
      {
        data: dashboardData.attendanceTrends.lastThreeMonths.datasets[
          "November 2024"
        ],
        color: (opacity = 1) => `rgba(103, 58, 183, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: dashboardData.attendanceTrends.lastThreeMonths.datasets[
          "December 2024"
        ],
        color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: dashboardData.attendanceTrends.lastThreeMonths.datasets[
          "Last Month"
        ],
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["November 2024", "December 2024", "Last Month"],
  };

  const weeklyData = {
    labels: dashboardData.attendanceTrends.weeklyOverview.days,
    datasets: [
      {
        data: dashboardData.attendanceTrends.weeklyOverview.hours,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Sidebar
        isVisible={sidebarVisible}
        activePage={activePage}
        onPageChange={setActivePage}
      />

      <View
        style={[
          styles.content,
          { width: sidebarVisible ? "calc(100% - 280px)" : "100%" },
        ]}
      >
        <Header toggleSidebar={toggleSidebar} />

        <ScrollView style={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.pageTitle}>Dashboard Overview</Text>
              <View style={styles.headerActions}>
                <Button
                  mode="contained"
                  icon="file-download-outline"
                  style={styles.exportButton}
                  onPress={() => console.log("Export report")}
                >
                  Export Report
                </Button>
              </View>
            </View>

            {/* Stat Cards */}
            <View style={styles.statCardsContainer}>
              {statCards.map((card, index) => (
                <Card key={index} style={styles.statCard}>
                  <LinearGradient
                    colors={["rgba(255,255,255,0.8)", "rgba(255,255,255,0.6)"]}
                    style={styles.cardGradient}
                  >
                    <Card.Content style={styles.statCardContent}>
                      <View style={styles.statTextContainer}>
                        <Text style={styles.statTitle}>{card.title}</Text>
                        <Text style={styles.statValue}>{card.value}</Text>
                        <View style={styles.statChangeContainer}>
                          <Text
                            style={[
                              styles.statChangeText,
                              {
                                color: card.change >= 0 ? "#4CAF50" : "#F44336",
                              },
                            ]}
                          >
                            {card.change >= 0 ? "↑" : "↓"}{" "}
                            {Math.abs(card.change).toFixed(2)}%
                          </Text>
                        </View>
                      </View>
                      {card.icon}
                    </Card.Content>
                  </LinearGradient>
                </Card>
              ))}
            </View>

            {/* Attendance Trends */}
            <Card style={styles.chartCard}>
              <Card.Content>
                <View style={styles.chartHeaderRow}>
                  <Text style={styles.chartTitle}>Attendance Trends</Text>
                  <View style={styles.chartPeriodSelector}>
                    <TouchableOpacity
                      style={[
                        styles.periodButton,
                        activeChartPeriod === "day" &&
                          styles.activePeriodButton,
                      ]}
                      onPress={() => setActiveChartPeriod("day")}
                    >
                      <Text
                        style={[
                          styles.periodButtonText,
                          activeChartPeriod === "day" &&
                            styles.activePeriodButtonText,
                        ]}
                      >
                        Day
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.periodButton,
                        activeChartPeriod === "week" &&
                          styles.activePeriodButton,
                      ]}
                      onPress={() => setActiveChartPeriod("week")}
                    >
                      <Text
                        style={[
                          styles.periodButtonText,
                          activeChartPeriod === "week" &&
                            styles.activePeriodButtonText,
                        ]}
                      >
                        Week
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.periodButton,
                        activeChartPeriod === "month" &&
                          styles.activePeriodButton,
                      ]}
                      onPress={() => setActiveChartPeriod("month")}
                    >
                      <Text
                        style={[
                          styles.periodButtonText,
                          activeChartPeriod === "month" &&
                            styles.activePeriodButtonText,
                        ]}
                      >
                        Month
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <LineChart
                    data={monthlyData}
                    width={Math.max(screenWidth, 600)}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                  />
                </ScrollView>

                <View style={styles.chartLegend}>
                  {monthlyData.legend.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          {
                            backgroundColor:
                              monthlyData.datasets[index].color(1),
                          },
                        ]}
                      />
                      <Text style={styles.legendText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </Card.Content>
            </Card>

            {/* Weekly Hours Report */}
            <Card style={[styles.chartCard, styles.weeklyHoursCard]}>
              <Card.Content>
                <Text style={styles.chartTitle}>Weekly Hours Report</Text>
                <BarChart
                  data={weeklyData}
                  width={screenWidth}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => `rgba(103, 58, 183, ${opacity})`,
                  }}
                  style={styles.chart}
                  verticalLabelRotation={0}
                  showValuesOnTopOfBars
                />
              </Card.Content>
            </Card>

            <View style={styles.bottomRowContainer}>
              {/* Recent Activity */}
              <Card style={styles.activityCard}>
                <Card.Content>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <IconButton
                      icon="dots-horizontal"
                      size={20}
                      onPress={() => console.log("View all activities")}
                    />
                  </View>

                  {dashboardData.recentActivity.map((activity, index) => (
                    <View key={activity.id}>
                      <View style={styles.activityItem}>
                        <View style={styles.activityIconContainer}>
                          {getActivityIcon(activity.type)}
                        </View>
                        <View style={styles.activityContent}>
                          <Text style={styles.activityText}>
                            <Text style={styles.userName}>
                              {activity.user.name}
                            </Text>{" "}
                            {activity.action}
                          </Text>
                          <Text style={styles.activityTime}>
                            {activity.time}
                          </Text>
                        </View>
                      </View>
                      {index < dashboardData.recentActivity.length - 1 && (
                        <Divider style={styles.divider} />
                      )}
                    </View>
                  ))}

                  <Button
                    mode="text"
                    onPress={() => console.log("View all activities")}
                    style={styles.viewAllButton}
                  >
                    View All Activities
                  </Button>
                </Card.Content>
              </Card>

              {/* Upcoming Sessions */}
              <Card style={styles.sessionsCard}>
                <Card.Content>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
                    <IconButton
                      icon="plus"
                      size={20}
                      onPress={() => console.log("Add new session")}
                    />
                  </View>

                  {dashboardData.upcomingSessions.map((session, index) => (
                    <View key={session.id}>
                      <View style={styles.sessionItem}>
                        <View style={styles.sessionTimeContainer}>
                          <Text style={styles.sessionTimeLarge}>
                            {session.time.split(" ")[1]}
                          </Text>
                          <Text style={styles.sessionTimeUnit}>
                            {session.time.split(" ")[0]}
                          </Text>
                        </View>
                        <View style={styles.sessionContent}>
                          <Text style={styles.sessionTitle}>
                            {session.title}
                          </Text>
                          <View style={styles.sessionDetails}>
                            <View style={styles.sessionDetailItem}>
                              <Ionicons
                                name="location-outline"
                                size={14}
                                color={theme.colors.primary}
                              />
                              <Text style={styles.sessionDetailText}>
                                {session.location}
                              </Text>
                            </View>
                            <View style={styles.sessionDetailItem}>
                              <Ionicons
                                name="people-outline"
                                size={14}
                                color={theme.colors.primary}
                              />
                              <Text style={styles.sessionDetailText}>
                                {session.attendees} attendees
                              </Text>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity style={styles.sessionActionButton}>
                          <Ionicons
                            name="chevron-forward"
                            size={24}
                            color="#9E9E9E"
                          />
                        </TouchableOpacity>
                      </View>
                      {index < dashboardData.upcomingSessions.length - 1 && (
                        <Divider style={styles.divider} />
                      )}
                    </View>
                  ))}

                  <Button
                    mode="outlined"
                    onPress={() => console.log("View all sessions")}
                    style={styles.viewAllButton}
                    icon="calendar"
                  >
                    View Calendar
                  </Button>
                </Card.Content>
              </Card>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F5F7FA",
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  headerActions: {
    flexDirection: "row",
  },
  exportButton: {
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  statCard: {
    width: "23.5%",
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    overflow: "hidden",
  },
  cardGradient: {
    borderRadius: 12,
  },
  statCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 24,
  },
  statTextContainer: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statChangeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statChangeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statIcon: {
    borderRadius: 12,
  },
  chartCard: {
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
  },
  weeklyHoursCard: {
    marginBottom: 24,
  },
  chartHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  chartPeriodSelector: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    padding: 4,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activePeriodButton: {
    backgroundColor: "#2196F3",
  },
  periodButtonText: {
    fontSize: 14,
    color: "#757575",
  },
  activePeriodButtonText: {
    color: "white",
    fontWeight: "500",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#757575",
  },
  bottomRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activityCard: {
    flex: 1,
    marginRight: 12,
    borderRadius: 12,
    elevation: 2,
  },
  sessionsCard: {
    flex: 1,
    marginLeft: 12,
    borderRadius: 12,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    marginBottom: 4,
  },
  userName: {
    fontWeight: "500",
  },
  activityTime: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  sessionTimeContainer: {
    alignItems: "center",
    marginRight: 16,
    minWidth: 50,
  },
  sessionTimeLarge: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sessionTimeUnit: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  sessionContent: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  sessionDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sessionDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  sessionDetailText: {
    fontSize: 12,
    color: "#757575",
    marginLeft: 4,
  },
  sessionActionButton: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  viewAllButton: {
    marginTop: 16,
  },
});

export default Dashboard;
