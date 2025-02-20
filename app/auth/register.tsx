import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { TextInput, Button, HelperText, RadioButton } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { Text } from "@/components/utils/Text";
import { useTheme } from "@/lib/hooks/useTheme";
import { router } from "expo-router";

export default function Register() {
  const theme = useTheme();
  const [secureText, setSecureText] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);
  const [institutionType, setInstitutionType] = useState<"school" | "company">(
    "school"
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      institutionName: "",
      institutionEmail: "",
      institutionPhone: "",
      address: "",
      zipCode: "",
      adminUsername: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = (data: any) => {
    console.log("Registration Data:", data);
    router.navigate("/dashboard");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View
          style={[
            styles.innerContainer,
            { backgroundColor: theme.colors.cards },
          ]}
        >
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: theme.colors.foreground }]}
          >
            Register Institution
          </Text>

          {/* Institution Type Selection */}
          <Text style={{ marginBottom: 8, color: theme.colors.foreground }}>
            Select Institution Type:
          </Text>
          <View style={styles.radioGroup}>
            <RadioButton.Group
              onValueChange={(value) =>
                setInstitutionType(value as "school" | "company")
              }
              value={institutionType}
            >
              <View style={styles.radioOption}>
                <RadioButton value="school" />
                <Text>School</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="company" />
                <Text>Company</Text>
              </View>
            </RadioButton.Group>
          </View>

          {/* Institution Name */}
          <Controller
            control={control}
            rules={{ required: "Institution Name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Institution Name"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.institutionName}
                style={styles.input}
              />
            )}
            name="institutionName"
          />
          {errors.institutionName && (
            <HelperText type="error">
              {errors.institutionName.message}
            </HelperText>
          )}

          {/* Institution Email */}
          <Controller
            control={control}
            rules={{
              required: "Institution Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter a valid email address",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Institution Email"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.institutionEmail}
                style={styles.input}
                keyboardType="email-address"
              />
            )}
            name="institutionEmail"
          />
          {errors.institutionEmail && (
            <HelperText type="error">
              {errors.institutionEmail.message}
            </HelperText>
          )}

          {/* Institution Phone Contact */}
          <Controller
            control={control}
            rules={{
              required: "Institution Phone Contact is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Enter a valid phone number",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Institution Phone"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.institutionPhone}
                style={styles.input}
                keyboardType="phone-pad"
              />
            )}
            name="institutionPhone"
          />
          {errors.institutionPhone && (
            <HelperText type="error">
              {errors.institutionPhone.message}
            </HelperText>
          )}

          {/* Address */}
          <Controller
            control={control}
            rules={{ required: "Address is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Address"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.address}
                style={styles.input}
              />
            )}
            name="address"
          />
          {errors.address && (
            <HelperText type="error">{errors.address.message}</HelperText>
          )}

          {/* ZIP/Postal Code */}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="ZIP/Postal Code"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                keyboardType="numeric"
              />
            )}
            name="zipCode"
          />

          {/* Admin Username */}
          <Controller
            control={control}
            rules={{ required: "Admin Username is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Admin Username"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.adminUsername}
                style={styles.input}
              />
            )}
            name="adminUsername"
          />
          {errors.adminUsername && (
            <HelperText type="error">{errors.adminUsername.message}</HelperText>
          )}

          {/* Password */}
          <Controller
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry={secureText}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.password}
                right={
                  <TextInput.Icon
                    icon={secureText ? "eye-off" : "eye"}
                    onPress={() => setSecureText(!secureText)}
                  />
                }
                style={styles.input}
              />
            )}
            name="password"
          />
          {errors.password && (
            <HelperText type="error">{errors.password.message}</HelperText>
          )}

          {/* Confirm Password */}
          <Controller
            control={control}
            rules={{
              required: "Confirm Password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Confirm Password"
                mode="outlined"
                secureTextEntry={secureTextConfirm}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.confirmPassword}
                right={
                  <TextInput.Icon
                    icon={secureTextConfirm ? "eye-off" : "eye"}
                    onPress={() => setSecureTextConfirm(!secureTextConfirm)}
                  />
                }
                style={styles.input}
              />
            )}
            name="confirmPassword"
          />
          {errors.confirmPassword && (
            <HelperText type="error">
              {errors.confirmPassword.message}
            </HelperText>
          )}

          {/* Agree to Terms */}
          <Text style={[styles.text, { color: theme.colors.foreground }]}>
            By proceeding, you agree to our{" "}
            <Text style={[styles.link, { color: theme.colors.primary }]}>
              Terms and Conditions
            </Text>{" "}
            and{" "}
            <Text style={[styles.link, { color: theme.colors.primary }]}>
              Privacy Policy
            </Text>
            .
          </Text>

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
          >
            Register
          </Button>

          {/* Login */}
          <Text style={[styles.text, { color: theme.colors.foreground }]}>
            Already have an account?{" "}
            <Text
              style={[styles.link, { color: theme.colors.primary }]}
              onPress={() => router.navigate("/auth/login")}
            >
              Login
            </Text>
            .
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  innerContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
  },
  text: {
    marginTop: 15,
    textAlign: "center",
  },
  link: {
    textDecorationLine: "underline",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    fontSize: 12,
    marginBottom: 10,
  },
});
