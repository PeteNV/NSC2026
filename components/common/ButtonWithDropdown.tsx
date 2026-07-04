import Button from "@/components/wrapper/Button";
import Menu from "@/components/wrapper/Menu";
import { useTheme } from "@/hooks/useTheme";
import { StylableFC } from "@/types/common";
import clsx from "clsx";
import { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { Icon, TouchableRipple } from "react-native-paper";

export type DropdownItem = {
  label: string;
  leadingIcon?: string;
  onPress: () => void;
};

const DROPDOWN_WIDTH = 36;

const ButtonWithDropdown: StylableFC<{
  mode?: "contained" | "outlined" | "text" | "elevated" | "contained-tonal";
  disabled?: boolean;
  loading?: boolean;
  icon?: string | ((props: { size: number; color: string }) => React.ReactNode);
  buttonColor?: string;
  textColor?: string;
  dropdownItems: DropdownItem[];
  onPress: () => void;
  children: string;
}> = ({
  mode = "contained",
  disabled = false,
  loading = false,
  icon,
  buttonColor,
  textColor,
  dropdownItems,
  onPress,
  children,
  className,
  style,
}) => {
  const { colors } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const anchorRef = useRef<View>(null);
  const menuWidthRef = useRef(160);

  const resolvedButtonColor = buttonColor ?? colors.primary;
  const resolvedTextColor = textColor ?? colors.onPrimary;

  const handleOpenMenu = useCallback(() => {
    if (anchorRef.current) {
      anchorRef.current.measureInWindow((x, y, width, height) => {
        setMenuAnchor({
          x: x + width - menuWidthRef.current,
          y: y + height,
        });
        setMenuVisible(true);
      });
    }
  }, []);

  return (
    <View className={clsx("flex-row gap-0.5", className)} style={style}>
      <Button
        mode={mode}
        disabled={disabled}
        loading={loading}
        icon={icon}
        buttonColor={resolvedButtonColor}
        textColor={resolvedTextColor}
        onPress={onPress}
        className="flex-1"
        style={{ borderTopRightRadius: 4, borderBottomRightRadius: 4 }}
      >
        {children}
      </Button>
      <View
        ref={anchorRef}
        collapsable={false}
        className="self-stretch overflow-hidden !rounded-l"
      >
        <TouchableRipple
          disabled={disabled}
          onPress={handleOpenMenu}
          style={{
            flex: 1,
            width: DROPDOWN_WIDTH,
            backgroundColor: resolvedButtonColor,
            borderTopRightRadius: 9999,
            borderBottomRightRadius: 9999,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
          }}
        >
          <View className="flex-1 items-center justify-center rounded-l">
            <Icon source="chevron-down" size={18} color={resolvedTextColor} />
          </View>
        </TouchableRipple>
      </View>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={menuAnchor}
        className="mt-2 rounded-lg"
        classNameContent="min-w-40 p-0 overflow-hidden"
        contentStyle={{ borderRadius: 16, transformOrigin: "top right" }}
      >
        <View
          onLayout={(e) => {
            menuWidthRef.current = e.nativeEvent.layout.width;
          }}
        >
          {dropdownItems.map((item, index) => (
            <Menu.Item
              key={index}
              style={{ backgroundColor: colors.surfaceContainerHigh }}
              leadingIcon={item.leadingIcon}
              onPress={() => {
                setMenuVisible(false);
                item.onPress();
              }}
              title={item.label}
            />
          ))}
        </View>
      </Menu>
    </View>
  );
};

export default ButtonWithDropdown;
