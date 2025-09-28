import React from 'react';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface WelcomeIconProps {
  size?: number;
  color?: string;
}

export function WelcomeIcon({ size = 100, color = '#ffffff' }: WelcomeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <LinearGradient id="welcomeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </LinearGradient>
      </Defs>

      {/* Background Circle */}
      <Circle
        cx="60"
        cy="60"
        r="55"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />

      {/* Main Path/Road */}
      <Path
        d="M25 80 Q35 70 45 75 T65 70 Q75 65 85 70 Q95 75 105 65"
        stroke="url(#welcomeGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Waypoints/Milestones */}
      <Circle cx="30" cy="77" r="4" fill={color} opacity="0.8" />
      <Circle cx="50" cy="72" r="4" fill={color} opacity="0.9" />
      <Circle cx="70" cy="68" r="4" fill={color} />
      <Circle cx="90" cy="67" r="4" fill={color} opacity="0.9" />

      {/* Destination Star */}
      <G transform="translate(100, 62)">
        <Path
          d="M0 -8 L2.5 -2.5 L8 -2.5 L3.5 1 L5.5 7 L0 4 L-5.5 7 L-3.5 1 L-8 -2.5 L-2.5 -2.5 Z"
          fill={color}
        />
      </G>

      {/* Growth Elements (Small plants along the path) */}
      <G transform="translate(35, 75)">
        {/* Small sprout */}
        <Path
          d="M0 5 L0 0 M-2 2 Q0 0 2 2"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </G>

      <G transform="translate(55, 70)">
        {/* Medium plant */}
        <Path
          d="M0 6 L0 0 M-3 3 Q0 0 3 3 M-2 5 Q0 3 2 5"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </G>

      <G transform="translate(75, 66)">
        {/* Larger plant */}
        <Path
          d="M0 7 L0 0 M-4 4 Q0 0 4 4 M-3 6 Q0 4 3 6 M-2 2 Q0 0 2 2"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
        />
      </G>

      {/* Floating inspirational elements */}
      <Circle cx="40" cy="40" r="2" fill={color} opacity="0.4" />
      <Circle cx="80" cy="45" r="1.5" fill={color} opacity="0.5" />
      <Circle cx="65" cy="35" r="1" fill={color} opacity="0.6" />

      {/* Compass-like center element */}
      <G transform="translate(60, 60)">
        <Circle cx="0" cy="0" r="12" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />
        <Circle cx="0" cy="0" r="6" fill={color} opacity="0.6" />
        <Path
          d="M0 -10 L2 -6 L0 -2 L-2 -6 Z"
          fill={color}
          opacity="0.8"
        />
      </G>
    </Svg>
  );
}