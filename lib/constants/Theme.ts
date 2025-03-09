import { Dimensions } from "react-native";
import { colors as Colors } from "./Colors";
import { useColorScheme } from "../hooks/useColorScheme";

const { width } = Dimensions.get("window");

export const getTheme = () => {
  const colorScheme = useColorScheme();

  return {
    colors: colorScheme === "dark" ? Colors.dark : Colors.light,
    fonts: {
      primary: "Inter, sans-serif",
      secondary: "Poppins, sans-serif",
    },
    fontSize: {
      xs: width * 0.03,
      sm: width * 0.035,
      md: width * 0.04,
      lg: width * 0.05,
      xl: width * 0.06,
    },
    borderRadius: {
      small: "4px",
      medium: "8px",
      large: "16px",
      full: "999px",
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
    },
    shadows: {
      soft: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      medium: "0px 4px 8px rgba(0, 0, 0, 0.15)",
      strong: "0px 8px 16px rgba(0, 0, 0, 0.2)",
    },
    opacity: {
      high: "0.9",
      medium: "0.6",
      low: "0.3",
      veryLow: "0.1",
    },
  };
};
