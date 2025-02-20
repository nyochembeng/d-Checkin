import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="register-biometrics" />
      <Stack.Screen name="biometric-registration" />
      <Stack.Screen name="registration-successful" />
    </Stack>
  );
}
