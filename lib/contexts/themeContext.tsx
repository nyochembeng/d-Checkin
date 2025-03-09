import React, { createContext } from "react";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { getTheme } from "../constants/Theme";
import { colors } from "../constants/Colors";
import {
  MD3LightTheme,
  MD3DarkTheme,
  configureFonts,
} from "react-native-paper";
import { PaperProvider } from "react-native-paper";
import FontConfig from "../constants/FontConfig";

export const ThemeContext = createContext(getTheme());

const createPaperTheme = (colorScheme: "light" | "dark") => ({
  ...(colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme),
  colors: {
    ...(colorScheme === "dark" ? MD3DarkTheme.colors : MD3LightTheme.colors),
    primary: colors[colorScheme].primary,
    background: colors[colorScheme].background,
    text: colors[colorScheme].foreground,
  },
  fonts: configureFonts({ config: FontConfig }),
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const appTheme = getTheme();
  const paperTheme = createPaperTheme(colorScheme);

  return (
    <ThemeContext.Provider value={appTheme}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};
