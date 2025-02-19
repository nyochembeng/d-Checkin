import React, { createContext } from "react";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { Theme } from "../constants/Theme";
import { colors } from "../constants/Colors";
import {
  MD3LightTheme,
  MD3DarkTheme,
  configureFonts,
} from "react-native-paper";
import { PaperProvider } from "react-native-paper";
import fontConfig from "../constants/fontConfig";

export const ThemeContext = createContext(Theme);

const lightPaperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.light.primary,
    background: colors.light.background,
    text: colors.light.foreground,
  },
  fonts: configureFonts({ config: fontConfig }),
};

const darkPaperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.dark.primary,
    background: colors.dark.background,
    text: colors.dark.foreground,
  },
  fonts: configureFonts({ config: fontConfig }),
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();

  const appTheme = {
    ...Theme,
  };

  const paperTheme = colorScheme === "dark" ? darkPaperTheme : lightPaperTheme;

  return (
    <ThemeContext.Provider value={appTheme}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};
