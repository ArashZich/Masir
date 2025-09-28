import React from 'react';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface PhilosophyIconProps {
  size?: number;
  color?: string;
}

export function PhilosophyIcon({ size = 100, color = '#ffffff' }: PhilosophyIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <LinearGradient id="philosophyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </LinearGradient>
      </Defs>

      {/* Central Balance Symbol */}
      <G transform="translate(60, 60)">
        {/* Main circle representing wholeness */}
        <Circle
          cx="0"
          cy="0"
          r="35"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />

        {/* Yin-Yang inspired balance symbol */}
        <Path
          d="M0 -20 A20 20 0 0 1 0 20 A10 10 0 0 1 0 0 A10 10 0 0 0 0 -20"
          fill={color}
          opacity="0.6"
        />
        <Circle cx="0" cy="10" r="3" fill={color} opacity="0.3" />
        <Circle cx="0" cy="-10" r="3" fill={color} />

        {/* Flow lines representing life's ups and downs */}
        <Path
          d="M-30 -15 Q-20 -25 -10 -15 Q0 -5 10 -15 Q20 -25 30 -15"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.7"
          strokeLinecap="round"
        />

        <Path
          d="M-30 15 Q-20 5 -10 15 Q0 25 10 15 Q20 5 30 15"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.7"
          strokeLinecap="round"
        />
      </G>

      {/* Growth symbols around the circle */}
      <G transform="translate(30, 30)">
        {/* Small seed */}
        <Circle cx="0" cy="0" r="2" fill={color} opacity="0.5" />
      </G>

      <G transform="translate(90, 35)">
        {/* Sprout */}
        <Path
          d="M0 5 L0 0 M-2 2 Q0 0 2 2"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </G>

      <G transform="translate(85, 85)">
        {/* Small plant */}
        <Path
          d="M0 6 L0 0 M-3 3 Q0 0 3 3 M-2 5 Q0 3 2 5"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </G>

      <G transform="translate(30, 90)">
        {/* Flower */}
        <Circle cx="0" cy="0" r="3" fill={color} opacity="0.6" />
        <Circle cx="-2" cy="-2" r="2" fill={color} opacity="0.4" />
        <Circle cx="2" cy="-2" r="2" fill={color} opacity="0.4" />
        <Circle cx="2" cy="2" r="2" fill={color} opacity="0.4" />
        <Circle cx="-2" cy="2" r="2" fill={color} opacity="0.4" />
        <Path
          d="M0 6 L0 0"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </G>

      {/* Connecting flow lines */}
      <Path
        d="M30 30 Q45 15 60 30 Q75 45 90 35"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        strokeDasharray="3,3"
      />

      <Path
        d="M90 35 Q75 60 85 85"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        strokeDasharray="3,3"
      />

      <Path
        d="M85 85 Q60 95 30 90"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        strokeDasharray="3,3"
      />

      {/* Mindfulness symbol - simple lotus petals */}
      <G transform="translate(60, 25)">
        <Path
          d="M0 8 Q-4 4 0 0 Q4 4 0 8"
          fill={color}
          opacity="0.5"
        />
        <Path
          d="M-6 6 Q-8 2 -4 0 Q0 2 -6 6"
          fill={color}
          opacity="0.4"
        />
        <Path
          d="M6 6 Q8 2 4 0 Q0 2 6 6"
          fill={color}
          opacity="0.4"
        />
      </G>

      {/* Gentle flowing energy lines */}
      <Path
        d="M15 60 Q30 50 45 60 Q60 70 75 60 Q90 50 105 60"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.2"
        strokeLinecap="round"
      />
    </Svg>
  );
}