import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, TextInputProps, Animated, ViewStyle, TextStyle } from "react-native";
import { Theme } from "./theme";
import Text from "./Text";

export interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false, // Border properties cannot use native driver
    }).start();
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (onBlur) onBlur(e);
  };

  // Interpolate borders
  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Theme.Colors.surfaceContainerHigh, Theme.Colors.primary],
  });

  const borderWidth = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="label-sm" color={Theme.Colors.onSurfaceVariant} style={styles.label}>
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            borderWidth,
          },
          error && styles.errorInput,
        ]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Theme.Colors.secondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          underlineColorAndroid="transparent"
          {...rest}
        />
      </Animated.View>
      {error && (
        <Text variant="label-sm" color={Theme.Colors.error} style={styles.errorText}>
          {error}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    marginBottom: Theme.Spacing.sm,
  },
  label: {
    marginBottom: Theme.Spacing.xs,
    marginLeft: Theme.Spacing.xs,
  },
  inputWrapper: {
    height: 48,
    borderRadius: Theme.Roundness.DEFAULT, // 8px default radius per spec
    backgroundColor: Theme.Colors.surfaceContainerLow, // subtle fill in default state
    paddingHorizontal: Theme.Spacing.sm, // 12px horizontal padding
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 16,
    color: Theme.Colors.onBackground,
    padding: 0, // Reset default padding
  },
  errorInput: {
    borderColor: Theme.Colors.error,
    borderWidth: 1,
  },
  errorText: {
    marginTop: Theme.Spacing.xs,
    marginLeft: Theme.Spacing.xs,
  },
});

export default InputField;
