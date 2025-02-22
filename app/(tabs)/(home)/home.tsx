import { View } from "react-native";
import React from "react";
import { Header } from "@/components/utils/Header";
import EmployeePage from "@/components/pages/Employee";
import StudentPage from "@/components/pages/Student";

export default function Home() {
  return (
    <View style={{ flex: 1 }}>
      <Header title="Home" showNotification showBack />
      {/* <EmployeePage /> */}
      <StudentPage />
    </View>
  );
}
