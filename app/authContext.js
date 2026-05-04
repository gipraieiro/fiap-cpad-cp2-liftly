import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Carrega usuário salvo ao abrir o app para manter a sessão ativa
  useEffect(() => {
    async function carregarUsuario() {
      try {
        const data = await AsyncStorage.getItem("usuarioLogado");
        if (data) {
          setUser(JSON.parse(data));
        }
      } catch (error) {
        console.log("Erro ao carregar usuário:", error);
      }
    }
    carregarUsuario();
  }, []);

  // Login: recebe o objeto do usuário e salva no storage
  async function login(usuario) {
    try {
      setUser(usuario);
      await AsyncStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuario)
      );
    } catch (error) {
      console.log("Erro no login:", error);
    }
  }

  // Logout: limpa o estado e o storage
  async function logout() {
    try {
      setUser(null);
      await AsyncStorage.removeItem("usuarioLogado");
    } catch (error) {
      console.log("Erro no logout:", error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
