import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { Button } from "react-native-paper";
import { Text } from "@/components/utils/Text";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/lib/hooks/useTheme";

// Get device dimensions for responsive layout
const { width } = Dimensions.get("window");

type BiometricMethod = "fingerprint" | "face" | null;

export default function RegisterBiometrics() {
  const theme = useTheme();
  const [selectedMethod, setSelectedMethod] = useState<BiometricMethod>(null);

  const handleSelect = (method: "fingerprint" | "face") => {
    setSelectedMethod(method);
  };

  const handleProceed = () => {
    if (selectedMethod) {
      console.log(`Selected Biometric Method: ${selectedMethod}`);
      router.navigate("/auth/biometric-authentication");
    }
  };

  const renderMethodCard = (
    method: "fingerprint" | "face",
    icon: string,
    title: string,
    description: string
  ) => {
    const isSelected = selectedMethod === method;

    return (
      <TouchableOpacity
        style={[
          styles.methodCard,
          { backgroundColor: theme.colors.cards },
          isSelected && styles.selectedCard,
          isSelected && {
            borderColor: theme.colors.primary,
            backgroundColor: `${theme.colors.primary}10`,
          },
        ]}
        onPress={() => handleSelect(method)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${theme.colors.primary}15` },
            isSelected && { backgroundColor: theme.colors.primary },
          ]}
        >
          <MaterialCommunityIcons
            name={icon as any}
            size={32}
            color={isSelected ? theme.colors.background : theme.colors.primary}
          />
        </View>
        <View style={styles.methodTextContainer}>
          <Text
            style={[
              styles.methodTitle,
              { color: theme.colors.foreground },
              isSelected && { color: theme.colors.mutedForeground },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.methodDescription,
              { color: theme.colors.foreground },
            ]}
          >
            {description}
          </Text>
        </View>
        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <MaterialCommunityIcons
              name="check-circle"
              size={24}
              color={theme.colors.primary}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />

      <View style={styles.header}>
        <Text
          variant="headlineMedium"
          style={[styles.title, { color: theme.colors.foreground }]}
        >
          Biometric Setup
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.foreground }]}>
          Choose your preferred authentication method for quick and secure
          access
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {renderMethodCard(
          "fingerprint",
          "fingerprint",
          "Fingerprint",
          "Use your fingerprint for quick authentication"
        )}

        {renderMethodCard(
          "face",
          "face-recognition",
          "Face Recognition",
          "Use your face for contactless authentication"
        )}
      </View>

      <View
        style={[
          styles.securityNote,
          { backgroundColor: `${theme.colors.primary}10` },
        ]}
      >
        <MaterialCommunityIcons
          name="shield-check"
          size={18}
          color={theme.colors.primary}
        />
        <Text style={[styles.securityText, { color: theme.colors.foreground }]}>
          Your biometric data is securely encrypted and stored only on your
          device
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={handleProceed}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        disabled={!selectedMethod}
      >
        Continue
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  selectedCard: {
    borderWidth: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
  },
  checkmarkContainer: {
    marginLeft: 8,
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 32,
  },
  securityText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 4,
  },
});
