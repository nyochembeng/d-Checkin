import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Button } from "react-native-paper";
import { Text } from "@/components/ui/Text";
import { router } from "expo-router";
import { Theme } from "@/lib/constants/Theme";

export default function RegisterBiometrics() {
  const [selectedMethod, setSelectedMethod] = useState<
    "fingerprint" | "face" | null
  >(null);

  const handleSelect = (method: "fingerprint" | "face") => {
    setSelectedMethod(method);
  };

  const handleProceed = () => {
    if (selectedMethod) {
      console.log(`Selected Biometric Method: ${selectedMethod}`);
      router.navigate("/auth/biometric-registration");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Register Biometrics
      </Text>
      <Text style={styles.subtitle}>
        Select your preferred authentication method
      </Text>

      <View style={styles.optionsContainer}>
        {/* Fingerprint Option */}
        <TouchableOpacity
          style={[
            styles.option,
            selectedMethod === "fingerprint" && styles.selectedOption,
          ]}
          onPress={() => handleSelect("fingerprint")}
        >
          <Image
            source={require("@/assets/images/Fingerprint.png")}
            style={styles.image}
          />
          <Text style={styles.optionText}>Fingerprint</Text>
        </TouchableOpacity>

        <Text style={styles.optionText}>- Or -</Text>

        {/* Facial Recognition Option */}
        <TouchableOpacity
          style={[
            styles.option,
            selectedMethod === "face" && styles.selectedOption,
          ]}
          onPress={() => handleSelect("face")}
        >
          <Image
            source={require("@/assets/images/Face-detection.png")}
            style={styles.image}
          />
          <Text style={styles.optionText}>Face Recognition</Text>
        </TouchableOpacity>
      </View>

      <Button
        mode="contained"
        onPress={handleProceed}
        style={styles.button}
        disabled={!selectedMethod}
      >
        Proceed
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: Theme.colors.foreground,
  },
  optionsContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginVertical: 30,
    gap: 20,
  },
  option: {
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: Theme.colors.cards,
    elevation: 3,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    shadowColor: Theme.colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  button: {
    width: "50%",
    marginTop: 20,
  },
});
