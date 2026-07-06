import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import { useRoute } from '@react-navigation/native';
import kissasianScraper, { VideoSource } from '../../services/kissasianScraper';
import databaseService from '../../services/database';

const { width, height } = Dimensions.get('window');

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isFullscreen: boolean;
  selectedQuality: string;
  showControls: boolean;
}

const VideoPlayerScreen = () => {
  const route = useRoute();
  const { episode } = route.params as any;
  const videoRef = useRef<Video>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isFullscreen: false,
    selectedQuality: '720p',
    showControls: true,
  });

  const [videoSources, setVideoSources] = useState<VideoSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  useEffect(() => {
    loadVideoSources();
  }, []);

  const loadVideoSources = async () => {
    try {
      setLoading(true);
      const sources = await kissasianScraper.getVideoSources(episode.episodeUrl);
      setVideoSources(sources);

      // Pilih kualitas terbaik yang tersedia
      const bestQuality = sources.find(s => s.quality.includes('1080')) ||
                         sources.find(s => s.quality.includes('720')) ||
                         sources[0];

      if (bestQuality) {
        setCurrentVideoUrl(bestQuality.url);
        setPlayerState(prev => ({ ...prev, selectedQuality: bestQuality.quality }));
      }
    } catch (error) {
      console.error('Error loading video sources:', error);
      Alert.alert('Error', 'Gagal memuat video. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleForward = () => {
    const newTime = Math.min(playerState.currentTime + 10, playerState.duration);
    videoRef.current?.seek(newTime);
  };

  const handleBackward = () => {
    const newTime = Math.max(playerState.currentTime - 10, 0);
    videoRef.current?.seek(newTime);
  };

  const handleProgress = (data: any) => {
    setPlayerState(prev => ({
      ...prev,
      currentTime: data.currentTime,
    }));

    // Simpan progress ke database
    if (data.currentTime % 5 < 0.1) { // Save every 5 seconds
      databaseService.addToWatchHistory({
        dramaId: episode.dramaId,
        dramaTitle: episode.dramaTitle,
        dramaImage: episode.dramaImage,
        episodeNumber: episode.episodeNumber,
        episodeUrl: episode.episodeUrl,
        lastWatchedAt: Date.now(),
        currentTime: data.currentTime,
        duration: data.duration,
      });
    }
  };

  const handleLoad = (data: any) => {
    setPlayerState(prev => ({
      ...prev,
      duration: data.duration,
    }));
  };

  const changeQuality = (quality: string) => {
    const source = videoSources.find(s => s.quality === quality);
    if (source) {
      setCurrentVideoUrl(source.url);
      setPlayerState(prev => ({ ...prev, selectedQuality: quality }));
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours > 0 ? hours + ':' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleControls = () => {
    setPlayerState(prev => ({ ...prev, showControls: !prev.showControls }));
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setPlayerState(prev => ({ ...prev, showControls: false }));
    }, 3000);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!currentVideoUrl) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Video tidak tersedia</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={toggleControls}
        style={styles.videoContainer}
      >
        <Video
          ref={videoRef}
          source={{ uri: currentVideoUrl }}
          style={styles.video}
          controls={false}
          paused={!playerState.isPlaying}
          onProgress={handleProgress}
          onLoad={handleLoad}
          resizeMode="contain"
          progressUpdateInterval={500}
        />

        {playerState.showControls && (
          <View style={styles.controls}>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <Text style={styles.title} numberOfLines={1}>
                {episode.dramaTitle} - Ep {episode.episodeNumber}
              </Text>
            </View>

            {/* Center Controls */}
            <View style={styles.centerControls}>
              <TouchableOpacity
                onPress={handleBackward}
                style={styles.controlButton}
              >
                <Text style={styles.controlIcon}>⏪ -10s</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePlayPause}
                style={styles.playButton}
              >
                <Text style={styles.playIcon}>
                  {playerState.isPlaying ? '⏸' : '▶'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleForward}
                style={styles.controlButton}
              >
                <Text style={styles.controlIcon}>⏩ +10s</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${(playerState.currentTime / playerState.duration) * 100}%`,
                    },
                  ]}
                />
              </View>

              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>
                  {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
                </Text>
              </View>

              {/* Quality Selector */}
              <View style={styles.qualityContainer}>
                {videoSources.map(source => (
                  <TouchableOpacity
                    key={source.quality}
                    onPress={() => changeQuality(source.quality)}
                    style={[
                      styles.qualityButton,
                      playerState.selectedQuality === source.quality && styles.qualityButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.qualityText,
                        playerState.selectedQuality === source.quality && styles.qualityTextActive,
                      ]}
                    >
                      {source.quality}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controls: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
  },
  topBar: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  controlButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  controlIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#fff',
    fontSize: 28,
  },
  bottomBar: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    gap: 10,
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF6B6B',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
  },
  qualityContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  qualityButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  qualityButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  qualityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  qualityTextActive: {
    color: '#fff',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoPlayerScreen;
