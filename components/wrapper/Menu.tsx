import { cssInterop } from "nativewind";
import type { ComponentProps } from "react";
import { Menu as PaperMenu } from "react-native-paper";

/**
 * NativeWind mapping
 */
cssInterop(PaperMenu, {
  className: {
    target: "style",
  },
  classNameContent: {
    target: "contentStyle",
  },
});

/**
 * Props
 */
type Props = ComponentProps<typeof PaperMenu> & {
  className?: string;
  classNameContent?: string;
};

/**
 * Wrapper component
 */
function Menu(props: Props) {
  return <PaperMenu {...props} />;
}

Menu.Item = PaperMenu.Item;

export default Menu;
