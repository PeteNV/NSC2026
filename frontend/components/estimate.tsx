import { M3Button } from '@/components/test-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { theme } from '@/constants/theme';
import { StyleSheet, View, Text } from 'react-native';

export default function Estimate() {
    return (
        <ThemedView style={styles.usage}>
          <Text type="defaultSemiBold" style={{ color: theme.light.colors.onSurface }}>Usage</Text>
          <Text type="title" style={{ fontSize: 50, lineHeight: 55, color: theme.light.colors.onPrimaryContainer }}>~1,234 {''}
            <Text type="subtitle" style={{ fontSize: 20, color: theme.light.colors.onPrimaryContainer }}>kWh </Text>
          </Text>
          <Text type="subtitle" style={{color: theme.light.colors.secondary}}> +520 {''}
            <Text type="default" style={{ color: theme.light.colors.secondary }}>kWh from Base Estimation of 714 kWh </Text>
          </Text>
            <View style={{ backgroundColor: theme.light.colors.surfaceContainer, margin: 10, borderBottomWidth: 1, borderBottomColor: theme.light.colors.outline, marginHorizontal: 8 }} />
        <View style={styles.rows}>
            <View style={styles.month}>
                <Text type = "defaultSemiBold" style={{ color: theme.light.colors.secondary }}>Monthly Estimate</Text>
                <Text type = "defaultSemiBold" style={{ fontSize: 18, color: theme.light.colors.onPrimaryContainer }}>~2,159 Baht</Text>
            </View>
            <View style={styles.month}>
                <Text type = "defaultSemiBold" style={{ color: theme.light.colors.secondary }}>CO2 Footprint</Text>
                <Text type = "defaultSemiBold" style={{ fontSize: 18, color: theme.light.colors.onPrimaryContainer }}>14.79 kg</Text>
            </View>
        </View>
          <M3Button title="View Full Report" onPress={() => alert('Button pressed')}></M3Button>
        </ThemedView>
    ); 
}

const styles = StyleSheet.create({
    usage: {
        width: '100%',
        padding: 20,
        borderRadius: 15, 
        textAlign: 'left',
        backgroundColor: theme.light.colors.surfaceContainer,
        alignSelf: 'center',
    },
    month: {
        padding: 12,
        gap: 4,
        justifyContent:'left',
        backgroundColor: theme.light.colors.surfaceBright,
        borderRadius: 15,
        flexWrap: 'wrap',
        minWidth: 0,
    },
    rows: {
        flexDirection: 'row',
        marginVertical: 10,
        gap: 8,
        width: '100%',
    },
})