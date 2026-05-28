import React from "react";
import Svg, { Path, Circle } from "react-native-svg";
import { Theme } from "@/core/themes";

interface CharacterAvatarProps {
  illustrationUrl: string;
  size?: number;
  color?: string;
  locked?: boolean;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  illustrationUrl,
  size = 70,
  color,
  locked = false,
}) => {
  // Pastel BG mapping based on character type
  const getPastelBg = () => {
    if (locked) return "#ebeef3";
    switch (illustrationUrl) {
      case "bookish_bloop":
        return "#e8efff";
      case "specs_specter":
        return "#f6eeff";
      case "pages":
        return "#fff5eb";
      case "stacker":
        return "#eef1f6";
      case "romance_reader":
        return "#ffebee";
      case "dreamer":
        return "#e0f7fa";
      default:
        return "#e8efff";
    }
  };

  // Base drawing colors
  const strokeColor = locked ? Theme.Colors.outline : "#181c20";
  const bodyColor = color || (locked ? Theme.Colors.outline : getPastelBg());

  const drawBloop = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Body */}
      <Circle cx="50" cy="50" r="40" fill={bodyColor} />
      {/* Eyes */}
      <Circle cx="38" cy="45" r="5" fill={strokeColor} />
      <Circle cx="62" cy="45" r="5" fill={strokeColor} />
      {!locked && (
        <>
          <Circle cx="36" cy="43" r="1.5" fill="#ffffff" />
          <Circle cx="60" cy="43" r="1.5" fill="#ffffff" />
          <Circle cx="30" cy="52" r="4" fill="#ff8a80" opacity="0.6" />
          <Circle cx="70" cy="52" r="4" fill="#ff8a80" opacity="0.6" />
        </>
      )}
      {/* Smile */}
      <Path d="M44 56q6 4 12 0" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
      {/* Small Book in hand */}
      <Path d="M42 66h16a2 2 0 012 2v10a2 2 0 01-2 2H42a2 2 0 01-2-2V68a2 2 0 012-2z" fill={locked ? Theme.Colors.outline : "#4352a5"} />
      <Path d="M50 66v14" stroke={locked ? "#ebeef3" : "#ffffff"} strokeWidth="1.5" />
    </Svg>
  );

  const drawSpecter = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Body - Ghost shape */}
      <Path d="M20 50 C20 30, 80 30, 80 50 C80 70, 75 80, 70 80 C60 80, 55 70, 50 80 C45 70, 40 80, 30 80 C25 80, 20 70, 20 50 Z" fill={bodyColor} />
      {/* Big Spectacles */}
      <Circle cx="36" cy="46" r="10" stroke={strokeColor} strokeWidth="3" fill="#ffffff" fillOpacity="0.3" />
      <Circle cx="64" cy="46" r="10" stroke={strokeColor} strokeWidth="3" fill="#ffffff" fillOpacity="0.3" />
      <Path d="M46 46h8" stroke={strokeColor} strokeWidth="3" />
      {/* Eyes */}
      <Circle cx="36" cy="46" r="3" fill={strokeColor} />
      <Circle cx="64" cy="46" r="3" fill={strokeColor} />
      {/* Small mouth */}
      <Circle cx="50" cy="60" r="4" fill={strokeColor} />
    </Svg>
  );

  const drawPages = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Book Cover on Head shape */}
      <Path d="M25 65V35c0-5 4-9 9-9h32c5 0 9 4 9 9v30c0 5-4 9-9 9H34c-5 0-9-4-9-9z" fill={bodyColor} />
      {/* Inner Pages */}
      <Path d="M30 65V38c0-3 2-5 5-5h30c3 0 5 2 5 5v27c0 3-2 5-5 5H35c-3 0-5-2-5-5z" fill="#ffffff" />
      {/* Book Spine Center */}
      <Path d="M50 33v37" stroke={bodyColor} strokeWidth="2" />
      {/* Eyes on page */}
      <Path d="M40 45q3-3 6 0" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M54 45q3-3 6 0" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
      {/* Cute smile */}
      <Path d="M48 55q2 2 4 0" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );

  const drawStacker = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Stacking circles representing stack of books buddy */}
      <Path d="M20 70h60v10H20z" fill={bodyColor} />
      <Path d="M25 55h50v12H25z" fill={bodyColor} opacity="0.8" />
      <Path d="M30 40h40v12H30z" fill={bodyColor} opacity="0.6" />
      {/* Animated eyes on top book */}
      <Circle cx="44" cy="46" r="3" fill={strokeColor} />
      <Circle cx="56" cy="46" r="3" fill={strokeColor} />
    </Svg>
  );

  switch (illustrationUrl) {
    case "bookish_bloop":
      return drawBloop();
    case "specs_specter":
      return drawSpecter();
    case "pages":
      return drawPages();
    case "stacker":
      return drawStacker();
    case "romance_reader":
      return drawBloop(); // Re-use bloop model with customized body color
    case "dreamer":
      return drawSpecter(); // Re-use specter model with customized body color
    default:
      return drawBloop();
  }
};

export default CharacterAvatar;
