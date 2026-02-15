import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import COLORS from '../constants/colors';
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

  const handleAgeAndGoToDashboard = () => {
    setCurrentView('DASHBOARD');
    handleAgeUp();
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[styles.menuButton, currentView === 'OCCUPATION' && styles.menuButtonActive]}
        onPress={() => setCurrentView('OCCUPATION')}
      >
        <Text style={styles.menuIcon}>{icons.job}</Text>
        <Text style={styles.menuLabel}>Job</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuButton, currentView === 'ASSETS' && styles.menuButtonActive]}
        onPress={() => setCurrentView('ASSETS')}
      >
        <Text style={styles.menuIcon}>{icons.assets}</Text>
        <Text style={styles.menuLabel}>Assets</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.centralButton} onPress={handleAgeAndGoToDashboard}>
        <Text style={styles.centralIcon}>{icons.age}</Text>
        <Text style={styles.centralLabel}>AGE</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuButton, currentView === 'RELATIONSHIPS' && styles.menuButtonActive]}
        onPress={() => setCurrentView('RELATIONSHIPS')}
      >
        <Text style={styles.menuIcon}>{icons.relations}</Text>
        <Text style={styles.menuLabel}>Relations</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuButton, currentView === 'ACTIVITIES' && styles.menuButtonActive]}
        onPress={() => setCurrentView('ACTIVITIES')}
      >
        <Text style={styles.menuIcon}>{icons.activities}</Text>
        <Text style={styles.menuLabel}>Activities</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: COLORS.background.secondary,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.background.tertiary,
  },
  menuButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  menuButtonActive: {
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 8,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuLabel: {
    fontSize: 10,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  centralIcon: {
    fontSize: 28,
  },
  centralButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accent.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
    shadowColor: COLORS.accent.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  centralLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.background.primary,
    marginTop: 2,
  },
});
