import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔥 Carregar usuário salvo ao abrir app
  useEffect(() => {
    async function carregar() {
      const data = await AsyncStorage.getItem("usuario");
      if (data) {
        setUser(JSON.parse(data));
      }
    }
    carregar();
  }, []);

  // 🔥 Login correto
  async function login(email) {
    const data = await AsyncStorage.getItem("usuario");

    if (!data) return false;

    const usuario = JSON.parse(data);

    if (usuario.email === email) {
      setUser(usuario); // ✅ agora é objeto
      return true;
    }

    return false;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}