import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

const DAILY_REMINDER_ID = 'daily-reminder'

/**
 * Request notification permission from the user.
 * Returns true if granted.
 */
export async function requestPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false

  const { status: existing } = await Notifications.getPermissionsAsync()
  if (existing === 'granted') return true

  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

/**
 * Schedule (or reschedule) the daily reminder notification.
 * Cancels any existing reminder first, then schedules a new repeating one.
 *
 * @param timeLocal - HH:mm format (e.g. "09:00")
 */
export async function scheduleDailyReminder(timeLocal: string): Promise<void> {
  if (Platform.OS === 'web') return

  const granted = await requestPermission()
  if (!granted) return

  // Cancel existing reminder before scheduling a new one
  await cancelAllReminders()

  const [hourStr, minStr] = timeLocal.split(':')
  const hour = parseInt(hourStr, 10)
  const minute = parseInt(minStr, 10)

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: 'Your studio is open',
      body: "Today's prompts are ready. Time to draw.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  })
}

/**
 * Cancel all scheduled reminder notifications.
 * Call on sign-out to clean up.
 */
export async function cancelAllReminders(): Promise<void> {
  if (Platform.OS === 'web') return
  await Notifications.cancelAllScheduledNotificationsAsync()
}
