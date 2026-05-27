import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Theme } from "@/core/themes";
import { Button, Text } from "@/core/components";
import {
  WelcomeStep,
  GoalsStep,
  ProgressStep,
  CompanionStep,
} from "@/features/onboarding/components";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // User responses
  const [readingGoal, setReadingGoal] = useState("30 Mins");
  const [simulatedProgress, setSimulatedProgress] = useState(0.3);
  const [selectedCompanion, setSelectedCompanion] = useState<string>("fennec");
  const [moniker, setMoniker] = useState("");

  // Simulate progress automatic breathing animation for Step 2
  useEffect(() => {
    if (currentStep === 2) {
      const interval = setInterval(() => {
        setSimulatedProgress((p) => {
          if (p >= 0.9) return 0.2;
          return parseFloat((p + 0.15).toFixed(2));
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // Transition helpers
  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / width);
    if (pageIndex !== currentStep) {
      setCurrentStep(pageIndex);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      const nextStep = currentStep + 1;
      scrollViewRef.current?.scrollTo({ x: nextStep * width, animated: true });
      setCurrentStep(nextStep);
    } else {
      router.replace("/login");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      scrollViewRef.current?.scrollTo({ x: prevStep * width, animated: true });
      setCurrentStep(prevStep);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.Colors.background} />

      {/* Top Navigation Bar */}
      <View style={styles.progressHeaderContainer}>
        <View style={styles.backBtnWrapper}>
          {currentStep > 0 && (
            <Pressable onPress={handleBack} style={styles.backBtnTouch}>
              <Text variant="label-md" color={Theme.Colors.primary}>
                ← Back
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.skipBtnWrapper}>
          {currentStep < 3 && (
            <Pressable onPress={() => router.replace("/login")} style={styles.skipBtnTouch}>
              <Text variant="label-md" color={Theme.Colors.secondary}>
                Skip
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Swipeable Horizontal ScrollView Container */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.horizontalScrollView}
      >
        <View style={styles.slidePage}>
          <WelcomeStep />
        </View>
        <View style={styles.slidePage}>
          <GoalsStep readingGoal={readingGoal} setReadingGoal={setReadingGoal} />
        </View>
        <View style={styles.slidePage}>
          <ProgressStep
            simulatedProgress={simulatedProgress}
            setSimulatedProgress={setSimulatedProgress}
          />
        </View>
        <View style={styles.slidePage}>
          <CompanionStep
            selectedCompanion={selectedCompanion}
            setSelectedCompanion={setSelectedCompanion}
            moniker={moniker}
            setMoniker={setMoniker}
          />
        </View>
      </ScrollView>

      {/* Bottom Indicator and Button Bar */}
      <View style={styles.bottomControlBar}>
        
        {/* Navigation Indicator Dots placed on the bottom */}
        <View style={styles.dotsIndicatorContainer}>
          {[0, 1, 2, 3].map((stepIndex) => {
            const isActive = currentStep === stepIndex;
            return (
              <Pressable
                key={stepIndex}
                onPress={() => {
                  scrollViewRef.current?.scrollTo({ x: stepIndex * width, animated: true });
                  setCurrentStep(stepIndex);
                }}
                style={styles.dotIndicatorTouch}
              >
                <View
                  style={[
                    styles.dotIndicator,
                    isActive && styles.dotIndicatorActive,
                  ]}
                />
              </Pressable>
            );
          })}
        </View>

        <Button
          title={currentStep === 3 ? "Start Your Serene Journey ✦" : "Continue"}
          variant="primary"
          onPress={handleNext}
          fullWidth
          style={styles.continueBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.Colors.background,
  },
  progressHeaderContainer: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Theme.Spacing.marginMobile,
  },
  backBtnWrapper: {
    width: 60,
    alignItems: "flex-start",
  },
  backBtnTouch: {
    paddingVertical: 8,
  },
  skipBtnWrapper: {
    width: 60,
    alignItems: "flex-end",
  },
  skipBtnTouch: {
    paddingVertical: 8,
  },
  horizontalScrollView: {
    flex: 1,
  },
  slidePage: {
    width: width,
    flex: 1,
    paddingHorizontal: Theme.Spacing.marginMobile,
  },
  bottomControlBar: {
    paddingHorizontal: Theme.Spacing.marginMobile,
    paddingBottom: Theme.Spacing.md,
    paddingTop: Theme.Spacing.sm,
    backgroundColor: Theme.Colors.background,
  },
  dotsIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Theme.Spacing.md,
  },
  dotIndicatorTouch: {
    padding: 8,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.Colors.outlineVariant,
  },
  dotIndicatorActive: {
    width: 24,
    backgroundColor: Theme.Colors.primary,
  },
  continueBtn: {
    height: 54,
  },
});
