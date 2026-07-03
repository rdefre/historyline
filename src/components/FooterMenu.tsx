import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../constants/colors';
import { AudioManager } from '../utils/audioManager';
import { useViewContext } from '../context/ViewContext';

// Usar emojis em vez de ícones
const icons = {
  job: '💼',
  assets: '💰',
  age: '➕',
  relations: '👥',
  activities: '⚡',
};

interface FooterMenuProps {
  handleAgeUp: () => void;
}

export default function FooterMenu({ handleAgeUp }: FooterMenuProps) {
  const { currentView, setCurrentView } = useViewContext();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleAgeAndGoToDashboard = () => {
    setCurrentView('DASHBOARD');
    handleAgeUp();
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 180,
      friction: 6,
    }).start();
  };

  return (
    <View style={styles.footerWrapper}>
      {/* AGE BUTTON — Floating above the tab bar */}
      <Animated.View style={[styles.centralButton, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.centralButtonInner}
        onPress={handleAgeAndGoToDashboard}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Text style={styles.centralIcon}>{icons.age}</Text>
        <Text style={styles.centralLabel}>IDADE</Text>
      </TouchableOpacity>
      </Animated.View>

      {/* TAB BAR */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.menuButton, currentView === 'OCCUPATION' && styles.menuButtonActive]}
          onPress={() => { AudioManager.click(); setCurrentView('OCCUPATION'); }}
        >
          <Text style={styles.menuIcon}>{icons.job}</Text>
          <Text style={styles.menuLabel}>Ocupação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, currentView === 'ASSETS' && styles.menuButtonActive]}
          onPress={() => { AudioManager.click(); setCurrentView('ASSETS'); }}
        >
          <Text style={styles.menuIcon}>{icons.assets}</Text>
          <Text style={styles.menuLabel}>Posses</Text>
        </TouchableOpacity>

        {/* Spacer for the floating button */}
        <View style={styles.centralSpacer} />

        <TouchableOpacity
          style={[styles.menuButton, currentView === 'RELATIONSHIPS' && styles.menuButtonActive]}
          onPress={() => { AudioManager.click(); setCurrentView('RELATIONSHIPS'); }}
        >
          <Text style={styles.menuIcon}>{icons.relations}</Text>
          <Text style={styles.menuLabel}>Relações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, currentView === 'ACTIVITIES' && styles.menuButtonActive]}
          onPress={() => { AudioManager.click(); setCurrentView('ACTIVITIES'); }}
        >
          <Text style={styles.menuIcon}>{icons.activities}</Text>
          <Text style={styles.menuLabel}>Atividades</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingBottom: 22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: COLORS.ui.shadow,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  menuButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 2,
  },
  menuButtonActive: {
    backgroundColor: COLORS.ui.tintBlue,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  centralSpacer: {
    width: 76,
  },
  centralButton: {
    position: 'absolute',
    top: -22,
    zIndex: 10,
    width: 76,
    height: 76,
    borderRadius: 999,
    shadowColor: COLORS.ui.pillGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 12,
  },
  centralButtonInner: {
    width: 76,
    height: 76,
    borderRadius: 999,
    backgroundColor: COLORS.ui.pillGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.background.secondary,
  },
  centralIcon: {
    fontSize: 26,
  },
  centralLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 1,
  },
});

