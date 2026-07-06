import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WatchHistory {
  dramaId: string;
  dramaTitle: string;
  dramaImage: string;
  episodeNumber: number;
  episodeUrl: string;
  lastWatchedAt: number;
  currentTime: number;
  duration: number;
}

export interface Favorite {
  dramaId: string;
  dramaTitle: string;
  dramaImage: string;
  dramaUrl: string;
  addedAt: number;
}

class DatabaseService {
  private WATCH_HISTORY_KEY = 'watch_history';
  private FAVORITES_KEY = 'favorites';
  private SETTINGS_KEY = 'settings';

  // Watch History Methods
  async addToWatchHistory(item: WatchHistory): Promise<void> {
    try {
      const history = await this.getWatchHistory();
      const existingIndex = history.findIndex(h => h.episodeUrl === item.episodeUrl);
      
      if (existingIndex > -1) {
        history[existingIndex] = { ...item, lastWatchedAt: Date.now() };
      } else {
        history.unshift(item);
      }

      // Keep only last 50 items
      if (history.length > 50) {
        history.pop();
      }

      await AsyncStorage.setItem(this.WATCH_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error adding to watch history:', error);
    }
  }

  async getWatchHistory(): Promise<WatchHistory[]> {
    try {
      const data = await AsyncStorage.getItem(this.WATCH_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting watch history:', error);
      return [];
    }
  }

  async removeFromWatchHistory(episodeUrl: string): Promise<void> {
    try {
      const history = await this.getWatchHistory();
      const filtered = history.filter(h => h.episodeUrl !== episodeUrl);
      await AsyncStorage.setItem(this.WATCH_HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing from watch history:', error);
    }
  }

  async clearWatchHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.WATCH_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing watch history:', error);
    }
  }

  // Favorites Methods
  async addToFavorites(item: Favorite): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const exists = favorites.some(f => f.dramaId === item.dramaId);
      
      if (!exists) {
        favorites.unshift(item);
        await AsyncStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }

  async removeFromFavorites(dramaId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const filtered = favorites.filter(f => f.dramaId !== dramaId);
      await AsyncStorage.setItem(this.FAVORITES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  }

  async getFavorites(): Promise<Favorite[]> {
    try {
      const data = await AsyncStorage.getItem(this.FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  async isFavorite(dramaId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(f => f.dramaId === dramaId);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  }

  // Settings Methods
  async saveSettings(settings: Record<string, any>): Promise<void> {
    try {
      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  async getSettings(): Promise<Record<string, any>> {
    try {
      const data = await AsyncStorage.getItem(this.SETTINGS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  }
}

export default new DatabaseService();
