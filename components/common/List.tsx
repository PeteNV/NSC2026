import { useTheme } from "@/hooks/useTheme";
import clsx from "clsx";
import { FlatList, type FlatListProps } from "react-native";

type Props<T> = FlatListProps<T> & {
  className?: string;
};

const List = <T,>({
  className,
  style,
  contentContainerStyle,
  ...props
}: Props<T>) => {
  const { colors } = useTheme();

  return (
    <FlatList
      {...props}
      className={clsx("h-full w-full rounded-2xl", className)}
      contentContainerStyle={[{ gap: 4 }, contentContainerStyle]}
      style={[{ borderColor: colors.outlineVariant }, style]}
    />
  );
};

export default List;
