// Posts de la comunidad - Situaciones reportadas en tiempo real

export const POSTS_COMUNIDAD = [
  {
    id: 1,
    usuaria: 'Usuario Actual',
    avatar: '👤',
    fecha: '2026-03-08 14:30',
    ubicacion: {
      latitude: -19.04790,
      longitude: -65.26180,
      nombre: 'Alrededores Mercado Central',
    },
    descripcion: 'Este será tu primer post. Podrás subir foto y descripción de lo que está pasando.',
    evidencias: [],
    tipo: 'PLACEHOLDER', // Este será reemplazado por post real del usuario
    reacciones: {
      apoyo: 0,
      gracias: 0,
    },
  },
  {
    id: 2,
    usuaria: 'María G.',
    avatar: '👩',
    fecha: '2026-03-08 12:15',
    ubicacion: {
      latitude: -19.04550,
      longitude: -65.26280,
      nombre: 'Calle menos iluminada - Centro',
    },
    descripcion: 'Grupo de hombres acosando verbalmente a mujeres que pasan. Están bebiendo en la esquina. Zona muy oscura por la noche. Recomiendo evitar esta calle después de las 6pm.',
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
    id: 3,
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
];

export const TIPOS_POST = {
  ACOSO: { emoji: '😰', color: '#FF6B6B', label: 'Acoso' },
  ROBO_INTENTO: { emoji: '🚨', color: '#DC143C', label: 'Intento de robo' },
  SEGUIMIENTO: { emoji: '👁️', color: '#FF8C00', label: 'Me están siguiendo' },
  ZONA_PELIGROSA: { emoji: '⚠️', color: '#FFA500', label: 'Zona peligrosa' },
  AYUDA: { emoji: '🆘', color: '#FF0000', label: 'Necesito ayuda' },
  OTRO: { emoji: '📢', color: '#8B4789', label: 'Otro' },
};
