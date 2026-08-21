import { useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';

const TRACK_HEIGHT = 4;
const THUMB_SIZE = 22;

interface PriceRangeSliderProps {
  min: number;
  max: number;
  low: number;
  high: number;
  step?: number;
  onChange: (low: number, high: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function snap(value: number, step: number) {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
}

/**
 * Çift tutamaklı fiyat aralığı slider'ı.
 * StyleSheet kullanır — NativeWind absolute/yüzde stilleri RN'de bazen boyutsuz kalır.
 */
export function PriceRangeSlider({
  min,
  max,
  low,
  high,
  step = 100,
  onChange,
  onDragStart,
  onDragEnd,
}: PriceRangeSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);

  const trackWidthRef = useRef(0);
  const trackPageXRef = useRef(0);
  const trackRef = useRef<View>(null);
  const startLowRef = useRef(low);
  const startHighRef = useRef(high);
  const valuesRef = useRef({ low, high, min, max, step, onChange, onDragStart, onDragEnd });
  valuesRef.current = { low, high, min, max, step, onChange, onDragStart, onDragEnd };

  const range = Math.max(max - min, 1);
  const lowRatio = clamp((low - min) / range, 0, 1);
  const highRatio = clamp((high - min) / range, 0, 1);

  const measureTrack = () => {
    trackRef.current?.measureInWindow((x, _y, width) => {
      trackPageXRef.current = x;
      trackWidthRef.current = width;
      setTrackWidth(width);
    });
  };

  const onTrackLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    trackWidthRef.current = width;
    setTrackWidth(width);
    measureTrack();
  };

  const valueFromPageX = (pageX: number) => {
    const width = trackWidthRef.current;
    if (width <= 0) return valuesRef.current.min;
    const { min: minV, max: maxV, step: stepV } = valuesRef.current;
    const ratio = clamp((pageX - trackPageXRef.current) / width, 0, 1);
    return clamp(snap(minV + ratio * (maxV - minV), stepV), minV, maxV);
  };

  const lowPan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          measureTrack();
          startLowRef.current = valuesRef.current.low;
          valuesRef.current.onDragStart?.();
        },
        onPanResponderMove: (_event, gesture) => {
          const width = trackWidthRef.current || 1;
          const { min: minV, max: maxV, step: stepV, high: highV, onChange: emit } =
            valuesRef.current;
          const delta = (gesture.dx / width) * (maxV - minV);
          const nextLow = clamp(
            snap(startLowRef.current + delta, stepV),
            minV,
            highV,
          );
          emit(nextLow, highV);
        },
        onPanResponderRelease: () => valuesRef.current.onDragEnd?.(),
        onPanResponderTerminate: () => valuesRef.current.onDragEnd?.(),
      }),
    [],
  );

  const highPan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          measureTrack();
          startHighRef.current = valuesRef.current.high;
          valuesRef.current.onDragStart?.();
        },
        onPanResponderMove: (_event, gesture) => {
          const width = trackWidthRef.current || 1;
          const { min: minV, max: maxV, step: stepV, low: lowV, onChange: emit } =
            valuesRef.current;
          const delta = (gesture.dx / width) * (maxV - minV);
          const nextHigh = clamp(
            snap(startHighRef.current + delta, stepV),
            lowV,
            maxV,
          );
          emit(lowV, nextHigh);
        },
        onPanResponderRelease: () => valuesRef.current.onDragEnd?.(),
        onPanResponderTerminate: () => valuesRef.current.onDragEnd?.(),
      }),
    [],
  );

  const trackPan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          measureTrack();
          const tapped = valueFromPageX(event.nativeEvent.pageX);
          const { low: currentLow, high: currentHigh, onChange: emit } =
            valuesRef.current;
          if (Math.abs(tapped - currentLow) <= Math.abs(tapped - currentHigh)) {
            emit(Math.min(tapped, currentHigh), currentHigh);
          } else {
            emit(currentLow, Math.max(tapped, currentLow));
          }
        },
      }),
    [],
  );

  const lowLeft = trackWidth * lowRatio - THUMB_SIZE / 2;
  const highLeft = trackWidth * highRatio - THUMB_SIZE / 2;
  const activeLeft = trackWidth * lowRatio;
  const activeWidth = Math.max(trackWidth * (highRatio - lowRatio), TRACK_HEIGHT);

  return (
    <View style={styles.wrapper}>
      <View
        ref={trackRef}
        style={styles.trackHitArea}
        onLayout={onTrackLayout}
        {...trackPan.panHandlers}
      >
        <View style={styles.track} />
        {trackWidth > 0 && (
          <View
            pointerEvents="none"
            style={[styles.activeTrack, { left: activeLeft, width: activeWidth }]}
          />
        )}

        {trackWidth > 0 && (
          <>
            <View
              style={[styles.thumb, { left: lowLeft }]}
              {...lowPan.panHandlers}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            />
            <View
              style={[styles.thumb, { left: highLeft }]}
              {...highPan.panHandlers}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: THUMB_SIZE + 12,
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 4,
    paddingHorizontal: THUMB_SIZE / 2,
  },
  trackHitArea: {
    height: 32,
    justifyContent: 'center',
    overflow: 'visible',
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  activeTrack: {
    position: 'absolute',
    top: (32 - TRACK_HEIGHT) / 2,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: '#F97316',
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#F97316',
    top: (32 - THUMB_SIZE) / 2,
    zIndex: 2,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.5,
  },
});
