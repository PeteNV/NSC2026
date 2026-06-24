import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, FAB, Text } from "react-native-paper";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export function NormalButton({ title, onPress, disabled = false }: Props) {
  return (
    <Button mode="contained" onPress={onPress} disabled={disabled}>
      {title}
    </Button>
  );
}

export default function Map() {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          padding: 10,
          borderRadius: 15,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          backgroundColor: colors.surface,
        },
      ]}
    >
      <View style={styles.buttons}>
        <View
          style={[styles.chosenbutton, { backgroundColor: colors.secondary }]}
        >
          <Button onPress={() => alert("Floor 1 selected")}>
            <Text variant="labelLarge" style={{ color: colors.onSecondary }}>
              F1
            </Text>
          </Button>
        </View>
        <View
          style={[
            styles.centerbutton,
            { backgroundColor: colors.secondaryContainer },
          ]}
        >
          <Button onPress={() => alert("Floor 2 selected")}>
            <Text variant="labelLarge" style={{ color: colors.secondary }}>
              F2
            </Text>
          </Button>
        </View>
        <View
          style={[
            styles.centerbutton,
            { backgroundColor: colors.secondaryContainer },
          ]}
        >
          <Button onPress={() => alert("Floor 3 selected")}>
            <Text variant="labelLarge" style={{ color: colors.secondary }}>
              F3
            </Text>
          </Button>
        </View>
        <View
          style={[
            styles.rightbutton,
            { backgroundColor: colors.secondaryContainer },
          ]}
        >
          <Button onPress={() => alert("Floor 4 selected")}>
            <Text variant="labelLarge" style={{ color: colors.secondary }}>
              F4
            </Text>
          </Button>
        </View>
      </View>
      <View style={styles.box}>
        <Text
          variant="labelLarge"
          style={{ textAlign: "center", color: colors.secondary }}
        >
          Insert Map Here
        </Text>
      </View>
      <View style={styles.scanning}>
        <FAB icon="plus" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    margin: 10,
    gap: 5,
    justifyContent: "center",
  },
  chosenbutton: {
    width: "25%",
    borderRadius: 20,
  },
  centerbutton: {
    width: "25%",
    borderRadius: 5,
  },
  rightbutton: {
    width: "25%",
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
  },
  box: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: "center",
    backgroundColor: "transparent",
    flexWrap: "wrap",
    flex: 1,
    minWidth: 0,
    alignContent: "center",
  },
  scanbutton: {
    flex: 1,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
  },
  scanning: {
    flexDirection: "row",
    margin: 20,
    gap: 5,
    justifyContent: "center",
  },
  dropdown: {
    width: "25%",
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
  },
});
