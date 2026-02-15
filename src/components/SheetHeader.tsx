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
            {/* Drag Indicator */}
            <View style={styles.dragIndicator} />

            {/* Title Row */}
            <View style={styles.titleRow}>
                {/* Left Side: Back Button or Spacer */}
                <View style={styles.leftContainer}>
                    {onBack ? (
                        <TouchableOpacity style={styles.backButton} onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Text style={styles.backIcon}>‹</Text>
                            <Text style={styles.backText}>Voltar</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.spacer} />
                    )}
                </View>

                {/* Center: Title */}
                <Text style={styles.title} numberOfLines={1}>{title}</Text>

                {/* Right Side: Close Button */}
                <View style={styles.rightContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    dragIndicator: {
        width: 36,
        height: 5,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'center',
        marginBottom: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 44, // Standard iOS header height
    },
    leftContainer: {
        width: 80,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    rightContainer: {
        width: 80,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    spacer: {
        width: 80,
    },
    title: {
        flex: 1,
        fontSize: 17,
        fontWeight: '600',
        color: COLORS.text.primary,
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -8, // Compensate for padding to flush left
        paddingHorizontal: 8,
        height: 44,
    },
    backIcon: {
        fontSize: 28,
        color: COLORS.accent.gold, // iOS default blue -> Gold
        marginTop: -4,
        fontWeight: '300',
    },
    backText: {
        fontSize: 17,
        color: COLORS.accent.gold,
        marginLeft: 2,
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.secondary,
    },
});
