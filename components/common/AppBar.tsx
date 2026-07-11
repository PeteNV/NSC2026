import { useTheme } from "@/hooks/useTheme";
import { type StylableFC } from "@/types/common";
import { router } from "expo-router";
import { Appbar } from "react-native-paper";

type Props = {
  title: string;
  back?: boolean;
  onBack?: () => void;
  menu?: boolean;
  onMenu?: () => void;
};

const AppBar: StylableFC<Props> = ({
  title,
  back,
  onBack,
  menu = true,
  onMenu,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <Appbar.Header style={[{ backgroundColor: colors.surface }, style]}>
      {back ? (
        <Appbar.BackAction onPress={onBack ?? (() => router.back())} />
      ) : null}
      {menu ? <Appbar.Action icon="menu" onPress={onMenu} /> : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default AppBar;
