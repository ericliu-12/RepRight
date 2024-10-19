import React from "react";
import { Provider as PaperProvider } from "react-native-paper"; // Import PaperProvider
import { Stack } from "expo-router";
import { theme } from "./theme"; // Import your custom theme

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
      </Stack>
    </PaperProvider>
  );
}
