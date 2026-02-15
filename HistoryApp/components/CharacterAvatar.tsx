import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';

export interface CharacterAvatarProps {
  age: number;
  health: number; // 0-100 (vitalidade/saúde)
  era: string; // 'tudor', 'victorian', 'medieval', etc.
  size?: number;
  style?: any;
}

/**
 * Mapeamento de imagens de avatar
 * Adicione seus arquivos PNG aqui conforme você os cria
 * 
 * Estrutura esperada de pastas:
 * assets/avatars/
 *   base/
 *     body-infant.png
 *     body-child.png
 *     body-teen.png
 *     body-adult.png
 *     body-middle.png
 *     body-elder.png
 *   clothes/
 *     clothes-tudor-infant.png
 *     clothes-tudor-child.png
 *     clothes-tudor-adult.png
 *     ... (outras eras)
 *   health/
 *     overlay-critical.png
 *     overlay-poor.png
 *   accessories/
 *     accessory-tudor.png
 *     ... (outras eras)
 */
const avatarAssets: Record<string, ImageSourcePropType> = {
  // Base - Corpos por idade
  // 'base-body-infant': require('../assets/avatars/base/body-infant.png'),
  // 'base-body-child': require('../assets/avatars/base/body-child.png'),
  // 'base-body-teen': require('../assets/avatars/base/body-teen.png'),
  // 'base-body-adult': require('../assets/avatars/base/body-adult.png'),
  // 'base-body-middle': require('../assets/avatars/base/body-middle.png'),
  // 'base-body-elder': require('../assets/avatars/base/body-elder.png'),

  // Roupas por era e idade
  // 'clothes-tudor-infant': require('../assets/avatars/clothes/clothes-tudor-infant.png'),
  // 'clothes-tudor-child': require('../assets/avatars/clothes/clothes-tudor-child.png'),
  // 'clothes-tudor-teen': require('../assets/avatars/clothes/clothes-tudor-teen.png'),
  // 'clothes-tudor-adult': require('../assets/avatars/clothes/clothes-tudor-adult.png'),
  // 'clothes-tudor-middle': require('../assets/avatars/clothes/clothes-tudor-middle.png'),
  // 'clothes-tudor-elder': require('../assets/avatars/clothes/clothes-tudor-elder.png'),

  // Overlays de saúde
  // 'health-overlay-critical': require('../assets/avatars/health/overlay-critical.png'),
  // 'health-overlay-poor': require('../assets/avatars/health/overlay-poor.png'),

  // Acessórios por era
  // 'accessory-tudor': require('../assets/avatars/accessories/accessory-tudor.png'),
};

/**
 * Componente que monta um avatar empilhando arquivos PNG transparentes
 * baseado nos atributos do personagem (idade, saúde, era)
 */
export default function CharacterAvatar({
  age,
  health,
  era,
  size = 100,
  style,
}: CharacterAvatarProps) {
  // Determina a faixa etária para escolher o corpo base
  const getAgeGroup = (age: number): string => {
    if (age < 3) return 'infant';
    if (age < 13) return 'child';
    if (age < 20) return 'teen';
    if (age < 40) return 'adult';
    if (age < 60) return 'middle';
    return 'elder';
  };

  // Determina o estado de saúde para overlay
  const getHealthState = (health: number): string => {
    if (health < 25) return 'critical';
    if (health < 50) return 'poor';
    if (health < 75) return 'fair';
    return 'good';
  };

  const ageGroup = getAgeGroup(age);
  const healthState = getHealthState(health);

  // Função auxiliar para obter a imagem do mapeamento
  const getImage = (key: string): ImageSourcePropType | null => {
    return avatarAssets[key] || null;
  };

  // Camadas do avatar (da base para o topo)
  const layers: Array<{ source: ImageSourcePropType; key: string }> = [];

  // 1. Corpo base (baseado na idade)
  const baseBodyKey = `base-body-${ageGroup}`;
  const baseBody = getImage(baseBodyKey);
  if (baseBody) {
    layers.push({ source: baseBody, key: 'base-body' });
  }

  // 2. Roupas (baseado na era e idade)
  const clothesKey = `clothes-${era}-${ageGroup}`;
  const clothes = getImage(clothesKey);
  if (clothes) {
    layers.push({ source: clothes, key: 'clothes' });
  }

  // 3. Overlay de saúde (opcional, apenas se saúde baixa)
  if (healthState === 'critical' || healthState === 'poor') {
    const healthOverlayKey = `health-overlay-${healthState}`;
    const healthOverlay = getImage(healthOverlayKey);
    if (healthOverlay) {
      layers.push({ source: healthOverlay, key: 'health-overlay' });
    }
  }

  // 4. Acessórios opcionais (baseado na era e idade)
  if (ageGroup === 'adult' || ageGroup === 'middle' || ageGroup === 'elder') {
    const accessoryKey = `accessory-${era}`;
    const accessory = getImage(accessoryKey);
    if (accessory) {
      layers.push({ source: accessory, key: 'accessory' });
    }
  }

  const containerStyle = [
    styles.container,
    { width: size, height: size },
    style,
  ];

  return (
    <View style={containerStyle}>
      {layers.length > 0 ? (
        layers.map((layer) => (
          <Image
            key={layer.key}
            source={layer.source}
            style={[styles.layer, { width: size, height: size }]}
            resizeMode="contain"
          />
        ))
      ) : (
        // Fallback: placeholder visual baseado na idade
        <View style={[styles.placeholder, { width: size, height: size }]}>
          <View style={[styles.placeholderCircle, { opacity: health / 100 }]} />
          <View style={styles.placeholderLabel}>
            {/* Mostra a idade como fallback */}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  placeholderCircle: {
    width: '60%',
    height: '60%',
    borderRadius: 50,
    backgroundColor: '#4a90e2',
  },
  placeholderLabel: {
    position: 'absolute',
    bottom: -20,
  },
});
