import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Stop, Ellipse, Rect, Circle } from 'react-native-svg';

interface GardenGrowthProps {
  stage: 1 | 2 | 3 | 4 | 5;
  size?: number;
}

export const GardenGrowth: React.FC<GardenGrowthProps> = ({ stage, size = 60 }) => {
  const renderStage1 = () => (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Defs>
        <LinearGradient id="soil" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#8B4513" stopOpacity={1} />
          <Stop offset="100%" stopColor="#654321" stopOpacity={1} />
        </LinearGradient>
      </Defs>

      {/* Ground */}
      <Ellipse cx="30" cy="50" rx="25" ry="8" fill="url(#soil)" />

      {/* Small seed */}
      <Circle cx="30" cy="45" r="2" fill="#D2691E" />

      {/* Tiny sparkle */}
      <Circle cx="35" cy="40" r="1" fill="#FFD700" opacity="0.7" />
    </Svg>
  );

  const renderStage2 = () => (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Defs>
        <LinearGradient id="soil2" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#8B4513" stopOpacity={1} />
          <Stop offset="100%" stopColor="#654321" stopOpacity={1} />
        </LinearGradient>
        <LinearGradient id="sprout" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#90EE90" stopOpacity={1} />
          <Stop offset="100%" stopColor="#32CD32" stopOpacity={1} />
        </LinearGradient>
      </Defs>

      {/* Ground */}
      <Ellipse cx="30" cy="50" rx="25" ry="8" fill="url(#soil2)" />

      {/* Small stem */}
      <Rect x="29" y="35" width="2" height="15" fill="#228B22" />

      {/* First tiny leaves */}
      <Ellipse cx="25" cy="38" rx="4" ry="2" fill="url(#sprout)" transform="rotate(-30 25 38)" />
      <Ellipse cx="35" cy="38" rx="4" ry="2" fill="url(#sprout)" transform="rotate(30 35 38)" />
    </Svg>
  );

  const renderStage3 = () => (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Defs>
        <LinearGradient id="soil3" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#8B4513" stopOpacity={1} />
          <Stop offset="100%" stopColor="#654321" stopOpacity={1} />
        </LinearGradient>
        <LinearGradient id="leaves" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#98FB98" stopOpacity={1} />
          <Stop offset="100%" stopColor="#32CD32" stopOpacity={1} />
        </LinearGradient>
      </Defs>

      {/* Ground */}
      <Ellipse cx="30" cy="50" rx="25" ry="8" fill="url(#soil3)" />

      {/* Stem */}
      <Rect x="29" y="25" width="2" height="25" fill="#228B22" />

      {/* Leaves */}
      <Ellipse cx="22" cy="32" rx="6" ry="3" fill="url(#leaves)" transform="rotate(-45 22 32)" />
      <Ellipse cx="38" cy="32" rx="6" ry="3" fill="url(#leaves)" transform="rotate(45 38 32)" />
      <Ellipse cx="20" cy="40" rx="5" ry="3" fill="url(#leaves)" transform="rotate(-30 20 40)" />
      <Ellipse cx="40" cy="40" rx="5" ry="3" fill="url(#leaves)" transform="rotate(30 40 40)" />
    </Svg>
  );

  const renderStage4 = () => (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Defs>
        <LinearGradient id="soil4" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#8B4513" stopOpacity={1} />
          <Stop offset="100%" stopColor="#654321" stopOpacity={1} />
        </LinearGradient>
        <LinearGradient id="leaves4" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#98FB98" stopOpacity={1} />
          <Stop offset="100%" stopColor="#32CD32" stopOpacity={1} />
        </LinearGradient>
        <RadialGradient id="flower" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFB6C1" stopOpacity={1} />
          <Stop offset="100%" stopColor="#FF69B4" stopOpacity={1} />
        </RadialGradient>
      </Defs>

      {/* Ground */}
      <Ellipse cx="30" cy="50" rx="25" ry="8" fill="url(#soil4)" />

      {/* Stem */}
      <Rect x="29" y="20" width="2" height="30" fill="#228B22" />

      {/* Leaves */}
      <Ellipse cx="22" cy="35" rx="6" ry="3" fill="url(#leaves4)" transform="rotate(-45 22 35)" />
      <Ellipse cx="38" cy="35" rx="6" ry="3" fill="url(#leaves4)" transform="rotate(45 38 35)" />
      <Ellipse cx="20" cy="42" rx="5" ry="3" fill="url(#leaves4)" transform="rotate(-30 20 42)" />
      <Ellipse cx="40" cy="42" rx="5" ry="3" fill="url(#leaves4)" transform="rotate(30 40 42)" />

      {/* Flower petals */}
      <Circle cx="30" cy="18" r="3" fill="url(#flower)" />
      <Ellipse cx="24" cy="15" rx="4" ry="2" fill="url(#flower)" transform="rotate(-30 24 15)" />
      <Ellipse cx="36" cy="15" rx="4" ry="2" fill="url(#flower)" transform="rotate(30 36 15)" />
      <Ellipse cx="27" cy="22" rx="4" ry="2" fill="url(#flower)" transform="rotate(-60 27 22)" />
      <Ellipse cx="33" cy="22" rx="4" ry="2" fill="url(#flower)" transform="rotate(60 33 22)" />

      {/* Flower center */}
      <Circle cx="30" cy="18" r="2" fill="#FFD700" />

      {/* Sparkles */}
      <Circle cx="35" cy="12" r="1" fill="#FFD700" opacity="0.8" />
      <Circle cx="25" cy="20" r="1" fill="#FFD700" opacity="0.6" />
    </Svg>
  );

  const renderStage5 = () => (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Defs>
        <LinearGradient id="soil5" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#8B4513" stopOpacity={1} />
          <Stop offset="100%" stopColor="#654321" stopOpacity={1} />
        </LinearGradient>
        <LinearGradient id="leaves5" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#ADFF2F" stopOpacity={1} />
          <Stop offset="100%" stopColor="#32CD32" stopOpacity={1} />
        </LinearGradient>
        <RadialGradient id="bigflower" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FF1493" stopOpacity={1} />
          <Stop offset="100%" stopColor="#C71585" stopOpacity={1} />
        </RadialGradient>
      </Defs>

      {/* Ground */}
      <Ellipse cx="30" cy="50" rx="28" ry="8" fill="url(#soil5)" />

      {/* Stem */}
      <Rect x="29" y="15" width="2" height="35" fill="#228B22" />

      {/* Leaves */}
      <Ellipse cx="20" cy="30" rx="8" ry="4" fill="url(#leaves5)" transform="rotate(-45 20 30)" />
      <Ellipse cx="40" cy="30" rx="8" ry="4" fill="url(#leaves5)" transform="rotate(45 40 30)" />
      <Ellipse cx="18" cy="40" rx="6" ry="3" fill="url(#leaves5)" transform="rotate(-30 18 40)" />
      <Ellipse cx="42" cy="40" rx="6" ry="3" fill="url(#leaves5)" transform="rotate(30 42 40)" />

      {/* Big beautiful flower */}
      <Circle cx="30" cy="15" r="6" fill="url(#bigflower)" />
      <Ellipse cx="22" cy="10" rx="5" ry="3" fill="url(#bigflower)" transform="rotate(-30 22 10)" />
      <Ellipse cx="38" cy="10" rx="5" ry="3" fill="url(#bigflower)" transform="rotate(30 38 10)" />
      <Ellipse cx="22" cy="20" rx="5" ry="3" fill="url(#bigflower)" transform="rotate(-150 22 20)" />
      <Ellipse cx="38" cy="20" rx="5" ry="3" fill="url(#bigflower)" transform="rotate(150 38 20)" />

      {/* Flower center */}
      <Circle cx="30" cy="15" r="3" fill="#FFD700" />

      {/* Beautiful sparkles */}
      <Circle cx="38" cy="8" r="1.5" fill="#FFD700" opacity="0.9" />
      <Circle cx="22" cy="8" r="1" fill="#FFD700" opacity="0.7" />
      <Circle cx="35" cy="22" r="1" fill="#FFD700" opacity="0.8" />
      <Circle cx="25" cy="22" r="1.5" fill="#FFD700" opacity="0.6" />
    </Svg>
  );

  const renderStage = () => {
    switch (stage) {
      case 1:
        return renderStage1();
      case 2:
        return renderStage2();
      case 3:
        return renderStage3();
      case 4:
        return renderStage4();
      case 5:
        return renderStage5();
      default:
        return renderStage1();
    }
  };

  return <View style={[styles.container, { width: size, height: size }]}>{renderStage()}</View>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Helper function to determine growth stage based on habit progress
export const calculateGrowthStage = (completedDays: number): 1 | 2 | 3 | 4 | 5 => {
  if (completedDays === 0) return 1;
  if (completedDays <= 3) return 2;
  if (completedDays <= 7) return 3;
  if (completedDays <= 14) return 4;
  return 5;
};

export default GardenGrowth;