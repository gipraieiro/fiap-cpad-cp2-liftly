import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { ThemeContext } from "../context/themeContext";
export default function Cadastro() {
  const router = useRouter();
  const { backgroundColor, textColor, buttonColor } = useContext(ThemeContext);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const salvar = async () => {
    const emailFormatado = email.trim().toLowerCase();

    if (!nome || !email || !senha || !confirmar) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    if (!emailFormatado.includes("@") || !emailFormatado.includes(".")) {
      Alert.alert("Erro", "Email inválido");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (senha !== confirmar) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    try {
      let usuarios = [];

      if (Platform.OS === "web") {
        const data = localStorage.getItem("usuarios");
        usuarios = data ? JSON.parse(data) : [];
      } else {
        const data = await AsyncStorage.getItem("usuarios");
        usuarios = data ? JSON.parse(data) : [];
      }

      const existe = usuarios.find((u) => u.email === emailFormatado);
      if (existe) {
        Alert.alert("Erro", "Este e-mail já está cadastrado");
        return;
      }

      const novoUsuario = { nome, email: emailFormatado, senha, tentativas: 0 };
      usuarios.push(novoUsuario);

      if (Platform.OS === "web") {
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
      } else {
        await AsyncStorage.setItem("usuarios", JSON.stringify(usuarios));
      }

      Alert.alert("Sucesso", "Cadastro realizado!");
      router.replace("/login");

    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Falha ao realizar o cadastro");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.titulo, { color: textColor }]}>Cadastro</Text>

      <TextInput
        style={[styles.input, { color: textColor, borderColor: buttonColor }]}
        placeholder="Nome"
        placeholderTextColor="#888"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={[styles.input, { color: textColor, borderColor: buttonColor }]}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={[styles.input, { color: textColor, borderColor: buttonColor }]}
        placeholder="Senha"
        placeholderTextColor="#888"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TextInput
        style={[styles.input, { color: textColor, borderColor: buttonColor }]}
        placeholder="Confirmar senha"
        placeholderTextColor="#888"
        secureTextEntry
        value={confirmar}
        onChangeText={setConfirmar}
      />

      <Pressable style={[styles.botao, { backgroundColor: buttonColor }]} onPress={salvar}>
        <Text style={[styles.botaoTexto, { color: textColor }]}>Cadastrar</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/login")}>
        <Text style={[styles.link, { color: buttonColor }]}>Já tenho conta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  titulo: { fontSize: 28, marginBottom: 30, fontWeight: "bold" },
  input: { width: 250, borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 20 },
  botao: { padding: 15, borderRadius: 10, width: 250, alignItems: "center", marginTop: 10 },
  botaoTexto: { fontWeight: "bold", fontSize: 16 },
  link: { marginTop: 20, fontSize: 14 }
});