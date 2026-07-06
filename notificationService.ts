import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import kissasianScraper from './kissasianScraper';

const NOTIFICATION_TASK = 'CHECK_NEW_DRAMAS';
const LAST_CHECK_KEY = 'last_drama_check';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  async sendNotification(title: string, body: string, data?: any) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: 'default',
      },
      trigger: null, // Send immediately
    });
  }

  async scheduleNotifications() {
    // Register background task
    TaskManager.defineTask(NOTIFICATION_TASK, async () => {
      try {
        const lastCheck = await AsyncStorage.getItem(LAST_CHECK_KEY);
        const lastCheckTime = lastCheck ? parseInt(lastCheck) : 0;
        const now = Date.now();

        // Check every 6 hours
        if (now - lastCheckTime > 6 * 60 * 60 * 1000) {
          const dramas = await kissasianScraper.getLatestDramas();
          
          if (dramas.length > 0) {
            const latestDrama = dramas[0];
            await this.sendNotification(
              '🎬 Drama Baru!',
              `${latestDrama.title} telah dirilis`,
              { dramaId: latestDrama.id, dramaUrl: latestDrama.url }
            );
          }

          await AsyncStorage.setItem(LAST_CHECK_KEY, now.toString());
        }

        return TaskManager.BackgroundFetchResult.NewData;
      } catch (error) {
        console.error('Error in notification task:', error);
        return TaskManager.BackgroundFetchResult.Failed;
      }
    });

    // Register background fetch
    try {
      await Notifications.registerTaskAsync(NOTIFICATION_TASK, {
        minimumInterval: 60 * 60, // Check every hour
        stopOnTerminate: false,
        startOnBoot: true,
      });
    } catch (error) {
      console.error('Error registering notification task:', error);
    }
  }

  async unscheduleNotifications() {
    try {
      await Notifications.unregisterTaskAsync(NOTIFICATION_TASK);
    } catch (error) {
      console.error('Error unregistering notification task:', error);
    }
  }
}

export default new NotificationService();
