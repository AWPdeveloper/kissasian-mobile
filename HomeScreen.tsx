import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import kissasianScraper, { Drama } from '../../services/kissasianScraper';
import databaseService from '../../services/database';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [latestDramas, setLatestDramas] = useState<Drama[]>([]);
  const [watchHistory, setWatchHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % (latestDramas.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const dramas = await kissasianScraper.getLatestDramas();
      const history = await databaseService.getWatchHistory();
      setLatestDramas(dramas);
      setWatchHistory(history);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBanner = () => {
    if (latestDramas.length === 0) return null;
    const drama = latestDramas[bannerIndex];
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DramaDetail', { drama })}
        style={styles.banner}
      >
        <Image
          source={{ uri: drama.image }}
          style={styles.bannerImage}
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>{drama.title}</Text>
          <Text style={styles.bannerStatus}>{drama.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDramaCard = (drama: Drama) => (
    <TouchableOpacity
      key={drama.id}
      onPress={() => navigation.navigate('DramaDetail', { drama })}
      style={styles.card}
    >
      <Image
        source={{ uri: drama.image }}
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle} numberOfLines={2}>
        {drama.title}
      </Text>
      <Text style={styles.cardStatus}>{drama.status}</Text>
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
      {/* Banner */}
      {renderBanner()}

      {/* Watch History */}
      {watchHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lanjutkan Menonton</Text>
          <FlatList
            data={watchHistory.slice(0, 5)}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('VideoPlayer', { episode: item })}
                style={styles.historyCard}
              >
                <Image
                  source={{ uri: item.dramaImage }}
                  style={styles.historyImage}
                />
                <Text style={styles.historyTitle} numberOfLines={1}>
                  {item.dramaTitle}
                </Text>
                <Text style={styles.episodeInfo}>
                  Ep {item.episodeNumber}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.episodeUrl}
          />
        </View>
      )}

      {/* Latest Dramas */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Drama Terbaru</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllDramas')}>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gridContainer}>
          {latestDramas.slice(0, 6).map(renderDramaCard)}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  banner: {
    height: 250,
    marginBottom: 20,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bannerStatus: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '31%',
    marginBottom: 15,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardStatus: {
    color: '#999',
    fontSize: 10,
  },
  historyCard: {
    marginRight: 15,
    width: 120,
  },
  historyImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  episodeInfo: {
    color: '#FF6B6B',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default HomeScreen;
