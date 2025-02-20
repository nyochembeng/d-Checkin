import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="register-biometrics" />
      <Stack.Screen name="biometric-authentication" />
      <Stack.Screen name="authentication-successful" />
      <Stack.Screen name="check-in-out" />
    </Stack>
  );
}
