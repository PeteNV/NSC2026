import CookingFrequencySlide from "@/components/onboarding/CookingFrequencySlide";
import LocationSlide from "@/components/onboarding/LocationSlide";
import PeopleSlide from "@/components/onboarding/PeopleSlide";
import SummarySlide from "@/components/onboarding/SummarySlide";
import WeekdayOccupancySlide from "@/components/onboarding/WeekdayOccupancySlide";
import Button from "@/components/wrapper/Button";
import { useUser } from "@/hooks/useUser";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

const TOTAL_STEPS = 5;

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const { user, setUser } = useUser();
  const [step, setStep] = useState(1);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [location, setLocation] = useState("");
  const [people, setPeople] = useState(6);
  const [weekdayOccupancy, setWeekdayOccupancy] = useState("");
  const [cookingFrequency, setCookingFrequency] = useState("");

  useEffect(() => {
    if (user) {
      setLocation(user.location);
      setPeople(user.people);
      setWeekdayOccupancy(user.weekdayOccupancy);
      setCookingFrequency(user.cookingFrequency);
    }
  }, [user]);

  const handleGetStarted = useCallback(() => {
    setUser({
      location,
      people,
      weekdayOccupancy,
      cookingFrequency,
      onboarded: true,
    });
    router.replace("/(tabs)");
  }, [location, people, weekdayOccupancy, cookingFrequency, setUser]);

  const animateToStep = useCallback(
    (nextStep: number) => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start(() => {
        setStep(nextStep);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }).start();
      });
    },
    [fadeAnim],
  );

  const goNext = () => {
    if (step < TOTAL_STEPS) animateToStep(step + 1);
  };

  const goBack = () => {
    if (step > 1) animateToStep(step - 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <LocationSlide value={location} onChange={setLocation} />;
      case 2:
        return <PeopleSlide value={people} onChange={setPeople} />;
      case 3:
        return (
          <WeekdayOccupancySlide
            value={weekdayOccupancy}
            onChange={setWeekdayOccupancy}
          />
        );
      case 4:
        return (
          <CookingFrequencySlide
            value={cookingFrequency}
            onChange={setCookingFrequency}
          />
        );
      case 5:
        return (
          <SummarySlide
            location={location}
            people={people}
            weekdayOccupancy={weekdayOccupancy}
            cookingFrequency={cookingFrequency}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="h-12" />

      <View className="px-6 pt-5">
        <Text variant="displayMedium" style={{ color: colors.onSurface }}>
          Welcome To{"\n"}myEnergy
        </Text>
        <Text
          variant="titleLarge"
          style={{ color: colors.onSurface, marginTop: 8, marginBottom: 24 }}
        >
          Let&apos;s personalize your experience.
        </Text>
        <View
          className="h-1 w-full rounded-sm"
          style={{ backgroundColor: colors.primaryContainer }}
        >
          <View
            className="h-full rounded-sm"
            style={{
              backgroundColor: colors.primary,
              width: `${(step / TOTAL_STEPS) * 100}%`,
            }}
          />
        </View>
      </View>

      <Animated.View className="flex-1" style={{ opacity: fadeAnim }}>
        {renderStepContent()}
      </Animated.View>

      <View className="flex-row items-center justify-between px-6 pb-8 pt-4">
        {step > 1 ? (
          <Button mode="text" textColor={colors.primary} onPress={goBack}>
            Back
          </Button>
        ) : (
          <View />
        )}

        <Button
          mode="contained"
          buttonColor={colors.primary}
          textColor={colors.onPrimary}
          onPress={step < TOTAL_STEPS ? goNext : handleGetStarted}
          className="rounded-full"
        >
          {step < TOTAL_STEPS ? "Next" : "Get Started"}
        </Button>
      </View>
    </View>
  );
}
