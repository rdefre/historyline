import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import COLORS from '../constants/colors';
import type { Character, MarketItem } from '../types/game.types';

interface PossesViewProps {
  character: Character;
  currentMarketItems: MarketItem[];
  fixedMarketItems: MarketItem[];
  onBuyItem: (item: MarketItem, adjustedPrice: number, isFixed: boolean) => void;
  onConsumeItem: (item: MarketItem, index: number) => void;
  onSellItem: (item: MarketItem, index: number) => void;
  onEquipItem: (index: number) => void;
  onClose: () => void;
}

type Screen = 'MAIN' | 'INVENTORY' | 'FIXED_MARKET' | 'MARKET';

// ── Honor pricing helpers ─────────────────────────────────────────────────────

function getAdjustedPrice(basePrice: number, honor: number): number {
  if (honor >= 80) return Math.floor(basePrice * 0.8);
  if (honor <= 20) return Math.floor(basePrice * 1.2);
  return basePrice;
}

function priceTag(basePrice: number, honor: number) {
  if (honor >= 80) return { price: Math.floor(basePrice * 0.8), label: '↓ -20%', color: '#7ec8a4' };
  if (honor <= 20) return { price: Math.floor(basePrice * 1.2), label: '↑ +20%', color: '#e07070' };
  return { price: basePrice, label: '', color: '#1F2430' };
}

// ── Root component ────────────────────────────────────────────────────────────

export default function PossesView({
  character,
  currentMarketItems,
  fixedMarketItems,
  onBuyItem,
  onConsumeItem,
  onSellItem,
  onEquipItem,
  onClose,
}: PossesViewProps) {
  const [activeScreen, setActiveScreen] = useState<Screen>('MAIN');

  const slots = character.maxInventorySlots;
  const used  = character.inventory.length;

  if (activeScreen === 'INVENTORY') {
    return (
      <InventoryScreen
        character={character}
        onConsumeItem={(item, idx) => { onConsumeItem(item, idx); onClose(); }}
        onSellItem={onSellItem}
        onEquipItem={(idx) => { onEquipItem(idx); onClose(); }}
        onBack={() => setActiveScreen('MAIN')}
      />
    );
  }

  if (activeScreen === 'FIXED_MARKET') {
    return (
      <ShopScreen
        title="🏪 Mercado da Vila"
        subtitle="Aberto o ano todo. Estoque permanente."
        items={fixedMarketItems}
        character={character}
        isFixed={true}
        onBuyItem={(item, price, fixed) => { onBuyItem(item, price, fixed); onClose(); }}
        onBack={() => setActiveScreen('MAIN')}
      />
    );
  }

  if (activeScreen === 'MARKET') {
    return (
      <ShopScreen
        title="⛺ Caravana de Mercadores"
        subtitle="A caravana renova seu estoque todo ano."
        items={currentMarketItems}
        character={character}
        isFixed={false}
        onBuyItem={(item, price, fixed) => { onBuyItem(item, price, fixed); onClose(); }}
        onBack={() => setActiveScreen('MAIN')}
      />
    );
  }

  // ── MAIN MENU ──────────────────────────────────────────────────────────────
  return (
    <View style={styles.mainScreen}>
      <Text style={styles.mainTitle}>💰 Posses</Text>

      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuCard} activeOpacity={0.7} onPress={() => setActiveScreen('INVENTORY')}>
          <Text style={styles.menuLabel}>🎒 Meu Inventário ({used}/{slots})</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard} activeOpacity={0.7} onPress={() => setActiveScreen('FIXED_MARKET')}>
          <Text style={styles.menuLabel}>🏪 Mercado da Vila</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard} activeOpacity={0.7} onPress={() => setActiveScreen('MARKET')}>
          <Text style={styles.menuLabel}>⛺ Caravana de Mercadores</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Shared shop screen (handles both fixed and caravan market) ────────────────

