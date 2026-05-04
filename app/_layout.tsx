import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/themeContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="cadastro" />
          <Stack.Screen name="home" />
          <Stack.Screen name="resultado" />
          <Stack.Screen name="fila" />
          <Stack.Screen name="viagem" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}