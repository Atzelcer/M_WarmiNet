import React from 'react';
import { Platform } from 'react-native';
import RNMapView, { Marker as RNMarker, Circle as RNCircle, Polyline as RNPolyline } from 'react-native-maps';

// Export directo de react-native-maps para Android/iOS
// En web no funcionará, pero la app es solo para Android
export default RNMapView;
export const Marker = RNMarker;
export const Circle = RNCircle;
export const Polyline = RNPolyline;

