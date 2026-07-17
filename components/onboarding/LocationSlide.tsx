import List from "@/components/common/List";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { View } from "react-native";
import { Text, TextInput, TouchableRipple, useTheme } from "react-native-paper";

const THAI_PROVINCES = [
  "Bangkok",
  "Amnat Charoen",
  "Ang Thong",
  "Bueng Kan",
  "Buriram",
  "Chachoengsao",
  "Chai Nat",
  "Chaiyaphum",
  "Chanthaburi",
  "Chiang Mai",
  "Chiang Rai",
  "Chonburi",
  "Chumphon",
  "Kalasin",
  "Kamphaeng Phet",
  "Kanchanaburi",
  "Khon Kaen",
  "Krabi",
  "Lampang",
  "Lamphun",
  "Loei",
  "Lopburi",
  "Mae Hong Son",
  "Maha Sarakham",
  "Mukdahan",
  "Nakhon Nayok",
  "Nakhon Pathom",
  "Nakhon Phanom",
  "Nakhon Ratchasima",
  "Nakhon Sawan",
  "Nakhon Si Thammarat",
  "Nan",
  "Narathiwat",
  "Nong Bua Lamphu",
  "Nong Khai",
  "Nonthaburi",
  "Pathum Thani",
  "Pattani",
  "Phang Nga",
  "Phatthalung",
  "Phayao",
  "Phetchabun",
  "Phetchaburi",
  "Phichit",
  "Phitsanulok",
  "Phra Nakhon Si Ayutthaya",
  "Phrae",
  "Phuket",
  "Prachinburi",
  "Prachuap Khiri Khan",
  "Ranong",
  "Ratchaburi",
  "Rayong",
  "Roi Et",
  "Sa Kaeo",
  "Sakon Nakhon",
  "Samut Prakan",
  "Samut Sakhon",
  "Samut Songkhram",
  "Saraburi",
  "Satun",
  "Sing Buri",
  "Sisaket",
  "Songkhla",
  "Sukhothai",
  "Suphan Buri",
  "Surat Thani",
  "Surin",
  "Tak",
  "Trang",
  "Trat",
  "Ubon Ratchathani",
  "Udon Thani",
  "Uthai Thani",
  "Uttaradit",
  "Yala",
  "Yasothon",
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function LocationSlide({ value, onChange }: Props) {
  const { colors } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredProvinces = value
    ? THAI_PROVINCES.filter((p) =>
        p.toLowerCase().includes(value.toLowerCase()),
      )
    : THAI_PROVINCES;

  return (
    <View className="px-6 pt-8">
      <Text
        variant="titleLarge"
        style={{ color: colors.onSurface, marginBottom: 24 }}
      >
        Where is your home located?
      </Text>

      <TextInput
        mode="outlined"
        label="Search province"
        value={value}
        onChangeText={onChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        left={
          <TextInput.Icon
            icon={({ size, color }) => (
              <MaterialIcons name="search" size={size} color={color} />
            )}
          />
        }
        right={
          value ? (
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialIcons name="close" size={size} color={color} />
              )}
              onPress={() => {
                onChange("");
                setShowDropdown(true);
              }}
            />
          ) : null
        }
        outlineColor={colors.outlineVariant}
        activeOutlineColor={colors.outlineVariant}
        style={{ backgroundColor: "transparent" }}
      />

      {showDropdown && filteredProvinces.length > 0 && (
        <View
          className="mt-1 h-52 rounded-md border"
          style={{ borderColor: colors.outlineVariant }}
        >
          <List
            data={filteredProvinces}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            renderItem={({ item: province }) => (
              <TouchableRipple
                onPress={() => {
                  onChange(province);
                  setShowDropdown(false);
                }}
              >
                <View className="px-4 py-3">
                  <Text variant="bodyLarge" style={{ color: colors.onSurface }}>
                    {province}
                  </Text>
                </View>
              </TouchableRipple>
            )}
          />
        </View>
      )}
    </View>
  );
}
