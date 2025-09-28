import React from 'react';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface StartJourneyIconProps {
  size?: number;
  color?: string;
}

export function StartJourneyIcon({ size = 100, color = '#ffffff' }: StartJourneyIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <LinearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </LinearGradient>
      </Defs>

      <G transform="translate(60, 60)">
        <Circle cx="0" cy="-20" r="8" fill={color} opacity="0.7" />

        <Path
          d="M0 -12 L0 8"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.8"
        />

        <Path
          d="M0 -5 L-8 -15"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        <Path
          d="M0 -5 L8 -15"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />

        <Path
          d="M0 8 L-6 18"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        <Path
          d="M0 8 L4 18"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      </G>

      <Path
        d="M10 90 Q20 85 30 90 Q40 95 50 85 Q60 75 70 80 Q80 85 90 75 Q100 65 110 70"
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
        strokeDasharray="8,4"
      />

      <Circle cx="25" cy="88" r="3" fill={color} opacity="0.6" />
      <Circle cx="45" cy="82" r="3" fill={color} opacity="0.6" />
      <Circle cx="75" cy="78" r="3" fill={color} opacity="0.6" />
      <Circle cx="95" cy="72" r="3" fill={color} opacity="0.6" />

      <G transform="translate(105, 68)">
        <Path
          d="M0 -10 L3 -3 L10 -3 L4.5 1 L6.5 8 L0 5 L-6.5 8 L-4.5 1 L-10 -3 L-3 -3 Z"
          fill={color}
          opacity="0.8"
        />
      </G>

      <G transform="translate(85, 20)">
        <Path
          d="M0 15 A15 15 0 0 1 0 -15"
          fill={color}
          opacity="0.4"
        />
        <Path
          d="M0 -20 L0 -17 M10.6 -16.6 L9.2 -14.2 M15 -7.5 L12.5 -6.5 M15 7.5 L12.5 6.5 M10.6 16.6 L9.2 14.2 M0 20 L0 17"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        />
      </G>
    </Svg>
  );
}