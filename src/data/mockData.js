// Datos simulados para la app
export const PUNTOS_ROJOS = [
  {
    id: 1,
    coordinate: {
      latitude: -19.048,
      longitude: -65.260,
    },
    descripcion: 'Grupo de hombres acosando en la esquina',
    foto: require('../../assets/puntos_rojos/rojo1.jpg'),
    fecha: '2026-03-07',
    gracias: 15,
  },
  {
    id: 2,
    coordinate: {
      latitude: -19.050,
      longitude: -65.258,
    },
    descripcion: 'Calle muy oscura sin iluminación, reportes de acoso',
    foto: require('../../assets/puntos_rojos/rojo2.jpg'),
    fecha: '2026-03-06',
    gracias: 23,
  },
  {
    id: 3,
    coordinate: {
      latitude: -19.045,
      longitude: -65.262,
    },
    descripcion: 'Zona peligrosa, robos frecuentes a mujeres',
    foto: require('../../assets/puntos_rojos/rojo3.jpg'),
    fecha: '2026-03-05',
    gracias: 18,
  },
];

export const INCIDENTES_PANICO = [
  {
    id: 1,
    nombre: 'Incidente Calle Loa',
    coordinate: {
      latitude: -19.048,
      longitude: -65.260,
    },
    ruta: [
      { latitude: -19.048, longitude: -65.260 },
      { latitude: -19.0482, longitude: -65.2605 },
      { latitude: -19.0485, longitude: -65.2610 },
      { latitude: -19.0488, longitude: -65.2615 },
    ],
    // video: require('../../assets/panico/panico1.mp4'),
    // audio: require('../../assets/panico/panico1_audio.mp3'),
  },
  {
    id: 2,
    nombre: 'Incidente Avenida Venezuela',
    coordinate: {
      latitude: -19.044,
      longitude: -65.257,
    },
    ruta: [
      { latitude: -19.044, longitude: -65.257 },
      { latitude: -19.0443, longitude: -65.2575 },
      { latitude: -19.0446, longitude: -65.2580 },
      { latitude: -19.0449, longitude: -65.2585 },
    ],
    // video: require('../../assets/panico/panico1.mp4'),
    // audio: require('../../assets/panico/panico2_audio.mp3'),
  },
  {
    id: 3,
    nombre: 'Incidente Plaza 25 de Mayo',
    coordinate: {
      latitude: -19.042,
      longitude: -65.255,
    },
    ruta: [
      { latitude: -19.042, longitude: -65.255 },
      { latitude: -19.0423, longitude: -65.2555 },
      { latitude: -19.0426, longitude: -65.2560 },
      { latitude: -19.0429, longitude: -65.2565 },
    ],
    // video: require('../../assets/panico/panico1.mp4'),
    // audio: require('../../assets/panico/panico1_audio.mp3'),
  },
];

export const RUTAS_SEGURAS = [
  {
    id: 1,
    nombre: 'Casa → USFX',
    inicio: {
      latitude: -19.044,
      longitude: -65.257,
    },
    fin: {
      latitude: -19.042,
      longitude: -65.255,
    },
    tiempoMinutos: 30,
    tiempoDemo: 30, // segundos para demo
  },
  {
    id: 2,
    nombre: 'Trabajo → Casa',
    inicio: {
      latitude: -19.046,
      longitude: -65.259,
    },
    fin: {
      latitude: -19.044,
      longitude: -65.257,
    },
    tiempoMinutos: 25,
    tiempoDemo: 25,
  },
  {
    id: 3,
    nombre: 'Fiesta → Casa',
    inicio: {
      latitude: -19.050,
      longitude: -65.262,
    },
    fin: {
      latitude: -19.044,
      longitude: -65.257,
    },
    tiempoMinutos: 35,
    tiempoDemo: 35,
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
