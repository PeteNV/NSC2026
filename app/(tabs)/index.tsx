import Estimate from "@/components/estimate";
import Map from "@/components/map";
import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Estimate />
      <Map />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 96,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
