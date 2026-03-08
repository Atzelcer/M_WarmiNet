import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/colors';

export default function RadarAnimation({ size = 80, color = COLORS.secondary1 }) {
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createWaveAnimation = (wave, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(wave, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(wave, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation1 = createWaveAnimation(wave1, 0);
    const animation2 = createWaveAnimation(wave2, 600);
    const animation3 = createWaveAnimation(wave3, 1200);

    animation1.start();
    animation2.start();
    animation3.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, []);

  const createWaveStyle = (wave) => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 2,
    borderColor: color,
    opacity: wave.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 0],
    }),
    transform: [
      {
        scale: wave.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 2.5],
        }),
      },
    ],
  });

  return (
    <View style={[styles.container, { width: size * 2.5, height: size * 2.5 }]}>
      <Animated.View style={createWaveStyle(wave1)} />
      <Animated.View style={createWaveStyle(wave2)} />
      <Animated.View style={createWaveStyle(wave3)} />
      
      {/* Punto central */}
      <View style={[styles.centerDot, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={styles.innerDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerDot: {
    backgroundColor: COLORS.secondary1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.secondary1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  innerDot: {
    width: '60%',
    height: '60%',
    borderRadius: 100,
    backgroundColor: 'white',
  },
});
