import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Stop, Path, Circle, G } from 'react-native-svg';

interface GardenGrowthProps {
  stage: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  size?: number;
}

export const GardenGrowth: React.FC<GardenGrowthProps> = ({ stage, size = 60 }) => {
  // Stage 1: Seed in pot
  const renderStage1 = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="pot1" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#E57373" />
          <Stop offset="100%" stopColor="#C62828" />
        </LinearGradient>
      </Defs>

      {/* Pot */}
      <Path d="M 35 60 L 30 85 Q 30 90 35 90 L 65 90 Q 70 90 70 85 L 65 60 Z" fill="url(#pot1)" />
      <Path d="M 30 60 L 70 60 L 68 55 L 32 55 Z" fill="#D32F2F" />

      {/* Soil */}
      <Path d="M 33 60 L 67 60 L 65 70 L 35 70 Z" fill="#6D4C41" />

      {/* Seed */}
      <Circle cx="50" cy="68" r="3" fill="#8D6E63" />
      <Circle cx="52" cy="66" r="1" fill="#BCAAA4" opacity="0.5" />
    </Svg>
  );

  // Stage 2: Small sprout
  const renderStage2 = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="pot2" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#E57373" />
          <Stop offset="100%" stopColor="#C62828" />
        </LinearGradient>
        <LinearGradient id="stem2" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#81C784" />
          <Stop offset="100%" stopColor="#4CAF50" />
        </LinearGradient>
      </Defs>

      {/* Pot */}
      <Path d="M 35 60 L 30 85 Q 30 90 35 90 L 65 90 Q 70 90 70 85 L 65 60 Z" fill="url(#pot2)" />
      <Path d="M 30 60 L 70 60 L 68 55 L 32 55 Z" fill="#D32F2F" />

      {/* Soil */}
      <Path d="M 33 60 L 67 60 L 65 70 L 35 70 Z" fill="#6D4C41" />

      {/* Stem */}
      <Path d="M 50 68 Q 48 55 47 48 Q 47 45 49 45 Q 51 45 51 48 Q 50 55 50 68 Z" fill="url(#stem2)" />

      {/* Small leaves */}
      <Path d="M 49 52 Q 44 50 42 52 Q 42 54 46 54 Q 48 54 49 52 Z" fill="#66BB6A" />
      <Path d="M 49 52 Q 54 50 56 52 Q 56 54 52 54 Q 50 54 49 52 Z" fill="#66BB6A" />
    </Svg>
  );

  // Stage 3: Growing plant
  const renderStage3 = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="pot3" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#E57373" />
          <Stop offset="100%" stopColor="#C62828" />
        </LinearGradient>
        <LinearGradient id="stem3" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#81C784" />
          <Stop offset="100%" stopColor="#388E3C" />
        </LinearGradient>
      </Defs>

      {/* Pot */}
      <Path d="M 35 60 L 30 85 Q 30 90 35 90 L 65 90 Q 70 90 70 85 L 65 60 Z" fill="url(#pot3)" />
      <Path d="M 30 60 L 70 60 L 68 55 L 32 55 Z" fill="#D32F2F" />

      {/* Soil */}
      <Path d="M 33 60 L 67 60 L 65 70 L 35 70 Z" fill="#6D4C41" />

      {/* Stem */}
      <Path d="M 50 68 Q 48 40 47 30 Q 47 25 49 25 Q 51 25 51 30 Q 50 40 50 68 Z" fill="url(#stem3)" />

      {/* Leaves - multiple pairs */}
      <Path d="M 49 45 Q 42 42 38 45 Q 38 48 44 48 Q 48 48 49 45 Z" fill="#66BB6A" />
      <Path d="M 49 45 Q 56 42 60 45 Q 60 48 54 48 Q 50 48 49 45 Z" fill="#4CAF50" />

      <Path d="M 49 35 Q 44 33 41 35 Q 41 38 46 38 Q 48 38 49 35 Z" fill="#66BB6A" />
      <Path d="M 49 35 Q 54 33 57 35 Q 57 38 52 38 Q 50 38 49 35 Z" fill="#4CAF50" />
    </Svg>
  );

  // Stage 4: Budding flower
  const renderStage4 = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="pot4" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#E57373" />
          <Stop offset="100%" stopColor="#C62828" />
        </LinearGradient>
        <LinearGradient id="stem4" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#81C784" />
          <Stop offset="100%" stopColor="#388E3C" />
        </LinearGradient>
        <RadialGradient id="bud" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FF80AB" />
          <Stop offset="100%" stopColor="#F06292" />
        </RadialGradient>
      </Defs>

      {/* Pot */}
      <Path d="M 35 60 L 30 85 Q 30 90 35 90 L 65 90 Q 70 90 70 85 L 65 60 Z" fill="url(#pot4)" />
      <Path d="M 30 60 L 70 60 L 68 55 L 32 55 Z" fill="#D32F2F" />

      {/* Soil */}
      <Path d="M 33 60 L 67 60 L 65 70 L 35 70 Z" fill="#6D4C41" />

      {/* Stem */}
      <Path d="M 50 68 Q 48 30 47 18 Q 47 12 49 12 Q 51 12 51 18 Q 50 30 50 68 Z" fill="url(#stem4)" />

      {/* Leaves */}
      <Path d="M 49 50 Q 40 47 35 50 Q 35 54 43 54 Q 48 54 49 50 Z" fill="#66BB6A" />
      <Path d="M 49 50 Q 58 47 63 50 Q 63 54 55 54 Q 50 54 49 50 Z" fill="#4CAF50" />

      <Path d="M 49 38 Q 43 36 39 38 Q 39 42 45 42 Q 48 42 49 38 Z" fill="#66BB6A" />
      <Path d="M 49 38 Q 55 36 59 38 Q 59 42 53 42 Q 50 42 49 38 Z" fill="#4CAF50" />

      {/* Closed bud */}
      <Circle cx="49" cy="15" r="5" fill="url(#bud)" />
      <Path d="M 47 12 Q 49 8 51 12 Z" fill="#EC407A" />
      <Circle cx="49" cy="15" r="1.5" fill="#FFD700" opacity="0.6" />
    </Svg>
  );

  // Stage 5: Opening flower
  const renderStage5 = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="pot5" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#E57373" />
          <Stop offset="100%" stopColor="#C62828" />
        </LinearGradient>
        <LinearGradient id="stem5" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#81C784" />
          <Stop offset="100%" stopColor="#388E3C" />
        </LinearGradient>
        <RadialGradient id="petal5" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FF80AB" />
          <Stop offset="100%" stopColor="#F06292" />
        </RadialGradient>
      </Defs>

      {/* Pot */}
      <Path d="M 35 60 L 30 85 Q 30 90 35 90 L 65 90 Q 70 90 70 85 L 65 60 Z" fill="url(#pot5)" />
      <Path d="M 30 60 L 70 60 L 68 55 L 32 55 Z" fill="#D32F2F" />

      {/* Soil */}
      <Path d="M 33 60 L 67 60 L 65 70 L 35 70 Z" fill="#6D4C41" />

      {/* Stem */}
      <Path d="M 50 68 Q 48 30 47 18 Q 47 12 49 12 Q 51 12 51 18 Q 50 30 50 68 Z" fill="url(#stem5)" />

      {/* Leaves */}
      <Path d="M 49 50 Q 38 47 32 50 Q 32 55 42 55 Q 48 55 49 50 Z" fill="#66BB6A" />
      <Path d="M 49 50 Q 60 47 66 50 Q 66 55 56 55 Q 50 55 49 50 Z" fill="#4CAF50" />

      <Path d="M 49 38 Q 42 36 37 38 Q 37 43 44 43 Q 48 43 49 38 Z" fill="#66BB6A" />
      <Path d="M 49 38 Q 56 36 61 38 Q 61 43 54 43 Q 50 43 49 38 Z" fill="#4CAF50" />

      {/* Opening flower - 4 petals */}
      <G>
        <Circle cx="49" cy="10" r="3.5" fill="url(#petal5)" />
        <Circle cx="54" cy="14" r="3.5" fill="url(#petal5)" />
        <Circle cx="44" cy="14" r="3.5" fill="url(#petal5)" />
        <Circle cx="49" cy="18" r="3.5" fill="url(#petal5)" />

        {/* Center */}
        <Circle cx="49" cy="14" r="2.5" fill="#FDD835" />
      </G>
    </Svg>
  );

  // Stage 6: Full bloom
  const renderStage6 = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="pot6" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#E57373" />
          <Stop offset="100%" stopColor="#C62828" />
        </LinearGradient>
        <LinearGradient id="stem6" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#81C784" />
          <Stop offset="100%" stopColor="#388E3C" />
        </LinearGradient>
        <RadialGradient id="petal6" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FF4081" />
          <Stop offset="100%" stopColor="#E91E63" />
        </RadialGradient>
      </Defs>

      {/* Pot */}
      <Path d="M 35 60 L 30 85 Q 30 90 35 90 L 65 90 Q 70 90 70 85 L 65 60 Z" fill="url(#pot6)" />
      <Path d="M 30 60 L 70 60 L 68 55 L 32 55 Z" fill="#D32F2F" />

      {/* Soil */}
      <Path d="M 33 60 L 67 60 L 65 70 L 35 70 Z" fill="#6D4C41" />

      {/* Stem */}
      <Path d="M 50 68 Q 48 30 47 18 Q 47 12 49 12 Q 51 12 51 18 Q 50 30 50 68 Z" fill="url(#stem6)" />

      {/* Leaves */}
      <Path d="M 49 50 Q 38 47 32 50 Q 32 55 42 55 Q 48 55 49 50 Z" fill="#66BB6A" />
      <Path d="M 49 50 Q 60 47 66 50 Q 66 55 56 55 Q 50 55 49 50 Z" fill="#4CAF50" />

      <Path d="M 49 38 Q 42 36 37 38 Q 37 43 44 43 Q 48 43 49 38 Z" fill="#66BB6A" />
      <Path d="M 49 38 Q 56 36 61 38 Q 61 43 54 43 Q 50 43 49 38 Z" fill="#4CAF50" />

      {/* Full bloom flower - 5 petals */}
      <G>
        <Circle cx="49" cy="8" r="4" fill="url(#petal6)" />
        <Circle cx="56" cy="11" r="4" fill="url(#petal6)" />
        <Circle cx="55" cy="18" r="4" fill="url(#petal6)" />
        <Circle cx="43" cy="18" r="4" fill="url(#petal6)" />
        <Circle cx="42" cy="11" r="4" fill="url(#petal6)" />

        {/* Center */}
        <Circle cx="49" cy="14" r="3.5" fill="#FDD835" />
        <Circle cx="49" cy="14" r="2" fill="#FBC02D" />

        {/* Sparkles */}
        <Circle cx="54" cy="8" r="1" fill="#FFD700" opacity="0.9" />
        <Circle cx="44" cy="9" r="0.8" fill="#FFD700" opacity="0.8" />
      </G>
    </Svg>
  );

  // Stage 7: Multiple flowers
  const renderStage7 = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="pot7" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#E57373" />
          <Stop offset="100%" stopColor="#C62828" />
        </LinearGradient>
        <LinearGradient id="stem7" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#81C784" />
          <Stop offset="100%" stopColor="#388E3C" />
        </LinearGradient>
        <RadialGradient id="petal7" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FF4081" />
          <Stop offset="100%" stopColor="#E91E63" />
        </RadialGradient>
        <RadialGradient id="petal7-2" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFB74D" />
          <Stop offset="100%" stopColor="#FF9800" />
        </RadialGradient>
      </Defs>

      {/* Pot */}
      <Path d="M 35 60 L 30 85 Q 30 90 35 90 L 65 90 Q 70 90 70 85 L 65 60 Z" fill="url(#pot7)" />
      <Path d="M 30 60 L 70 60 L 68 55 L 32 55 Z" fill="#D32F2F" />

      {/* Soil */}
      <Path d="M 33 60 L 67 60 L 65 70 L 35 70 Z" fill="#6D4C41" />

      {/* Main Stem */}
      <Path d="M 50 68 Q 48 30 47 18 Q 47 12 49 12 Q 51 12 51 18 Q 50 30 50 68 Z" fill="url(#stem7)" />

      {/* Side stems */}
      <Path d="M 49 40 Q 38 38 35 35 Q 35 32 37 32 Q 40 32 49 38 Z" fill="url(#stem7)" />
      <Path d="M 49 40 Q 60 38 63 35 Q 63 32 61 32 Q 58 32 49 38 Z" fill="url(#stem7)" />

      {/* Leaves */}
      <Path d="M 49 50 Q 38 47 32 50 Q 32 55 42 55 Q 48 55 49 50 Z" fill="#66BB6A" />
      <Path d="M 49 50 Q 60 47 66 50 Q 66 55 56 55 Q 50 55 49 50 Z" fill="#4CAF50" />

      {/* Center flower - pink */}
      <G>
        <Circle cx="49" cy="8" r="4" fill="url(#petal7)" />
        <Circle cx="56" cy="11" r="4" fill="url(#petal7)" />
        <Circle cx="55" cy="18" r="4" fill="url(#petal7)" />
        <Circle cx="43" cy="18" r="4" fill="url(#petal7)" />
        <Circle cx="42" cy="11" r="4" fill="url(#petal7)" />
        <Circle cx="49" cy="14" r="3.5" fill="#FDD835" />
        <Circle cx="49" cy="14" r="2" fill="#FBC02D" />
      </G>

      {/* Left flower - orange */}
      <G>
        <Circle cx="37" cy="28" r="3" fill="url(#petal7-2)" />
        <Circle cx="42" cy="30" r="3" fill="url(#petal7-2)" />
        <Circle cx="41" cy="35" r="3" fill="url(#petal7-2)" />
        <Circle cx="33" cy="35" r="3" fill="url(#petal7-2)" />
        <Circle cx="32" cy="30" r="3" fill="url(#petal7-2)" />
        <Circle cx="37" cy="32" r="2" fill="#FDD835" />
      </G>

      {/* Right flower - orange */}
      <G>
        <Circle cx="61" cy="28" r="3" fill="url(#petal7-2)" />
        <Circle cx="66" cy="30" r="3" fill="url(#petal7-2)" />
        <Circle cx="65" cy="35" r="3" fill="url(#petal7-2)" />
        <Circle cx="57" cy="35" r="3" fill="url(#petal7-2)" />
        <Circle cx="56" cy="30" r="3" fill="url(#petal7-2)" />
        <Circle cx="61" cy="32" r="2" fill="#FDD835" />
      </G>

      {/* Sparkles */}
      <Circle cx="54" cy="8" r="1.2" fill="#FFD700" opacity="0.9" />
      <Circle cx="44" cy="9" r="1" fill="#FFD700" opacity="0.8" />
      <Circle cx="58" cy="15" r="1" fill="#FFD700" opacity="0.7" />
      <Circle cx="35" cy="26" r="0.8" fill="#FFD700" opacity="0.8" />
      <Circle cx="63" cy="26" r="0.8" fill="#FFD700" opacity="0.8" />
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
      case 6:
        return renderStage6();
      case 7:
        return renderStage7();
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
export const calculateGrowthStage = (completedDays: number): 1 | 2 | 3 | 4 | 5 | 6 | 7 => {
  if (completedDays === 0) return 1;
  if (completedDays <= 3) return 2;
  if (completedDays <= 7) return 3;
  if (completedDays <= 14) return 4;
  if (completedDays <= 21) return 5;
  if (completedDays <= 30) return 6;
  return 7;
};

export default GardenGrowth;