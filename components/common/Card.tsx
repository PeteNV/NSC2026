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
      className={clsx(className, "w-full gap-4 rounded-xl border p-4")}
      style={[
        style,
        { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
      ]}
    >
      {children}
    </View>
  );
};

export default Card;
