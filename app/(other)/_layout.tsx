import { Stack } from 'expo-router';

export default function MoreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="report-issue" />
    </Stack>
  );
}
