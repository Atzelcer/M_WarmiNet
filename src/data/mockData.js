// Datos simulados para la app - COORDENADAS REALES DE SUCRE, BOLIVIA

// PUNTOS ROJOS - 3 casos específicos
export const PUNTOS_ROJOS = [
  {
    id: 1,
    coordinate: {
      latitude: -19.04790,
      longitude: -65.26180,
    },
    titulo: 'Alrededores Mercado Central',
    descripcion: 'Calles Ravelo y Junín - Zona con reportes de acoso y robos',
    foto: require('../../assets/puntos_rojos/rojo1.jpg'),
    fecha: '2026-03-07',
    gracias: 15,
  },
  {
    id: 2,
    coordinate: {
      latitude: -19.04550,
      longitude: -65.26280,
    },
    titulo: 'Calle menos iluminada',
    descripcion: 'Entre centro y Parque Bolívar - Acoso frecuente, poca iluminación',
    foto: require('../../assets/puntos_rojos/rojo2.jpg'),
    fecha: '2026-03-06',
    gracias: 23,
  },
  {
    id: 3,
    coordinate: {
      latitude: -19.04787,
      longitude: -65.25965,
    },
    titulo: 'Calle German Busch - Gasolinera',
    descripcion: 'Zona peligrosa, robos frecuentes a mujeres',
    foto: require('../../assets/puntos_rojos/rojo3.jpg'),
    fecha: '2026-03-05',
    gracias: 18,
  },
];

// INCIDENTES DE PÁNICO - 3 simulaciones
export const INCIDENTES_PANICO = [
  {
    id: 1,
    nombre: 'Caso 1: Yo presiono pánico',
    tipo: 'YO_PANICO',
    coordinate: {
      latitude: -19.04787,
      longitude: -65.25965,
    },
    // Ruta corta alrededor de la plaza (±0.0002)
    ruta: [
      { latitude: -19.04787, longitude: -65.25965 },
      { latitude: -19.04807, longitude: -65.25975 },
      { latitude: -19.04827, longitude: -65.25985 },
      { latitude: -19.04847, longitude: -65.25995 },
      { latitude: -19.04867, longitude: -65.26005 },
      { latitude: -19.04887, longitude: -65.25995 },
      { latitude: -19.04907, longitude: -65.25985 },
      { latitude: -19.04927, longitude: -65.25975 },
    ],
    descripcion: 'Presioné el botón de pánico y me estoy moviendo dejando rastros',
  },
  {
    id: 2,
    nombre: 'Caso 2: Veo el pánico de otra mujer',
    tipo: 'VER_PANICO',
    coordinate: {
      latitude: -19.04550,
      longitude: -65.26280,
    },
    ruta: [
      { latitude: -19.04550, longitude: -65.26280 },
      { latitude: -19.04560, longitude: -65.26290 },
      { latitude: -19.04570, longitude: -65.26300 },
      { latitude: -19.04580, longitude: -65.26310 },
      { latitude: -19.04590, longitude: -65.26320 },
    ],
    descripcion: 'Otra mujer presionó pánico y puedo ver su rastro',
  },
  {
    id: 3,
    nombre: 'Caso 3: Yo presiono pánico (segundo caso)',
    tipo: 'YO_PANICO',
    coordinate: {
      latitude: -19.04787,
      longitude: -65.25965,
    },
    ruta: [
      { latitude: -19.04787, longitude: -65.25965 },
      { latitude: -19.04797, longitude: -65.25975 },
      { latitude: -19.04817, longitude: -65.25985 },
      { latitude: -19.04837, longitude: -65.25995 },
      { latitude: -19.04857, longitude: -65.26005 },
      { latitude: -19.04877, longitude: -65.26015 },
    ],
    descripcion: 'Presioné el botón de pánico y estoy en movimiento',
  },
];

// RUTAS SEGURAS - 3 trayectos
export const RUTAS_SEGURAS = [
  {
    id: 1,
    nombre: 'Ruta 1: Casa → USFX',
    inicio: {
      latitude: -19.04580,
      longitude: -65.26550,
    },
    fin: {
      latitude: -19.04720,
      longitude: -65.25980,
    },
    tiempoMinutos: 30,
    tiempoDemo: 30, // segundos para demo
    estado: 'COMPLETO', // Siguió todo bien
  },
  {
    id: 2,
    nombre: 'Ruta 2: Trabajo → Casa',
    inicio: {
      latitude: -19.04750,
      longitude: -65.25940,
    },
    fin: {
      latitude: -19.04580,
      longitude: -65.26550,
    },
    tiempoMinutos: 25,
    tiempoDemo: 25,
    estado: 'DESVIO_LLEGO', // Se desvió un poco pero llegó
  },
  {
    id: 3,
    nombre: 'Ruta 3: Fiesta → Casa',
    inicio: {
      latitude: -19.04350,
      longitude: -65.25900,
    },
    fin: {
      latitude: -19.04580,
      longitude: -65.26550,
    },
    tiempoMinutos: 35,
    tiempoDemo: 35,
    estado: 'DESVIO_QUEDO', // Se desvió y se quedó ahí
  },
];

export const USUARIOS_DEMO = {
  mujer: {
    nombre: 'María González',
    ci: '12345678 SC',
    celular: '70123456',
    ciudad: 'Sucre',
    personasConfianza: [
      {
        nombre: 'Rosa González',
        ci: '87654321 SC',
        relacion: 'Mamá',
        celular: '70654321',
      },
      {
        nombre: 'Ana López',
        ci: '11223344 SC',
        relacion: 'Hermana',
        celular: '70112233',
      },
      {
        nombre: 'Carmen Pérez',
        ci: '55667788 SC',
        relacion: 'Amiga',
        celular: '70556677',
      },
    ],
  },
};
