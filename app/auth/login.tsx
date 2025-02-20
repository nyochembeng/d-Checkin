import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { Text } from "@/components/utils/Text";
import { router } from "expo-router";
import { useTheme } from "@/lib/hooks/useTheme";

export default function Login() {
  const theme = useTheme();
  const [secureText, setSecureText] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Login Data:", data);
    router.navigate("/auth/register-biometrics");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[styles.innerContainer, { backgroundColor: theme.colors.cards }]}
      >
        <Text
          variant="headlineMedium"
          style={[styles.title, { color: theme.colors.foreground }]}
        >
          Login
        </Text>

        {/* Username Input */}
        <Controller
          control={control}
          rules={{ required: "Username is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Username"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.username}
              style={styles.input}
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          )}
          name="username"
        />
        {errors.username && (
          <Text style={[styles.errorText, { color: theme.colors.danger }]}>
            {errors.username.message}
          </Text>
        )}

        {/* Password Input */}
        <Controller
          control={control}
          rules={{ required: "Password is required" }}
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
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text style={[styles.errorText, { color: theme.colors.danger }]}>
            {errors.password.message}
          </Text>
        )}

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        >
          Login
        </Button>

        {/* Forgot Password Link */}
        <Text
          style={[styles.forgotPassword, { color: theme.colors.primary }]}
          onPress={() => console.log("Forgot Password?")}
        >
          Forgot Password?
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
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
  forgotPassword: {
    marginTop: 15,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  errorText: {
    fontSize: 12,
    marginBottom: 10,
  },
});
