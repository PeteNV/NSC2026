import { cssInterop } from "nativewind";
import type { ComponentProps } from "react";
import { Button as PaperButton } from "react-native-paper";

/**
 * NativeWind mapping
 */
cssInterop(PaperButton, {
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
type Props = ComponentProps<typeof PaperButton> & {
  className?: string;
  classNameContent?: string;
};

/**
 * Wrapper component
 */
function Button(props: Props) {
  return <PaperButton {...props} />;
}

export default Button;
