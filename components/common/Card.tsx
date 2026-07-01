import { useTheme } from "@/hooks/useTheme";
import { type StylableFC } from "@/types/common";
import { clsx } from "clsx";
import type { PropsWithChildren } from "react";
import { View } from "react-native";

const Card: StylableFC<PropsWithChildren> = ({
  className,
  style,
  children,
}) => {
  const { colors } = useTheme();

  return (
    <View
      className={clsx("w-full gap-4 rounded-xl border p-4", className)}
      style={[
        { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Card;
