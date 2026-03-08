// OpenStreetMap implementation - 100% FREE, no API key needed
import OpenStreetMapView from './OpenStreetMapView';

// Exportar el componente OSM como MapView
export default OpenStreetMapView;

// Componentes compatibles con react-native-maps API
// (OpenStreetMapView ya maneja los marcadores internamente)
export const Marker = ({ children, ...props }) => null;
export const Polyline = ({ children, ...props }) => null;
export const Circle = ({ children, ...props }) => null;

