import { Stack } from 'expo-router';

export default function MoreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="more" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="apply-permission" />
      <Stack.Screen name="about" />
    </Stack>
  );
}
