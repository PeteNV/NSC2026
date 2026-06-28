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
    <>
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
    </>
  );
}

const styles = StyleSheet.create({
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
