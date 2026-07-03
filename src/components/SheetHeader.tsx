import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import COLORS from '../constants/colors';

interface SheetHeaderProps {
  title: string;
  onClose: () => void;
  onBack?: () => void;
}

export default function SheetHeader({ title, onClose, onBack }: SheetHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.dragIndicator} />

      <View style={styles.titleRow}>
        <View style={styles.sideContainer}>
          {onBack ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backIcon}>{'‹'}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.sideSpacer} />
          )}
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.sideContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background.primary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.text.disabled,
    alignSelf: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  sideContainer: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideSpacer: {
    width: 32,
    height: 32,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text.primary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: COLORS.ui.tintBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 16,
    color: COLORS.accent.gold,
    fontWeight: '700',
    marginTop: -1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: COLORS.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.secondary,
  },
});
