import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from "../context/themeContext";
export default function Resultado() {
  const { andarDestino, andarAtual } = useLocalSearchParams();
  const router = useRouter();
  const { backgroundColor, textColor, buttonColor } = useContext(ThemeContext); 

  const origem = Number(andarAtual);
  const destino = Number(andarDestino);

  const elevadores = [
    { id: "A", andar: 0 },
    { id: "B", andar: 5 },
    { id: "C", andar: 10 },
    { id: "D", andar: 2 },
    { id: "E", andar: 8 },
    { id: "F", andar: 12 }
  ];

  const escolherElevador = () => {
    let melhor = elevadores[0];
    elevadores.forEach((e) => {
      if (Math.abs(e.andar - origem) < Math.abs(melhor.andar - origem)) {
        melhor = e;
      }
    });
    return melhor;
  };

  const [elevador, setElevador] = useState('');
  const [piscar, setPiscar] = useState(true);
  const [andarElevador, setAndarElevador] = useState(0);
  const [chegou, setChegou] = useState(false);

  useEffect(() => {
    const escolhido = escolherElevador();
    setElevador(escolhido.id);
    setAndarElevador(escolhido.andar);

    const piscarInterval = setInterval(() => {
      setPiscar((prev) => !prev);
    }, 500);

    const movimento = setInterval(() => {
      setAndarElevador((prev) => {
        if (prev < origem) return prev + 1;
        if (prev > origem) return prev - 1;

        setChegou(true);
        clearInterval(movimento);
        return prev;
      });
    }, 800);

    return () => {
      clearInterval(piscarInterval);
      clearInterval(movimento);
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.titulo, { color: textColor }]}>Elevador chamado</Text>

      <View style={[styles.card, { borderColor: buttonColor }]}>
        <Text style={[styles.label, { color: textColor }]}>Elevador</Text>
        <Text style={[styles.valor, { color: textColor }]}>{elevador}</Text>

        <Text style={[styles.label, { color: textColor }]}>Destino</Text>
        <Text style={[styles.valor, { color: textColor }]}>{destino}º</Text>

        <Text style={[styles.label, { color: textColor }]}>Elevador está no andar</Text>
        <Text style={[styles.valor, { color: textColor }]}>{andarElevador}º</Text>

        <Text style={[styles.mensagem, { color: buttonColor, opacity: chegou ? 1 : piscar ? 1 : 0.3 }]}>
          {chegou
            ? "Chegou, pode entrar"
            : ` Elevador ${elevador} vindo do ${andarElevador}º andar`}
        </Text>

        <Text style={[styles.alerta, { color: "#ffaa00" }]}>
          Mantenha distância das portas{'\n'}
          Verifique o sentido do elevador
        </Text>

        {chegou && (
          <TouchableOpacity
            style={[styles.botaoEntrar, { backgroundColor: "#00cc66" }]}
            onPress={() =>
              router.push('/viagem?andarDestino=${destino}&andarAtual=${origem}')
            }
          >
            <Text style={[styles.botaoTexto, { color: textColor }]}>Entrar no elevador</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: buttonColor }]}
        onPress={() =>
          router.push('/fila?andarDestino=${destino}&andarAtual=${origem}&elevador=${elevador}')
        }
      >
        <Text style={[styles.botaoTexto, { color: textColor }]}>Ver fila</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botaoSecundario, { borderColor: buttonColor }]}
        onPress={() => router.replace('/home')}
      >
        <Text style={[styles.botaoTexto, { color: textColor }]}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 30 },
  card: { padding: 25, borderRadius: 16, alignItems: 'center', width: 260, borderWidth: 1, marginBottom: 25 },
  label: { fontSize: 14, marginTop: 10 },
  valor: { fontSize: 36, fontWeight: 'bold' },
  mensagem: { fontSize: 16, marginTop: 10, textAlign: 'center', fontWeight: 'bold' },
  alerta: { fontSize: 12, marginTop: 10, textAlign: 'center' },
  botao: { paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, marginBottom: 10 },
  botaoEntrar: { paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, marginTop: 15 },
  botaoSecundario: { borderWidth: 1, paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
  botaoTexto: { fontWeight: 'bold' }
});