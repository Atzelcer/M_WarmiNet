import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  RefreshControl,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from '../components/MapViewWeb';
import { COLORS, SUCRE_COORDINATES } from '../constants/colors';
import { POSTS_COMUNIDAD, TIPOS_POST } from '../data/posts';
import CrearPostModal from '../components/CrearPostModal';

const { width } = Dimensions.get('window');

// Mapeo de imágenes de evidencias
const IMAGENES_EVIDENCIAS = {
  rojo1: require('../../assets/puntos_rojos/rojo1.jpg'),
  rojo2: require('../../assets/puntos_rojos/rojo2.jpg'),
  rojo3: require('../../assets/puntos_rojos/rojo3.jpg'),
};

const obtenerImagen = (evidencia) => {
  if (typeof evidencia === 'string') {
    return IMAGENES_EVIDENCIAS[evidencia] || null;
  }
  return evidencia; // Si ya es un require() o URI
};

export default function FeedScreen({ navigation }) {
  const [posts, setPosts] = useState(POSTS_COMUNIDAD);
  const [modalCrear, setModalCrear] = useState(false);
  const [postDetalle, setPostDetalle] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [vistaActual, setVistaActual] = useState('LISTA'); // LISTA o MAPA

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const agregarNuevoPost = (nuevoPost) => {
    // Reemplazar el placeholder si existe
    const postsActualizados = posts.filter((p) => p.tipo !== 'PLACEHOLDER');
    setPosts([nuevoPost, ...postsActualizados]);
    setModalCrear(false);
  };

  const abrirDetalle = (post) => {
    setPostDetalle(post);
    setModalDetalle(true);
  };

  const darApoyo = (postId) => {
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? { ...p, reacciones: { ...p.reacciones, apoyo: p.reacciones.apoyo + 1 } }
          : p
      )
    );
  };

  const darGracias = (postId) => {
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? { ...p, reacciones: { ...p.reacciones, gracias: p.reacciones.gracias + 1 } }
          : p
      )
    );
  };

  const renderPost = (post) => {
    const tipoInfo = TIPOS_POST[post.tipo] || TIPOS_POST.OTRO;
    const esPlaceholder = post.tipo === 'PLACEHOLDER';

    return (
      <TouchableOpacity
        key={post.id}
        style={[styles.postCard, esPlaceholder && styles.postCardPlaceholder]}
        onPress={() => !esPlaceholder && abrirDetalle(post)}
        activeOpacity={esPlaceholder ? 1 : 0.7}
      >
        {/* Header del post */}
        <View style={styles.postHeader}>
          <View style={styles.postUsuario}>
            <Text style={styles.postAvatar}>{post.avatar}</Text>
            <View>
              <Text style={styles.postNombre}>{post.usuaria}</Text>
              <Text style={styles.postFecha}>{post.fecha}</Text>
            </View>
          </View>
          {!esPlaceholder && (
            <View style={[styles.postTipoBadge, { backgroundColor: tipoInfo.color }]}>
              <Text style={styles.postTipoEmoji}>{tipoInfo.emoji}</Text>
              <Text style={styles.postTipoLabel}>{tipoInfo.label}</Text>
            </View>
          )}
        </View>

        {/* Ubicación */}
        <View style={styles.postUbicacion}>
          <Text style={styles.postUbicacionIcon}>📍</Text>
          <Text style={styles.postUbicacionTexto}>{post.ubicacion.nombre}</Text>
        </View>

        {/* Descripción */}
        <Text style={styles.postDescripcion} numberOfLines={esPlaceholder ? undefined : 4}>
          {post.descripcion}
        </Text>

        {esPlaceholder ? (
          <TouchableOpacity
            style={styles.placeholderButton}
            onPress={() => setModalCrear(true)}
          >
            <Text style={styles.placeholderButtonText}>
              ✏️ Crear mi primer post
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            {/* Evidencias */}
            {post.evidencias && post.evidencias.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.evidenciasContainer}
              >
                {post.evidencias.map((evidencia, index) => {
                  const imagen = obtenerImagen(evidencia);
                  return imagen ? (
                    <Image
                      key={index}
                      source={imagen}
                      style={styles.evidenciaImagen}
                    />
                  ) : null;
                })}
              </ScrollView>
            )}

            {/* Reacciones */}
            <View style={styles.postReacciones}>
              <TouchableOpacity
                style={styles.reaccionButton}
                onPress={() => darApoyo(post.id)}
              >
                <Text style={styles.reaccionEmoji}>💜</Text>
                <Text style={styles.reaccionTexto}>
                  {post.reacciones.apoyo} Apoyo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reaccionButton}
                onPress={() => darGracias(post.id)}
              >
                <Text style={styles.reaccionEmoji}>🙏</Text>
                <Text style={styles.reaccionTexto}>
                  {post.reacciones.gracias} Gracias
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.reaccionButton}>
                <Text style={styles.reaccionEmoji}>📤</Text>
                <Text style={styles.reaccionTexto}>Compartir</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📢 Feed Comunitario</Text>
        <TouchableOpacity onPress={() => setModalCrear(true)}>
          <Text style={styles.headerIconButton}>➕</Text>
        </TouchableOpacity>
      </View>

      {/* Toggle Vista */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, vistaActual === 'LISTA' && styles.toggleButtonActive]}
          onPress={() => setVistaActual('LISTA')}
        >
          <Text style={[styles.toggleText, vistaActual === 'LISTA' && styles.toggleTextActive]}>
            📋 Lista
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, vistaActual === 'MAPA' && styles.toggleButtonActive]}
          onPress={() => setVistaActual('MAPA')}
        >
          <Text style={[styles.toggleText, vistaActual === 'MAPA' && styles.toggleTextActive]}>
            🗺️ Mapa
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      {vistaActual === 'LISTA' ? (
        <ScrollView
          style={styles.feedContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text style={styles.feedSubtitle}>
            💜 Reportes recientes de la comunidad
          </Text>
          {posts.map((post) => renderPost(post))}
          <View style={{ height: 100 }} />
        </ScrollView>
      ) : (
        <MapView style={styles.map} initialRegion={SUCRE_COORDINATES}>
          {posts
            .filter((p) => p.tipo !== 'PLACEHOLDER')
            .map((post) => {
              const tipoInfo = TIPOS_POST[post.tipo] || TIPOS_POST.OTRO;
              return (
                <Marker
                  key={post.id}
                  coordinate={post.ubicacion}
                  pinColor={tipoInfo.color}
                  title={`${tipoInfo.emoji} ${tipoInfo.label}`}
                  description={post.descripcion.substring(0, 100)}
                  onPress={() => abrirDetalle(post)}
                />
              );
            })}
        </MapView>
      )}

      {/* Botón flotante crear post */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalCrear(true)}
      >
        <Text style={styles.floatingButtonText}>➕</Text>
      </TouchableOpacity>

      {/* Modal crear post */}
      <CrearPostModal
        visible={modalCrear}
        onClose={() => setModalCrear(false)}
        onSave={agregarNuevoPost}
      />

      {/* Modal detalle de post */}
      {postDetalle && (
        <Modal
          visible={modalDetalle}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalDetalle(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalDetalle(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>

              <ScrollView>
                {/* Usuario */}
                <View style={styles.detalleHeader}>
                  <Text style={styles.detalleAvatar}>{postDetalle.avatar}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detalleNombre}>{postDetalle.usuaria}</Text>
                    <Text style={styles.detalleFecha}>{postDetalle.fecha}</Text>
                  </View>
                  {(() => {
                    const tipoInfo = TIPOS_POST[postDetalle.tipo] || TIPOS_POST.OTRO;
                    return (
                      <View
                        style={[
                          styles.detalleTipoBadge,
                          { backgroundColor: tipoInfo.color },
                        ]}
                      >
                        <Text style={styles.detalleTipoEmoji}>{tipoInfo.emoji}</Text>
                        <Text style={styles.detalleTipoLabel}>{tipoInfo.label}</Text>
                      </View>
                    );
                  })()}
                </View>

                {/* Ubicación */}
                <View style={styles.detalleUbicacion}>
                  <Text style={styles.detalleUbicacionIcon}>📍</Text>
                  <View>
                    <Text style={styles.detalleUbicacionNombre}>
                      {postDetalle.ubicacion.nombre}
                    </Text>
                    <Text style={styles.detalleUbicacionCoords}>
                      {postDetalle.ubicacion.latitude.toFixed(5)},{' '}
                      {postDetalle.ubicacion.longitude.toFixed(5)}
                    </Text>
                  </View>
                </View>

                {/* Descripción completa */}
                <View style={styles.detalleDescripcionContainer}>
                  <Text style={styles.detalleDescripcion}>
                    {postDetalle.descripcion}
                  </Text>
                </View>

                {/* Evidencias */}
                {postDetalle.evidencias && postDetalle.evidencias.length > 0 && (
                  <View style={styles.detalleEvidencias}>
                    <Text style={styles.detalleEvidenciasTitle}>📸 Evidencias</Text>
                    {postDetalle.evidencias.map((evidencia, index) => {
                      const imagen = obtenerImagen(evidencia);
                      return imagen ? (
                        <Image
                          key={index}
                          source={imagen}
                          style={styles.detalleEvidenciaImagen}
                        />
                      ) : null;
                    })}
                  </View>
                )}

                {/* Reacciones */}
                <View style={styles.detalleReacciones}>
                  <TouchableOpacity
                    style={styles.detalleReaccionButton}
                    onPress={() => {
                      darApoyo(postDetalle.id);
                      setPostDetalle({
                        ...postDetalle,
                        reacciones: {
                          ...postDetalle.reacciones,
                          apoyo: postDetalle.reacciones.apoyo + 1,
                        },
                      });
                    }}
                  >
                    <Text style={styles.detalleReaccionEmoji}>💜</Text>
                    <Text style={styles.detalleReaccionTexto}>
                      {postDetalle.reacciones.apoyo} Apoyo
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.detalleReaccionButton}
                    onPress={() => {
                      darGracias(postDetalle.id);
                      setPostDetalle({
                        ...postDetalle,
                        reacciones: {
                          ...postDetalle.reacciones,
                          gracias: postDetalle.reacciones.gracias + 1,
                        },
                      });
                    }}
                  >
                    <Text style={styles.detalleReaccionEmoji}>🙏</Text>
                    <Text style={styles.detalleReaccionTexto}>
                      {postDetalle.reacciones.gracias} Gracias
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Mapa pequeño */}
                <View style={styles.detalleMapContainer}>
                  <MapView
                    style={styles.detalleMapa}
                    initialRegion={{
                      ...postDetalle.ubicacion,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                  >
                    <Marker
                      coordinate={postDetalle.ubicacion}
                      pinColor={
                        TIPOS_POST[postDetalle.tipo]?.color || TIPOS_POST.OTRO.color
                      }
                    />
                  </MapView>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    color: 'white',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerIconButton: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 25,
    padding: 5,
    elevation: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.neutral,
  },
  toggleTextActive: {
    color: 'white',
  },
  feedContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  feedSubtitle: {
    fontSize: 14,
    color: COLORS.neutral,
    textAlign: 'center',
    marginBottom: 15,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  postCardPlaceholder: {
    borderWidth: 3,
    borderColor: COLORS.secondary1,
    borderStyle: 'dashed',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  postUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    fontSize: 32,
    marginRight: 10,
  },
  postNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  postFecha: {
    fontSize: 12,
    color: COLORS.neutral,
  },
  postTipoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  postTipoEmoji: {
    fontSize: 14,
    marginRight: 5,
  },
  postTipoLabel: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  postUbicacion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 10,
  },
  postUbicacionIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  postUbicacionTexto: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  postDescripcion: {
    fontSize: 15,
    color: COLORS.primary,
    lineHeight: 22,
    marginBottom: 15,
  },
  evidenciasContainer: {
    marginBottom: 15,
  },
  evidenciaImagen: {
    width: 150,
    height: 150,
    borderRadius: 15,
    marginRight: 10,
  },
  postReacciones: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  reaccionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reaccionEmoji: {
    fontSize: 18,
    marginRight: 5,
  },
  reaccionTexto: {
    fontSize: 14,
    color: COLORS.neutral,
    fontWeight: '500',
  },
  placeholderButton: {
    backgroundColor: COLORS.secondary1,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  placeholderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  floatingButtonText: {
    fontSize: 32,
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    maxHeight: '90%',
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalCloseText: {
    fontSize: 28,
    color: COLORS.neutral,
  },
  detalleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detalleAvatar: {
    fontSize: 40,
    marginRight: 10,
  },
  detalleNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  detalleFecha: {
    fontSize: 13,
    color: COLORS.neutral,
  },
  detalleTipoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  detalleTipoEmoji: {
    fontSize: 16,
    marginRight: 5,
  },
  detalleTipoLabel: {
    fontSize: 13,
    color: 'white',
    fontWeight: 'bold',
  },
  detalleUbicacion: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 15,
    marginBottom: 15,
  },
  detalleUbicacionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  detalleUbicacionNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  detalleUbicacionCoords: {
    fontSize: 12,
    color: COLORS.neutral,
    marginTop: 3,
  },
  detalleDescripcionContainer: {
    marginBottom: 15,
  },
  detalleDescripcion: {
    fontSize: 15,
    color: COLORS.primary,
    lineHeight: 24,
  },
  detalleEvidencias: {
    marginBottom: 15,
  },
  detalleEvidenciasTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  detalleEvidenciaImagen: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 10,
  },
  detalleReacciones: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 15,
  },
  detalleReaccionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  detalleReaccionEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  detalleReaccionTexto: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  detalleMapContainer: {
    marginTop: 10,
  },
  detalleMapa: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
});
