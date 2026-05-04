import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/themeContext";

export default function Home() {
  const [andarDestino, setAndarDestino] = useState("");
  const [andarAtual, setAndarAtual] = useState("");
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);
  const { backgroundColor, textColor, buttonColor } = useContext(ThemeContext); 

  const chamarElevador = () => {
    Keyboard.dismiss();

    if (!andarDestino || !andarAtual) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    if (andarDestino === andarAtual) {
      Alert.alert("Ops!", "Você já está nesse andar ");
      return;
    }

    router.push('/resultado?andarDestino=${andarDestino}&andarAtual=${andarAtual}');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.titulo, { color: textColor }]}>Liftly</Text>
        <Text style={[styles.usuario, { color: textColor }]}>
          Usuário: {user?.nome || user?.email}
        </Text>

        <TextInput
          style={[styles.input, { color: textColor, borderColor: buttonColor }]}
          placeholder="Andar de destino"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={andarDestino}
          onChangeText={(text) => setAndarDestino(text.replace(/[^0-9]/g, ""))}
        />

        <TextInput
          style={[styles.input, { color: textColor, borderColor: buttonColor }]}
          placeholder="Seu andar atual"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={andarAtual}
          onChangeText={(text) => setAndarAtual(text.replace(/[^0-9]/g, ""))}
        />

        <TouchableOpacity
          style={[styles.botao, { backgroundColor: buttonColor }, (!andarDestino || !andarAtual) && { opacity: 0.5 }]}
          disabled={!andarDestino || !andarAtual}
          onPress={chamarElevador}
        >
          <Text style={[styles.botaoTexto, { color: textColor }]}>Chamar elevador</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logout, { borderColor: buttonColor }]}
          onPress={() => {
            logout();
            router.replace("/login");
          }}
        >
          <Text style={[styles.logoutTexto, { color: textColor }]}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  titulo: { fontSize: 32, fontWeight: "bold", marginBottom: 5 },
  usuario: { marginBottom: 30, fontSize: 14 },
  input: { width: 250, borderWidth: 1, borderRadius: 10, padding: 15, marginBottom: 20, textAlign: "center", fontSize: 16 },
  botao: { padding: 15, borderRadius: 10, width: 250, alignItems: "center", marginBottom: 15 },
  botaoTexto: { fontWeight: "bold", fontSize: 16 },
  logout: { marginTop: 10, padding: 10, width: 250, alignItems: "center", borderWidth: 1, borderRadius: 10 },
  logoutTexto: { fontWeight: "500" }
});