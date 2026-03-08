import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';
import { POSTS_COMUNIDAD, TIPOS_POST, IMAGENES_EVIDENCIA } from '../data/posts';
import CrearPostModal from '../components/CrearPostModal';

const { width } = Dimensions.get('window');

export default function FeedScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarPosts();
  }, []);

  const cargarPosts = async () => {
    try {
      const postsGuardados = await AsyncStorage.getItem('@posts_comunidad');
      if (postsGuardados) {
        const postsParseados = JSON.parse(postsGuardados);
        // Combinar posts guardados con posts de ejemplo
        setPosts([...postsParseados, ...POSTS_COMUNIDAD]);
      } else {
        setPosts(POSTS_COMUNIDAD);
      }
    } catch (error) {
      console.log('Error cargando posts:', error);
      setPosts(POSTS_COMUNIDAD);
    }
  };

  const guardarNuevoPost = async (nuevoPost) => {
    try {
      const postsActuales = await AsyncStorage.getItem('@posts_comunidad');
      const postsArray = postsActuales ? JSON.parse(postsActuales) : [];
      
      const postsActualizados = [nuevoPost, ...postsArray];
      await AsyncStorage.setItem('@posts_comunidad', JSON.stringify(postsActualizados));
      
      setPosts([nuevoPost, ...posts]);
      setModalVisible(false);
    } catch (error) {
      console.log('Error guardando post:', error);
      Alert.alert('Error', 'No se pudo guardar el post');
    }
  };

  const darApoyo = async (postId) => {
    const postsActualizados = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          reacciones: {
            ...post.reacciones,
            apoyo: post.reacciones.apoyo + 1,
          },
        };
      }
      return post;
    });
    setPosts(postsActualizados);
    
    // Vibración de feedback (si está disponible)
    try {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Haptics no disponible
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarPosts();
    setRefreshing(false);
  };

  const renderPost = (post) => {
    const tipoInfo = TIPOS_POST[post.tipo] || TIPOS_POST.OTRO;
    
    return (
      <View key={post.id} style={styles.postCard}>
        {/* Header del post */}
        <View style={styles.postHeader}>
          <View style={styles.postUsuario}>
            <Text style={styles.postAvatar}>{post.avatar}</Text>
            <View>
              <Text style={styles.postNombre}>{post.usuaria}</Text>
              <Text style={styles.postFecha}>{post.fecha}</Text>
            </View>
          </View>
          <View style={[styles.tipoBadge, { backgroundColor: tipoInfo.color }]}>
            <Text style={styles.tipoBadgeText}>
              {tipoInfo.emoji} {tipoInfo.label}
            </Text>
          </View>
        </View>

        {/* Ubicación */}
        <View style={styles.postUbicacion}>
          <Text style={styles.postUbicacionIcon}>📍</Text>
          <Text style={styles.postUbicacionTexto}>{post.ubicacion.nombre}</Text>
        </View>

        {/* Descripción */}
        <Text style={styles.postDescripcion}>{post.descripcion}</Text>

        {/* Evidencias (fotos) */}
        {post.evidencias && post.evidencias.length > 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.evidenciasContainer}
          >
            {post.evidencias.map((evidencia, index) => {
              // Si la evidencia es una key (string como 'rojo1'), usa el mapeo
              // Si es una URI (del usuario), usa la URI directamente
              const imageSource = typeof evidencia === 'string' && IMAGENES_EVIDENCIA[evidencia]
                ? IMAGENES_EVIDENCIA[evidencia]
                : { uri: evidencia };

              return (
                <Image
                  key={index}
                  source={imageSource}
                  style={styles.evidenciaImagen}
                  resizeMode="cover"
                />
              );
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
              Apoyo ({post.reacciones.apoyo})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reaccionButton}
            onPress={() => Alert.alert('Gracias', 'Has agradecido este post')}
          >
            <Text style={styles.reaccionEmoji}>🙏</Text>
            <Text style={styles.reaccionTexto}>
              Gracias ({post.reacciones.gracias})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reaccionButton}
            onPress={() => Alert.alert(
              'Compartir',
              '¿Compartir este post con tus contactas de confianza?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Compartir', onPress: () => Alert.alert('Compartido', '✅ Post compartido') },
              ]
            )}
          >
            <Text style={styles.reaccionEmoji}>📤</Text>
            <Text style={styles.reaccionTexto}>Compartir</Text>
          </TouchableOpacity>
        </View>
      </View>
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
        <View style={{ width: 40 }} />
      </View>

      {/* Lista de posts */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📢</Text>
            <Text style={styles.emptyTitle}>Aún no hay posts</Text>
            <Text style={styles.emptyText}>
              Sé la primera en compartir una situación con la comunidad
            </Text>
          </View>
        ) : (
          posts.map(post => renderPost(post))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botón flotante para crear post */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>✏️ Crear Post</Text>
      </TouchableOpacity>

      {/* Modal para crear post */}
      <CrearPostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={guardarNuevoPost}
      />
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
  content: {
    flex: 1,
    padding: 15,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.neutral,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  postAvatar: {
    fontSize: 40,
    marginRight: 12,
  },
  postNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  postFecha: {
    fontSize: 12,
    color: COLORS.neutral,
    marginTop: 2,
  },
  tipoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  tipoBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  postUbicacion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  postUbicacionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  postUbicacionTexto: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    flex: 1,
  },
  postDescripcion: {
    fontSize: 15,
    color: COLORS.primary,
    lineHeight: 22,
    marginBottom: 12,
  },
  evidenciasContainer: {
    marginBottom: 15,
  },
  evidenciaImagen: {
    width: width * 0.6,
    height: 200,
    borderRadius: 15,
    marginRight: 10,
  },
  postReacciones: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  reaccionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  reaccionEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  reaccionTexto: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
