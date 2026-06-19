import { ThemedView } from '@/components/themed-view';
import { theme } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { ThemedText } from './themed-text';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export function NormalButton ({ title, onPress, disabled = false }: Props) {
    return (
    <Button 
      mode="contained"
      onPress={onPress} 
      disabled={disabled}
    >
      {title}
    </Button>
  );
}

export default function Mapping() {
    return(
            <ThemedView>
                <View style = {styles.buttons}>
                    <View style = {styles.chosenbutton}>
                    <Button onPress={() => alert('Floor 1 selected')}>
                    <ThemedText type = "default" style={{ color: theme.light.colors.onSecondary }}>
                        F1
                    </ThemedText>
                    </Button>
                    </View>
                    <View style = {styles.centerbutton}>
                    <Button onPress={() => alert('Floor 2 selected')}>
                    <ThemedText type = "default" style={{ color: theme.light.colors.secondary }}>
                        F2
                    </ThemedText>
                    </Button>
                    </View>
                    <View style = {styles.centerbutton}>
                    <Button onPress={() => alert('Floor 3 selected')}>
                    <ThemedText type = "default" style={{ color: theme.light.colors.secondary }}>
                        F3
                    </ThemedText>
                    </Button>
                    </View>
                    <View style = {styles.rightbutton}>
                    <Button onPress={() => alert('Floor 4 selected')}>
                    <ThemedText type = "default" style={{ color: theme.light.colors.secondary }}>
                        F4
                    </ThemedText>
                    </Button>
                    </View>
                </View>
                <View style = {styles.box}>
                    <ThemedText type = "default" style={{ textAlign: 'center', color: theme.light.colors.secondary }}>
                        Insert Map Here
                    </ThemedText>
                </View>
                <View style = {styles.scanning}>
                    <View style = {styles.scanbutton}>
                    <Button onPress={() => alert('Scanning Room...')}>
                    <ThemedText type = "default" style={{ color: theme.light.colors.onPrimary }}>
                        Scan Room
                    </ThemedText>
                    </Button>
                    </View>
                    <View style = {styles.dropdown}>
                    <Button onPress={() => alert('Template')}>
                    <ThemedText type = "default" style={{ color: theme.light.colors.onPrimary }}>
                        A
                    </ThemedText>
                    </Button>
                    </View>
                </View>
            </ThemedView>
    )
}

const styles = StyleSheet.create ({
    buttons: {
        flexDirection: 'row',
        margin: 10,
        gap: 5,
        justifyContent:'center',
    },
    chosenbutton: {
        width: '25%',
        borderRadius: 20,
        backgroundColor: theme.light.colors.secondary
    },
    centerbutton: {
        width: '25%',
        borderRadius: 5,
        backgroundColor: theme.light.colors.secondaryContainer
    },
    rightbutton: {
        width: '25%',
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15,
        backgroundColor: theme.light.colors.secondaryContainer
    },
    box: {
        width: '100%',
        height: '100%',
        borderWidth: 2,
        borderColor: theme.light.colors.outlineVariant,
        borderRadius: 8, 
        justifyContent: 'center',
        backgroundColor: 'transparent',
        flexWrap: 'wrap',
        flex: 1,
        minWidth: 0,
        alignContent: 'center'
    },
    scanbutton: {
        width: '75%',
        borderTopLeftRadius: 100,
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: theme.light.colors.primary,
    },
    scanning: {
        flexDirection: 'row',
        margin: 20,
        gap: 5,
        justifyContent:'center',
    },
    dropdown: {
        width: '25%',
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15,
        backgroundColor: theme.light.colors.primary,
    }
})