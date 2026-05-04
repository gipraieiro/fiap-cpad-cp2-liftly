import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from "../context/themeContext";

export default function Fila() {
  const { andarDestino, andarAtual, elevador } = useLocalSearchParams();
  const router = useRouter();
  const { backgroundColor, textColor, buttonColor } = useContext(ThemeContext); 

  const destino = Number(andarDestino) || 0;
  const inicio = Number(andarAtual) || 0;

  const [posicao, setPosicao] = useState(inicio);
  const [mensagem, setMensagem] = useState('');
  const [cor, setCor] = useState(buttonColor);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setPosicao((prev) => {
        if (prev === destino) {
          setMensagem('Chegada ao andar ${destino}');
          setCor('#00ff88');
          clearInterval(intervalo);
          return destino;
        }

        if (Math.abs(destino - prev) <= 2) {
          setMensagem('Elevador ${elevador} proximo');
          setCor('#ffaa00');
        } else {
          setMensagem('Elevador ${elevador} em movimento');
          setCor(buttonColor);
        }

        return destino > prev ? prev + 1 : prev - 1;
      });
    }, 1500);

    return () => clearInterval(intervalo);
  }, [destino, elevador]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.titulo, { color: textColor }]}>Fila do elevador</Text>

      <View style={[styles.card, { borderColor: buttonColor }]}>
        <Text style={[styles.label, { color: textColor }]}>Elevador</Text>
        <Text style={[styles.valor, { color: cor }]}>{elevador}</Text>

        <Text style={[styles.label, { color: textColor }]}>Destino</Text>
        <Text style={[styles.valor, { color: cor }]}>{destino}</Text>

        <Text style={[styles.label, { color: textColor }]}>Andar atual</Text>
        <Text style={[styles.valor, { color: cor }]}>{posicao}</Text>

        <Text style={[styles.mensagem, { color: cor }]}>{mensagem}</Text>
      </View>

      <TouchableOpacity style={[styles.botao, { backgroundColor: buttonColor }]} onPress={() => router.replace('/home')}>
        <Text style={[styles.botaoTexto, { color: textColor }]}>Solicitar outro elevador</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#111', padding: 25, borderRadius: 16, alignItems: 'center', width: 260, marginBottom: 25, borderWidth: 1 },
  label: { fontSize: 14, marginTop: 10 },
  valor: { fontSize: 36, fontWeight: 'bold' },
  mensagem: { fontSize: 14, textAlign: 'center', marginTop: 10 },
  botao: { paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
  botaoTexto: { fontWeight: 'bold' },
});