import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HistoryLineTheme as T } from '@/constants/theme';

export default function HistoriaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.emoji}>📜</Text>
        <Text style={styles.title}>História</Text>
        <Text style={styles.sub}>Em breve: linha do tempo da sua linhagem.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.navyDark,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: T.goldLight,
  },
  sub: {
    fontSize: 14,
    color: T.parchment,
    textAlign: 'center',
    opacity: 0.7,
  },
});
