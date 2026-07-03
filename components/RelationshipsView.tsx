import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Child, Partner } from '@/constants/game-data';
import { HistoryLineTheme as T } from '@/constants/theme';

interface Props {
  partner?: Partner | null;
  children: Child[];
}

function NpcCard({ name, subtitle, isDead, emoji }: { name: string; subtitle: string; isDead?: boolean; emoji: string }) {
  return (
    <TouchableOpacity
      style={[styles.card, isDead && styles.cardDead]}
      activeOpacity={isDead ? 1 : 0.75}
      disabled={!!isDead}
    >
      <Text style={styles.cardEmoji}>{isDead ? '🪦' : emoji}</Text>
      <View style={styles.cardInfo}>
        <Text style={[styles.cardName, isDead && styles.nameDead]}>{name}</Text>
        <Text style={styles.cardSub}>{subtitle}</Text>
        {isDead && <Text style={styles.deceased}>Falecido(a)</Text>}
      </View>
    </TouchableOpacity>
  );
}

export function RelationshipsView({ partner, children }: Props) {
  const hasAny = !!partner || children.length > 0;

  return (
    <View style={styles.container}>
      {partner && (
        <>
          <Text style={styles.sectionTitle}>💍 Parceiro(a)</Text>
          <NpcCard
            name={partner.name}
            subtitle={`${partner.age} anos`}
            isDead={partner.isDead}
            emoji={partner.gender === 'male' ? '🧔' : '👩'}
          />
        </>
      )}

      {children.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>👶 Filhos</Text>
          {children.map(child => (
            <NpcCard
              key={child.id}
              name={child.name}
              subtitle={`${child.age} anos`}
              isDead={child.isDead}
              emoji={child.gender === 'male' ? '👦' : '👧'}
            />
          ))}
        </>
      )}

      {!hasAny && (
        <Text style={styles.empty}>Nenhuma relação ainda.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: T.gold,
    marginTop: 8,
    marginBottom: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.blueRoyal,
    borderRadius: 10,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardDead: {
    opacity: 0.55,
    borderColor: T.navyDark,
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: T.parchment,
  },
  nameDead: {
    textDecorationLine: 'line-through',
    color: T.gold,
  },
  cardSub: {
    fontSize: 12,
    color: T.gold,
    marginTop: 2,
  },
  deceased: {
    fontSize: 11,
    color: '#e74c3c',
    marginTop: 3,
    fontWeight: '600',
  },
  empty: {
    fontSize: 13,
    color: T.parchment,
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.6,
  },
});
