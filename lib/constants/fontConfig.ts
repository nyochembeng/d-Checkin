import { Platform } from "react-native";
import type { MD3Type } from "react-native-paper/lib/typescript/types";

const fontConfig: Record<string, MD3Type> = {
  customVariant: {
    fontFamily: Platform.select({
      web: "Inter, sans-serif",
      ios: "Inter",
      android: "Inter-Light",
      default: "sans-serif",
    }),
    fontWeight: "300",
    letterSpacing: 0.5,
    lineHeight: 22,
    fontSize: 16,
  },
  displayLarge: {
    fontFamily: Platform.select({
      web: "Poppins, sans-serif",
      ios: "Poppins",
      android: "Poppins-Bold",
      default: "sans-serif",
    }),
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 32,
    fontSize: 24,
  },
  displayMedium: {
    fontFamily: Platform.select({
      web: "Poppins, sans-serif",
      ios: "Poppins",
      android: "Poppins-SemiBold",
      default: "sans-serif",
    }),
    fontWeight: "600",
    letterSpacing: 0.5,
    lineHeight: 28,
    fontSize: 20,
  },
  bodyLarge: {
    fontFamily: Platform.select({
      web: "Inter, sans-serif",
      ios: "Inter",
      android: "Inter-Regular",
      default: "sans-serif",
    }),
    fontWeight: "400",
    letterSpacing: 0.5,
    lineHeight: 24,
    fontSize: 18,
  },
  bodyMedium: {
    fontFamily: Platform.select({
      web: "Inter, sans-serif",
      ios: "Inter",
      android: "Inter-Medium",
      default: "sans-serif",
    }),
    fontWeight: "500",
    letterSpacing: 0.5,
    lineHeight: 22,
    fontSize: 16,
  },
  bodySmall: {
    fontFamily: Platform.select({
      web: "Inter, sans-serif",
      ios: "Inter",
      android: "Inter-Light",
      default: "sans-serif",
    }),
    fontWeight: "300",
    letterSpacing: 0.5,
    lineHeight: 20,
    fontSize: 14,
  },
  titleLarge: {
    fontFamily: Platform.select({
      web: "Poppins, sans-serif",
      ios: "Poppins",
      android: "Poppins-SemiBold",
      default: "sans-serif",
    }),
    fontWeight: "600",
    letterSpacing: 0.5,
    lineHeight: 28,
    fontSize: 20,
  },
};

export default fontConfig;
