// Posts de la comunidad - Situaciones reportadas en tiempo real

// Mapeo de imágenes locales
export const IMAGENES_EVIDENCIA = {
  rojo1: require('../../assets/puntos_rojos/rojo1.jpg'),
  rojo2: require('../../assets/puntos_rojos/rojo2.jpg'),
  rojo3: require('../../assets/puntos_rojos/rojo3.jpg'),
};

export const POSTS_COMUNIDAD = [
  {
    id: 1,
    usuaria: 'María G.',
    avatar: '👩',
    fecha: '2026-03-08 12:15',
    ubicacion: {
      latitude: -19.04550,
      longitude: -65.26280,
      nombre: 'Calle menos iluminada - Centro',
    },
    descripcion: 'Grupo de hombres acosando verbalmente a mujeres que pasan. Están bebiendo en la esquina. Zona muy oscura por la noche. Recomiendo evitar esta calle después de las 6pm. Por favor tengan cuidado.',
    evidencias: [
      'rojo2',
    ],
    tipo: 'ACOSO',
    reacciones: {
      apoyo: 23,
      gracias: 45,
    },
  },
  {
    id: 2,
    usuaria: 'Carmen L.',
    avatar: '👩‍🦱',
    fecha: '2026-03-08 10:00',
    ubicacion: {
      latitude: -19.04787,
      longitude: -65.25965,
      nombre: 'German Busch - Altura gasolinera',
    },
    descripcion: 'Intentaron robarme hace 30 minutos. Un hombre me siguió desde la parada de micro. Logré correr a un lugar con más gente. TENGAN CUIDADO en esta zona, especialmente en horas de poca afluencia.',
    evidencias: [
      'rojo3',
    ],
    tipo: 'ROBO_INTENTO',
    reacciones: {
      apoyo: 67,
      gracias: 89,
    },
  },
  {
    id: 3,
    usuaria: 'Ana P.',
    avatar: '👱‍♀️',
    fecha: '2026-03-08 08:45',
    ubicacion: {
      latitude: -19.04650,
      longitude: -65.26100,
      nombre: 'Plaza Principal',
    },
    descripcion: 'Hay un vehículo sospechoso rondando la zona. Es una camioneta oscura sin placas visibles. Vuelve a pasar cada 15 minutos. Ya reporté a la policía pero aún no llegan. Manténganse alertas chicas.',
    evidencias: [
      'rojo1',
    ],
    tipo: 'ZONA_PELIGROSA',
    reacciones: {
      apoyo: 34,
      gracias: 56,
    },
  },
  {
    id: 4,
    usuaria: 'Sofía R.',
    avatar: '👩‍🦰',
    fecha: '2026-03-07 18:30',
    ubicacion: {
      latitude: -19.04890,
      longitude: -65.26450,
      nombre: 'Parque Bolivar - Zona Este',
    },
    descripcion: 'Me están siguiendo. Llevo 3 cuadras caminando rápido y el tipo sigue detrás de mí. Voy a entrar a una tienda. Por favor si alguien está cerca que me ayude.',
    evidencias: [],
    tipo: 'SEGUIMIENTO',
    reacciones: {
      apoyo: 89,
      gracias: 102,
    },
  },
  {
    id: 5,
    usuaria: 'Lucia M.',
    avatar: '👩',
    fecha: '2026-03-07 14:20',
    ubicacion: {
      latitude: -19.04320,
      longitude: -65.25890,
      nombre: 'Av. Jaime Mendoza',
    },
    descripcion: 'Acaban de asaltar a una señora en la esquina. Los ladrones huyeron en moto. Cuidado si transitan por aquí. Ya llamamos a la policía y ambulancia.',
    evidencias: [
      'rojo2',
    ],
    tipo: 'ROBO_INTENTO',
    reacciones: {
      apoyo: 145,
      gracias: 178,
    },
  },
];

export const TIPOS_POST = {
  ACOSO: { emoji: '😰', color: '#FF6B6B', label: 'Acoso' },
  ROBO_INTENTO: { emoji: '🚨', color: '#DC143C', label: 'Intento de robo' },
  SEGUIMIENTO: { emoji: '👁️', color: '#FF8C00', label: 'Me están siguiendo' },
  ZONA_PELIGROSA: { emoji: '⚠️', color: '#FFA500', label: 'Zona peligrosa' },
  AYUDA: { emoji: '🆘', color: '#FF0000', label: 'Necesito ayuda' },
  OTRO: { emoji: '📢', color: '#8B4789', label: 'Otro' },
};
