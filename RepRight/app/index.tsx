import React from "react";
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import HomeScreen from "./homescreen";
import { theme } from "./theme";

// const theme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: "#3498db", // Change primary color to blue
//     secondary: "#f1c40f", // Change secondary color to yellow
//     background: "#f2f2f2", // Light gray background
//     surface: "#ffffff", // White for cards or component backgrounds
//     onSurface: "#333333", // Dark text color on surfaces (e.g., cards)
//   },
// };

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <HomeScreen />
    </PaperProvider>
  );
}
