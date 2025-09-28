import React from 'react';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface MoodIconProps {
  size?: number;
  color?: string;
}

export function MoodIcon({ size = 100, color = '#ffffff' }: MoodIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <LinearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </LinearGradient>
      </Defs>

      {/* Central brain/heart shape representing emotional awareness */}
      <G transform="translate(60, 60)">
        {/* Main circle representing self-awareness */}
        <Circle
          cx="0"
          cy="0"
          r="30"
          stroke={color}
          strokeWidth="2"
          fill="url(#moodGradient)"
          opacity="0.3"
        />

        {/* Inner emotional core */}
        <Circle
          cx="0"
          cy="0"
          r="15"
          fill={color}
          opacity="0.5"
        />

        {/* Emotion waves radiating outward */}
        <Circle
          cx="0"
          cy="0"
          r="20"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.4"
          strokeDasharray="3,3"
        />

        <Circle
          cx="0"
          cy="0"
          r="25"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.3"
          strokeDasharray="5,5"
        />

        {/* Simple smiley face in center */}
        <Circle cx="-5" cy="-3" r="1.5" fill={color} opacity="0.8" />
        <Circle cx="5" cy="-3" r="1.5" fill={color} opacity="0.8" />
        <Path
          d="M-6 6 Q0 12 6 6"
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />
      </G>

      {/* Floating mood representations */}
      <G transform="translate(25, 25)">
        {/* Happy mood - sun-like */}
        <Circle cx="0" cy="0" r="8" fill={color} opacity="0.4" />
        <Path
          d="M0 -12 L0 -10 M8.5 -8.5 L7 -7 M12 0 L10 0 M8.5 8.5 L7 7 M0 12 L0 10 M-8.5 8.5 L-7 7 M-12 0 L-10 0 M-8.5 -8.5 L-7 -7"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        />
      </G>

      <G transform="translate(95, 30)">
        {/* Neutral mood - balanced symbol */}
        <Circle cx="0" cy="0" r="6" stroke={color} strokeWidth="2" fill="none" opacity="0.4" />
        <Path
          d="M-4 0 L4 0"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
      </G>

      <G transform="translate(85, 85)">
        {/* Contemplative mood - cloud-like */}
        <Circle cx="0" cy="0" r="5" fill={color} opacity="0.3" />
        <Circle cx="-6" cy="2" r="4" fill={color} opacity="0.3" />
        <Circle cx="6" cy="2" r="4" fill={color} opacity="0.3" />
        <Circle cx="3" cy="-3" r="3" fill={color} opacity="0.3" />
      </G>

      <G transform="translate(30, 90)">
        {/* Reflective mood - water drop */}
        <Path
          d="M0 -8 Q-6 -2 0 6 Q6 -2 0 -8"
          fill={color}
          opacity="0.4"
        />
      </G>

      {/* Connecting emotional flow lines */}
      <Path
        d="M25 25 Q40 40 60 30 Q80 20 95 30"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.2"
        strokeDasharray="2,4"
      />

      <Path
        d="M95 30 Q90 60 85 85"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.2"
        strokeDasharray="2,4"
      />

      <Path
        d="M85 85 Q60 90 30 90"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.2"
        strokeDasharray="2,4"
      />

      {/* Mindful observation symbols */}
      <G transform="translate(60, 20)">
        {/* Third eye - awareness symbol */}
        <Circle cx="0" cy="0" r="4" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />
        <Circle cx="0" cy="0" r="1" fill={color} opacity="0.7" />
      </G>

      {/* Gentle energy spirals */}
      <Path
        d="M40 45 Q45 40 50 45 Q55 50 60 45"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        strokeLinecap="round"
      />

      <Path
        d="M60 75 Q65 70 70 75 Q75 80 80 75"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        strokeLinecap="round"
      />

      {/* Heart symbol for emotional intelligence */}
      <G transform="translate(20, 60)">
        <Path
          d="M0 8 Q-6 2 -6 -2 Q-6 -6 -2 -6 Q0 -4 2 -6 Q6 -6 6 -2 Q6 2 0 8"
          fill={color}
          opacity="0.4"
        />
      </G>

      <G transform="translate(100, 60)">
        <Path
          d="M0 8 Q-6 2 -6 -2 Q-6 -6 -2 -6 Q0 -4 2 -6 Q6 -6 6 -2 Q6 2 0 8"
          fill={color}
          opacity="0.3"
        />
      </G>
    </Svg>
  );
}