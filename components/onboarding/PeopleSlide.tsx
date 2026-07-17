import { useCallback, useMemo, useRef, useState } from "react";
import { PanResponder, View, type LayoutChangeEvent } from "react-native";
import { Text, useTheme } from "react-native-paper";

const MAX_PEOPLE = 11;
const TOTAL_DOTS = 9;
const TRACK_HEIGHT = 18;
const THUMB_WIDTH = 4;
const THUMB_HEIGHT = 32;
const GAP = 3;

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function PeopleSlide({ value, onChange }: Props) {
  const { colors } = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);

  const trackWidthRef = useRef(0);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const onTrackLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setTrackWidth(w);
    trackWidthRef.current = w;
  }, []);

  const valueFromX = useCallback((x: number, w: number) => {
    const ratio = Math.max(0, Math.min(1, x / w));
    return Math.round(ratio * (MAX_PEOPLE - 1)) + 1;
  }, []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          if (trackWidthRef.current > 0) {
            onChangeRef.current(
              valueFromX(evt.nativeEvent.locationX, trackWidthRef.current),
            );
          }
        },
        onPanResponderMove: (evt) => {
          if (trackWidthRef.current > 0) {
            onChangeRef.current(
              valueFromX(evt.nativeEvent.locationX, trackWidthRef.current),
            );
          }
        },
        onPanResponderRelease: () => {},
      }),
    [valueFromX],
  );

  const ratio = (value - 1) / (MAX_PEOPLE - 1);
  const thumbLeft = trackWidth > 0 ? ratio * trackWidth - THUMB_WIDTH / 2 : 0;

  const activeWidth =
    trackWidth > 0
      ? Math.max(0, ratio * trackWidth - GAP - THUMB_WIDTH / 2)
      : 0;
  const inactiveWidth =
    trackWidth > 0
      ? Math.max(0, (1 - ratio) * trackWidth - GAP - THUMB_WIDTH / 2)
      : 0;

  return (
    <View className="px-6 pt-8">
      <Text
        variant="titleLarge"
        style={{ color: colors.onSurface, marginBottom: 8 }}
      >
        How many people live here?
      </Text>

      <View className="mb-4 mt-8 px-4">
        <Text
          variant="displaySmall"
          style={{ color: colors.primary, textAlign: "center" }}
        >
          {value === MAX_PEOPLE ? "10+" : value}
        </Text>

        <View
          className="my-10"
          style={{ height: THUMB_HEIGHT + 8 }}
          onLayout={onTrackLayout}
          {...panResponder.panHandlers}
        >
          {trackWidth > 0 && (
            <>
              {activeWidth > 0 && (
                <View
                  className="absolute"
                  style={{
                    top: (THUMB_HEIGHT + 8 - TRACK_HEIGHT) / 2,
                    left: 0,
                    width: activeWidth,
                    height: TRACK_HEIGHT,
                    backgroundColor: colors.primary,
                    borderTopLeftRadius: 9,
                    borderBottomLeftRadius: 9,
                  }}
                />
              )}

              {inactiveWidth > 0 && (
                <View
                  className="absolute"
                  style={{
                    top: (THUMB_HEIGHT + 8 - TRACK_HEIGHT) / 2,
                    right: 0,
                    width: inactiveWidth,
                    height: TRACK_HEIGHT,
                    backgroundColor: colors.primaryContainer,
                    borderTopRightRadius: 9,
                    borderBottomRightRadius: 9,
                  }}
                />
              )}

              {Array.from({ length: TOTAL_DOTS }).map((_, i) => {
                const dotPos =
                  ((i + 1) / (TOTAL_DOTS + 1)) * trackWidth;
                const isActive = dotPos <= thumbLeft + THUMB_WIDTH / 2;
                return (
                  <View
                    key={`d-${i}`}
                    className="absolute h-1 w-1 rounded-sm"
                    style={{
                      top: (THUMB_HEIGHT + 8) / 2 - 2,
                      left: dotPos - 2,
                      backgroundColor: isActive
                        ? colors.onPrimary
                        : colors.primary,
                    }}
                  />
                );
              })}

              <View
                className="absolute rounded-sm"
                style={{
                  top: (THUMB_HEIGHT + 8 - THUMB_HEIGHT) / 2,
                  left: thumbLeft,
                  width: THUMB_WIDTH,
                  height: THUMB_HEIGHT,
                  backgroundColor: colors.primary,
                }}
              />
            </>
          )}
        </View>

        <View className="flex-row justify-between">
          <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>
            Just me
          </Text>
          <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>
            10+
          </Text>
        </View>
      </View>
    </View>
  );
}
