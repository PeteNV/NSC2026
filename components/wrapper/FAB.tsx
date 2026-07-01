import { cssInterop } from "nativewind";
import type { ComponentProps } from "react";
import { FAB as PaperFAB } from "react-native-paper";

cssInterop(PaperFAB, {
  className: {
    target: "style",
  },
});

type Props = ComponentProps<typeof PaperFAB> & {
  className?: string;
};

function FAB(props: Props) {
  return <PaperFAB {...props} />;
}

export default FAB;