function ShopScreen({
  title,
  subtitle,
  items,
  character,
  isFixed,
  onBuyItem,
  onBack,
}: {
  title: string;
  subtitle: string;
  items: MarketItem[];
  character: Character;
  isFixed: boolean;
  onBuyItem: (item: MarketItem, adjustedPrice: number, isFixed: boolean) => void;
  onBack: () => void;
}) {
  const honor  = character.honor;
  const isFull = character.inventory.length >= character.maxInventorySlots;

  const handleBuy = (item: MarketItem) => {
    const adjusted = getAdjustedPrice(item.price, honor);
    if (character.money < adjusted) {
      Alert.alert('Moedas insuficientes', `Você precisa de ${adjusted} 💰 mas tem apenas ${character.money} 💰.`);
      return;
    }
    onBuyItem(item, adjusted, isFixed);
  };

  const categories: { label: string; type: MarketItem['type'] }[] = [
    { label: '🍔 Consumíveis',         type: 'CONSUMABLE' },
    { label: '⚔️ Armas',              type: 'WEAPON'     },
    { label: '🛡️ Vestimentas',        type: 'ARMOR'      },
    { label: '🏠 Bens e Propriedades', type: 'ASSET'      },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent} nestedScrollEnabled>
      <BackButton onPress={onBack} />
      <Text style={styles.screenTitle}>{title}</Text>
      <Text style={styles.screenSub}>{subtitle}</Text>

      {items.length === 0 ? (
        <EmptyBox text="Nenhum item disponível esta temporada." />
      ) : (
        categories.map(({ label, type }) => {
          const filtered = items.filter(i => i.type === type);
          if (filtered.length === 0) return null;
          return (
            <View key={type}>
              <Text style={styles.groupLabel}>{label}</Text>
              {filtered.map((item) => {
                const pt = priceTag(item.price, honor);
                return (
                  <View key={item.id} style={styles.itemCard}>
                    <Text style={styles.itemEmoji}>{item.emoji}</Text>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemDesc}>{item.description}</Text>
                      {item.statModifiers && (
                        <Text style={styles.itemStats}>
                          {Object.entries(item.statModifiers)
                            .map(([k, v]) => `${statEmoji(k)} ${v! > 0 ? '+' : ''}${v}`)
                            .join('  ')}
                        </Text>
                      )}
                      {item.slotIncrease ? (
                        <Text style={styles.slotText}>🎒 +{item.slotIncrease} espaços</Text>
                      ) : null}
                      <View style={styles.metaRow}>
                        {item.upkeepCost ? <Text style={styles.upkeepText}>🔧 {item.upkeepCost}/ano</Text> : null}
                        {item.income     ? <Text style={styles.incomeText}>📈 +{item.income}/ano</Text>    : null}
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[styles.buyBtn, isFull && styles.buyBtnDisabled]}
                      onPress={() => handleBuy(item)}
                      disabled={isFull}
                    >
                      <Text style={[styles.buyBtnPrice, { color: pt.color }]}>{pt.price} 💰</Text>
                      {pt.label ? <Text style={[styles.buyBtnDiscount, { color: pt.color }]}>{pt.label}</Text> : null}
                      <Text style={styles.buyBtnLabel}>Comprar</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

// ── Inventory screen ──────────────────────────────────────────────────────────

function InventoryScreen({
  character,
  onConsumeItem,
  onSellItem,
  onEquipItem,
  onBack,
}: {
  character: Character;
  onConsumeItem: (item: MarketItem, idx: number) => void;
  onSellItem: (item: MarketItem, idx: number) => void;
  onEquipItem: (idx: number) => void;
  onBack: () => void;
}) {
  const slots  = character.maxInventorySlots;
  const used   = character.inventory.length;
  const isFull = used >= slots;

  const withIdx     = character.inventory.map((item, idx) => ({ item, idx }));
  const consumables = withIdx.filter(({ item }) => item.type === 'CONSUMABLE' || item.type === 'food');
  const weapons     = withIdx.filter(({ item }) => item.type === 'WEAPON');
  const armors      = withIdx.filter(({ item }) => item.type === 'ARMOR' || item.type === 'childhood');
  const assets      = withIdx.filter(({ item }) => item.type === 'ASSET');

  const sellPrice = (item: MarketItem) => item.price > 0 ? Math.floor(item.price / 2) : 1;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent} nestedScrollEnabled>
      <BackButton onPress={onBack} />
      <View style={styles.invHeader}>
        <Text style={styles.screenTitle}>🎒 Meu Inventário</Text>
        <View style={[styles.slotsBadge, isFull && styles.slotsBadgeFull]}>
          <Text style={[styles.slotsText, isFull && styles.slotsTextFull]}>{used}/{slots}</Text>
        </View>
      </View>

      {character.inventory.length === 0 && <EmptyBox text="Você não possui nenhum item." />}

      <InventorySection label="🍔 Consumíveis"        items={consumables} showEquip={false}  onConsume={onConsumeItem} onSell={onSellItem} onEquip={onEquipItem} sellPrice={sellPrice} />
      <InventorySection label="⚔️ Armas"              items={weapons}     showEquip={true}   equipLabel="⚔️ Equipar"  onConsume={onConsumeItem} onSell={onSellItem} onEquip={onEquipItem} sellPrice={sellPrice} />
      <InventorySection label="🛡️ Vestimentas"        items={armors}      showEquip={true}   equipLabel="🛡️ Vestir"   onConsume={onConsumeItem} onSell={onSellItem} onEquip={onEquipItem} sellPrice={sellPrice} />
      <InventorySection label="🏠 Bens e Propriedades" items={assets}      showEquip={false}  showIncome onConsume={onConsumeItem} onSell={onSellItem} onEquip={onEquipItem} sellPrice={sellPrice} />
    </ScrollView>
  );
}

// ── Inventory section ─────────────────────────────────────────────────────────

interface SectionProps {
  label: string;
  items: { item: MarketItem; idx: number }[];
  showEquip: boolean;
  equipLabel?: string;
  showIncome?: boolean;
  onConsume: (item: MarketItem, idx: number) => void;
  onSell: (item: MarketItem, idx: number) => void;
  onEquip: (idx: number) => void;
  sellPrice: (item: MarketItem) => number;
}

function InventorySection({ label, items, showEquip, equipLabel, showIncome, onConsume, onSell, onEquip, sellPrice }: SectionProps) {
  if (items.length === 0) return null;
  return (
    <>
      <Text style={styles.groupLabel}>{label}</Text>
      {items.map(({ item, idx }) => (
        <View key={`${item.id}-${idx}`} style={[styles.itemCard, item.isEquipped && styles.itemCardEquipped]}>
          <Text style={styles.itemEmoji}>{item.emoji || '📦'}</Text>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>
              {item.name}{item.quantity && item.quantity > 1 ? ` (x${item.quantity})` : ''}
            </Text>
            {item.description ? <Text style={styles.itemDesc}>{item.description}</Text> : null}
            {item.durability != null && item.maxDurability != null ? (
              <Text style={[styles.durabilityText, item.durability <= 1 && styles.durabilityLow]}>
                🔩 Durabilidade: {item.durability}/{item.maxDurability}
              </Text>
            ) : null}
            {item.statModifiers && (
              <Text style={styles.itemStats}>
                {Object.entries(item.statModifiers)
                  .map(([k, v]) => `${statEmoji(k)} ${v! > 0 ? '+' : ''}${v}`)
                  .join('  ')}
              </Text>
            )}
            {item.slotIncrease ? <Text style={styles.slotText}>🎒 +{item.slotIncrease} espaços</Text> : null}
            <View style={styles.metaRow}>
              {item.upkeepCost ? <Text style={styles.upkeepText}>🔧 {item.upkeepCost}/ano</Text> : null}
              {showIncome && item.income ? <Text style={styles.incomeText}>📈 +{item.income}/ano</Text> : null}
            </View>
            <View style={styles.actionRow}>
              {showEquip && (
                <TouchableOpacity style={item.isEquipped ? styles.equippedBtn : styles.equipBtn} onPress={() => onEquip(idx)}>
                  <Text style={item.isEquipped ? styles.equippedBtnText : styles.equipBtnText}>
                    {item.isEquipped ? '✅ Equipado' : (equipLabel ?? '⚔️ Equipar')}
                  </Text>
                </TouchableOpacity>
              )}
              {(item.type === 'CONSUMABLE' || item.type === 'food') && (
                <TouchableOpacity style={styles.useBtn} onPress={() => onConsume(item, idx)}>
                  <Text style={styles.useBtnText}>🍽️ Usar/Comer</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.sellBtn} onPress={() => onSell(item, idx)}>
                <Text style={styles.sellBtnText}>💰 Vender ({sellPrice(item)})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </>
  );
}

// ── Tiny shared components ────────────────────────────────────────────────────

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.backBtn} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.backBtnText}>‹ Voltar</Text>
    </TouchableOpacity>
  );
}

function EmptyBox({ text }: { text: string }) {
  return (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

function statEmoji(key: string): string {
  const map: Record<string, string> = { health: '❤️', strength: '💪', honor: '🛡️', faith: '⛪', money: '💰' };
  return map[key] ?? key;
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  mainScreen: { flex: 1, padding: 16 },
  mainTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.accent.gold, textAlign: 'center', marginBottom: 20 },
  menuGrid: { gap: 12 },
  menuCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 18,
    borderWidth: 1, borderColor: '#E7EBF2',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 4,
  },
  menuLabel: { fontSize: 18, fontWeight: '600', color: COLORS.text.primary },
  menuChevron: { fontSize: 24, color: COLORS.accent.gold, fontWeight: 'bold' },

  screen: { flex: 1, backgroundColor: COLORS.background.primary },
  screenContent: { padding: 16, paddingBottom: 40 },
  screenTitle: { fontSize: 20, fontWeight: '700', color: '#1F2430', marginBottom: 2 },
  screenSub: { fontSize: 12, color: '#7A8494', marginBottom: 12 },

  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, alignSelf: 'flex-start' },
  backBtnText: { fontSize: 16, color: COLORS.accent.gold, fontWeight: '600' },

  groupLabel: {
    fontSize: 13, fontWeight: '700', color: '#7A8494',
    marginTop: 14, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1,
  },

  invHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  slotsBadge: { backgroundColor: '#EDF0F5', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: '#E7EBF2' },
  slotsBadgeFull: { backgroundColor: '#4a1a1a', borderColor: '#c44' },
  slotsText: { color: '#7A8494', fontSize: 13, fontWeight: '700' },
  slotsTextFull: { color: '#f55' },

  emptyBox: { backgroundColor: '#EDF0F5', borderRadius: 10, padding: 16, alignItems: 'center', marginBottom: 8 },
  emptyText: { color: '#7A8494', fontSize: 13 },

  itemCard: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#222235',
    borderRadius: 12, padding: 12, marginBottom: 8, gap: 10,
  },
  itemCardEquipped: { borderWidth: 1, borderColor: '#7ec8a4', backgroundColor: '#1e2e26' },
  itemEmoji: { fontSize: 28, marginTop: 2 },
  itemInfo: { flex: 1 },
  itemName: { color: '#1F2430', fontSize: 14, fontWeight: '700' },
  itemDesc: { color: '#7A8494', fontSize: 12, marginTop: 2 },
  itemStats: { color: '#7ec8a4', fontSize: 11, marginTop: 4 },
  durabilityText: { color: '#7A8494', fontSize: 11, marginTop: 3 },
  durabilityLow: { color: '#e07070' },
  slotText: { color: '#a8c8ff', fontSize: 11, marginTop: 4 },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  upkeepText: { color: '#F59E0B', fontSize: 11 },
  incomeText: { color: '#7ec8a4', fontSize: 11 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },

  buyBtn: {
    backgroundColor: '#2a3e30', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10,
    alignItems: 'center', minWidth: 72, borderWidth: 1, borderColor: '#4a7c59',
  },
  buyBtnDisabled: { opacity: 0.4 },
  buyBtnPrice: { fontSize: 13, fontWeight: '800' },
  buyBtnDiscount: { fontSize: 10, fontWeight: '700' },
  buyBtnLabel: { color: '#7A8494', fontSize: 10, marginTop: 2 },

  useBtn: { backgroundColor: '#5c4a1e', borderRadius: 8, paddingVertical: 7, paddingHorizontal: 12, borderWidth: 1, borderColor: '#c9a84c' },
  useBtnText: { color: '#f0d080', fontSize: 12, fontWeight: '700' },

  equipBtn: { backgroundColor: '#1e2e3e', borderRadius: 8, paddingVertical: 7, paddingHorizontal: 12, borderWidth: 1, borderColor: '#5a8abf' },
  equipBtnText: { color: '#8ab8e8', fontSize: 12, fontWeight: '700' },
  equippedBtn: { backgroundColor: '#1e3028', borderRadius: 8, paddingVertical: 7, paddingHorizontal: 12, borderWidth: 1, borderColor: '#7ec8a4' },
  equippedBtnText: { color: '#7ec8a4', fontSize: 12, fontWeight: '700' },

  sellBtn: { backgroundColor: '#2e2e2e', borderRadius: 8, paddingVertical: 7, paddingHorizontal: 12, borderWidth: 1, borderColor: '#555' },
  sellBtnText: { color: '#7A8494', fontSize: 12, fontWeight: '600' },
});
