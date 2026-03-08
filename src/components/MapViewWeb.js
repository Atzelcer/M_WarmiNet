import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';

// Wrapper para MapView compatible con web
export const MapView = ({ children, initialRegion, region, style, ...props }) => {
  if (Platform.OS === 'web') {
    // En web, mostrar un iframe con OpenStreetMap
    const center = region || initialRegion;
    const lat = center?.latitude || -19.046;
    const lng = center?.longitude || -65.259;
    
    return (
      <View style={[styles.webMap, style]}>
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`}
          allowFullScreen
        />
      </View>
    );
  }
  
  // En móvil, usar react-native-maps real
  const RealMapView = require('react-native-maps').default;
  return (
    <RealMapView
      initialRegion={initialRegion}
      region={region}
      style={style}
      {...props}
    >
      {children}
    </RealMapView>
  );
};

export const Marker = ({ coordinate, title, description, children, ...props }) => {
  if (Platform.OS === 'web') {
    // En web, los marcadores se muestran en el iframe
    return null;
  }
  
  const RealMarker = require('react-native-maps').Marker;
  return (
    <RealMarker
      coordinate={coordinate}
      title={title}
      description={description}
      {...props}
    >
      {children}
    </RealMarker>
  );
};

export const Circle = (props) => {
  if (Platform.OS === 'web') return null;
  const RealCircle = require('react-native-maps').Circle;
  return <RealCircle {...props} />;
};

export const Polyline = (props) => {
  if (Platform.OS === 'web') return null;
  const RealPolyline = require('react-native-maps').Polyline;
  return <RealPolyline {...props} />;
};

const styles = StyleSheet.create({
  webMap: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
});

export default MapView;
