import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, StatusBar, Dimensions } from "react-native";
import { Theme } from "@/core/themes";
import { Text } from "@/core/components";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

const { height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  // Animation values
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const spinnerOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sequence of peaceful animations
    Animated.sequence([
      // 1. Fade-in and scale up the logo card
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 30,
          useNativeDriver: true,
        }),
      ]),
      // 2. Fade-in title and subtitle
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
      // 3. Fade-in the loading indicator
      Animated.timing(spinnerOpacity, {
        toValue: 0.6,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle continuous pulse on the logo card
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.03,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1.0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    
    // Start pulsing slightly after entry
    const pulseTimeout = setTimeout(() => {
      pulseAnimation.start();
    }, 1000);

    // Transition timer: smooth fade out of the screen then redirect
    const transitionTimeout = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        pulseAnimation.stop();
        const { user } = useAuthStore.getState();
        router.replace(user ? "/home" : "/onboarding");
      });
    }, 3200);

    return () => {
      clearTimeout(pulseTimeout);
      clearTimeout(transitionTimeout);
      pulseAnimation.stop();
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.Colors.background} />
      
      {/* Top ambient aura */}
      <View style={styles.ambientTop} />

      {/* Main branded block */}
      <View style={styles.centerBlock}>
        <Animated.View
          style={[
            styles.logoBadge,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Text variant="headline-lg" color={Theme.Colors.onPrimary} style={styles.logoText}>
            QR
          </Text>
        </Animated.View>

        <Animated.View style={{ opacity: textOpacity }}>
          <Text variant="display" color={Theme.Colors.primary} align="center" style={styles.title}>
            Quiet Reader
          </Text>
        </Animated.View>

        <Animated.View style={{ opacity: taglineOpacity }}>
          <Text variant="body-lg" color={Theme.Colors.secondary} align="center" style={styles.tagline}>
            A serene digital sanctuary for focused minds.
          </Text>
        </Animated.View>
      </View>

      {/* Bottom loading track */}
      <Animated.View style={[styles.bottomContainer, { opacity: spinnerOpacity }]}>
        <View style={styles.loadingTrack}>
          <Animated.View style={styles.loadingBar} />
        </View>
        <Text variant="label-sm" color={Theme.Colors.secondary} align="center">
          Preparing your sanctuary...
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Theme.Spacing.xl,
  },
  ambientTop: {
    position: "absolute",
    top: 0,
    width: "120%",
    height: height * 0.35,
    backgroundColor: Theme.Colors.surfaceContainerLow,
    opacity: 0.4,
    borderBottomLeftRadius: height * 0.3,
    borderBottomRightRadius: height * 0.3,
  },
  centerBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Theme.Spacing.lg,
    marginTop: height * 0.05,
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: Theme.Roundness.lg,
    backgroundColor: Theme.Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Theme.Spacing.lg,
    shadowColor: Theme.Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  logoText: {
    fontWeight: "700",
    fontSize: 32,
    letterSpacing: 2,
  },
  title: {
    fontWeight: "700",
    marginBottom: Theme.Spacing.xs,
    letterSpacing: 0.5,
  },
  tagline: {
    fontWeight: "500",
    paddingHorizontal: Theme.Spacing.md,
    lineHeight: 24,
    opacity: 0.85,
  },
  bottomContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: Theme.Spacing.xl,
    marginBottom: Theme.Spacing.md,
  },
  loadingTrack: {
    width: 140,
    height: 3,
    backgroundColor: Theme.Colors.outlineVariant,
    opacity: 0.3,
    borderRadius: 1.5,
    marginBottom: Theme.Spacing.sm,
    overflow: "hidden",
  },
  loadingBar: {
    width: "50%",
    height: "100%",
    backgroundColor: Theme.Colors.primary,
    borderRadius: 1.5,
  },
});
