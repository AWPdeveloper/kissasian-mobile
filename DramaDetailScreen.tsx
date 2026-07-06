import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import kissasianScraper, { Drama, Episode } from '../../services/kissasianScraper';
import databaseService, { Favorite } from '../../services/database';

const DramaDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { drama: initialDrama } = route.params as any;

  const [drama, setDrama] = useState<Drama>(initialDrama);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadDramaDetails();
    checkFavorite();
  }, []);

  const loadDramaDetails = async () => {
    try {
      setLoading(true);
      const { drama: detailedDrama, episodes: dramaEpisodes } =
        await kissasianScraper.getDramaDetails(initialDrama.url);
      setDrama(detailedDrama);
      setEpisodes(dramaEpisodes.reverse()); // Reverse untuk episode terbaru di atas
    } catch (error) {
      console.error('Error loading drama details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    const favorite = await databaseService.isFavorite(initialDrama.id);
    setIsFavorite(favorite);
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      await databaseService.removeFromFavorites(drama.id);
    } else {
      const favorite: Favorite = {
        dramaId: drama.id,
        dramaTitle: drama.title,
        dramaImage: drama.image,
        dramaUrl: drama.url,
        addedAt: Date.now(),
      };
      await databaseService.addToFavorites(favorite);
    }
    setIsFavorite(!isFavorite);
  };

  const handleEpisodePress = (episode: Episode) => {
    navigation.navigate('VideoPlayer', {
      episode: {
        dramaId: drama.id,
        dramaTitle: drama.title,
        dramaImage: drama.image,
        episodeNumber: episode.episodeNumber,
        episodeUrl: episode.url,
      },
    });
  };

  const renderEpisode = ({ item }: { item: Episode }) => (
    <TouchableOpacity
      onPress={() => handleEpisodePress(item)}
      style={styles.episodeCard}
    >
      <Text style={styles.episodeNumber}>Ep {item.episodeNumber}</Text>
      <Text style={styles.episodeTitle} numberOfLines={1}>
        {item.title}
      </Text>
      {item.releaseDate && (
        <Text style={styles.episodeDate}>{item.releaseDate}</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Poster */}
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: drama.image }}
          style={styles.poster}
        />
        <TouchableOpacity
          onPress={toggleFavorite}
          style={styles.favoriteButton}
        >
          <Text style={styles.favoriteIcon}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{drama.title}</Text>
        <Text style={styles.status}>{drama.status}</Text>

        {drama.genre && drama.genre.length > 0 && (
          <View style={styles.genreContainer}>
            {drama.genre.map((g, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{g}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={() => handleEpisodePress(episodes[0])}
          style={styles.playButton}
        >
          <Text style={styles.playButtonText}>▶ Mulai Menonton</Text>
        </TouchableOpacity>
      </View>

      {/* Episodes */}
      <View style={styles.episodesContainer}>
        <Text style={styles.episodesTitle}>
          Daftar Episode ({episodes.length})
        </Text>
        <FlatList
          data={episodes}
          renderItem={renderEpisode}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.episodeRow}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  posterContainer: {
    position: 'relative',
    alignItems: 'center',
    paddingVertical: 20,
  },
  poster: {
    width: 200,
    height: 280,
    borderRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 24,
  },
  infoContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  genreTag: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  playButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  episodesContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  episodesTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  episodeRow: {
    gap: 10,
    marginBottom: 10,
  },
  episodeCard: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
  },
  episodeNumber: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  episodeTitle: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 4,
  },
  episodeDate: {
    color: '#999',
    fontSize: 10,
  },
});

export default DramaDetailScreen;
