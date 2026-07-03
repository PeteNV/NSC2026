import ButtonWithDropdown, {
  DropdownItem,
} from "@/components/common/ButtonWithDropdown";
import { StylableFC } from "@/types/common";

type Props = {
  onScanRoom: () => void;
  onManualEntry: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const ScanRoomButton: StylableFC<Props> = ({
  onScanRoom,
  onManualEntry,
  disabled = false,
  loading = false,
  className,
  style,
}) => {
  const dropdownItems: DropdownItem[] = [
    {
      label: "Test",
      leadingIcon: "pencil",
      onPress: onManualEntry,
    },
  ];

  return (
    <ButtonWithDropdown
      mode="contained"
      disabled={disabled}
      loading={loading}
      icon="camera"
      onPress={onScanRoom}
      dropdownItems={dropdownItems}
      className={className}
      style={style}
    >
      Scan Room
    </ButtonWithDropdown>
  );
};

export default ScanRoomButton;
