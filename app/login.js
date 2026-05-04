import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/themeContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const { backgroundColor, textColor, buttonColor } = useContext(ThemeContext); 
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");

  const handleLogin = async () => {
    let valid = true;

    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos");
      return;
    }

    if (!email.includes("@")) {
      setEmailError("Email inválido");
      valid = false;
    } else {
      setEmailError("");
    }

    if (senha.length < 6) {
      setSenhaError("A senha deve ter pelo menos 6 caracteres");
      valid = false;
    } else {
      setSenhaError("");
    }

    if (!valid) return;

    try {
      const data = await AsyncStorage.getItem("usuarios");

      if (!data) {
        Alert.alert("Erro", "Nenhum usuário cadastrado");
        return;
      }

      const usuarios = JSON.parse(data);
      const emailFormatado = email.trim().toLowerCase();

      const usuarioEncontrado = usuarios.find(
        (u) => u.email.trim().toLowerCase() === emailFormatado && u.senha === senha
      );

      if (usuarioEncontrado) {
        login(usuarioEncontrado);
        await AsyncStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
        router.replace("/home");
      } else {
        Alert.alert("Erro", "Email ou senha inválidos");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer login");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.titulo, { color: textColor }]}>Login</Text>

      <TextInput
        style={[styles.input, { color: textColor, borderColor: buttonColor }]}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      {emailError ? <Text style={[styles.error, { color: "#ff4444" }]}>{emailError}</Text> : null}

      <TextInput
        style={[styles.input, { color: textColor, borderColor: buttonColor }]}
        placeholder="Senha"
        placeholderTextColor="#888"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      {senhaError ? <Text style={[styles.error, { color: "#ff4444" }]}>{senhaError}</Text> : null}

      <TouchableOpacity style={[styles.botao, { backgroundColor: buttonColor }]} onPress={handleLogin}>
        <Text style={[styles.botaoTexto, { color: textColor }]}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/cadastro")}>
        <Text style={[styles.link, { color: buttonColor }]}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  titulo: { fontSize: 28, marginBottom: 30 },
  input: { width: 220, borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 5 },
  error: { fontSize: 12, marginBottom: 10, alignSelf: "flex-start", marginLeft: "15%" },
  botao: { padding: 12, borderRadius: 10, width: 220, alignItems: "center", marginTop: 10 },
  botaoTexto: { fontWeight: "bold" },
  link: { marginTop: 15 }
});