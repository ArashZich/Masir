import React from 'react';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface GardenIconProps {
  size?: number;
  color?: string;
}

export function GardenIcon({ size = 100, color = '#ffffff' }: GardenIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <LinearGradient id="gardenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </LinearGradient>
      </Defs>

      {/* Garden bed - curved ground line */}
      <Path
        d="M10 85 Q30 80 50 85 Q70 90 90 85 Q100 83 110 85"
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.6"
        strokeLinecap="round"
      />

      {/* Stage 1: Seed */}
      <G transform="translate(25, 80)">
        <Circle cx="0" cy="0" r="3" fill={color} opacity="0.7" />
        <Circle cx="0" cy="0" r="1" fill={color} opacity="0.9" />
      </G>

      {/* Stage 2: Sprout */}
      <G transform="translate(40, 78)">
        <Path
          d="M0 5 L0 0 M-2 2 Q0 0 2 2"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <Circle cx="0" cy="5" r="1" fill={color} opacity="0.5" />
      </G>

      {/* Stage 3: Small plant with leaves */}
      <G transform="translate(55, 75)">
        <Path
          d="M0 8 L0 0"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
        <Path
          d="M-3 5 Q0 2 3 5"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <Path
          d="M-2 7 Q0 5 2 7"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <Circle cx="0" cy="8" r="1" fill={color} opacity="0.5" />
      </G>

      {/* Stage 4: Mature plant with bud */}
      <G transform="translate(70, 72)">
        <Path
          d="M0 10 L0 0"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <Path
          d="M-4 6 Q0 3 4 6"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <Path
          d="M-3 8 Q0 6 3 8"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <Path
          d="M-2 4 Q0 2 2 4"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <Circle cx="0" cy="0" r="2.5" fill={color} opacity="0.6" />
        <Circle cx="0" cy="10" r="1" fill={color} opacity="0.5" />
      </G>

      {/* Stage 5: Full flower */}
      <G transform="translate(85, 68)">
        {/* Stem */}
        <Path
          d="M0 12 L0 0"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* Leaves */}
        <Path
          d="M-5 8 Q0 5 5 8"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <Path
          d="M-4 10 Q0 8 4 10"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <Path
          d="M-3 6 Q0 4 3 6"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Flower petals */}
        <Circle cx="0" cy="0" r="4" fill={color} opacity="0.5" />
        <Circle cx="-3" cy="-2" r="2.5" fill={color} opacity="0.4" />
        <Circle cx="3" cy="-2" r="2.5" fill={color} opacity="0.4" />
        <Circle cx="2" cy="3" r="2.5" fill={color} opacity="0.4" />
        <Circle cx="-2" cy="3" r="2.5" fill={color} opacity="0.4" />
        <Circle cx="0" cy="-4" r="2" fill={color} opacity="0.4" />
        {/* Center */}
        <Circle cx="0" cy="0" r="1.5" fill={color} opacity="0.8" />
        {/* Root indication */}
        <Circle cx="0" cy="12" r="1" fill={color} opacity="0.5" />
      </G>

      {/* Growth arrows showing progression */}
      <G transform="translate(32, 75)">
        <Path
          d="M0 0 L5 0 M3 -2 L5 0 L3 2"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.4"
        />
      </G>

      <G transform="translate(47, 73)">
        <Path
          d="M0 0 L5 0 M3 -2 L5 0 L3 2"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.4"
        />
      </G>

      <G transform="translate(62, 70)">
        <Path
          d="M0 0 L5 0 M3 -2 L5 0 L3 2"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.4"
        />
      </G>

      <G transform="translate(77, 67)">
        <Path
          d="M0 0 L5 0 M3 -2 L5 0 L3 2"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.4"
        />
      </G>

      {/* Sun in the background */}
      <G transform="translate(90, 25)">
        <Circle cx="0" cy="0" r="12" fill={color} opacity="0.3" />
        <Path
          d="M0 -18 L0 -15 M12.7 -12.7 L10.6 -10.6 M18 0 L15 0 M12.7 12.7 L10.6 10.6 M0 18 L0 15 M-12.7 12.7 L-10.6 10.6 M-18 0 L-15 0 M-12.7 -12.7 L-10.6 -10.6"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.4"
        />
      </G>

      {/* Gentle rain drops for nourishment */}
      <Circle cx="30" cy="25" r="1" fill={color} opacity="0.3" />
      <Circle cx="45" cy="20" r="1" fill={color} opacity="0.3" />
      <Circle cx="60" cy="22" r="1" fill={color} opacity="0.3" />

      {/* Growth energy lines */}
      <Path
        d="M25 75 Q35 65 45 75"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
        strokeDasharray="2,2"
      />

      <Path
        d="M55 70 Q65 60 75 70"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
        strokeDasharray="2,2"
      />

      {/* Nurturing soil texture */}
      <Path
        d="M15 88 Q25 85 35 88 Q45 91 55 88 Q65 85 75 88 Q85 91 95 88"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.2"
        strokeLinecap="round"
      />

      {/* Time/patience symbol - gentle spiral */}
      <G transform="translate(30, 40)">
        <Path
          d="M0 0 Q-3 -3 0 -6 Q6 -6 6 0 Q6 9 0 9 Q-9 9 -9 0 Q-9 -12 0 -12"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.2"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}