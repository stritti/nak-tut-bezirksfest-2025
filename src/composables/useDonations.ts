import { ref, computed } from 'vue'
import { NocoDBService } from '../services/nocodb/nocodbService'
import type { Stats } from '../services/models/types'
import { enqueue, dequeueAll, hasQueue } from '../utils/queue'

/**
 * Composable für die Verwaltung von Spenden
 */
export function useDonations(nocodbService: NocoDBService) {
  const stats = ref<Stats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const message = ref<string | null>(null)

  // Formatierung von Geldbeträgen
  const formatEUR = (amount: number): string => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  // Prozentsatz für die Anzeige
  const percentComplete = computed(() => {
    if (!stats.value) return 0
    return Math.round(stats.value.progress * 100)
  })

  // Statistiken laden
  const loadStats = async () => {
    loading.value = true
    error.value = null

    try {
      stats.value = await nocodbService.getStats()
    } catch (err) {
      console.error('Fehler beim Laden der Statistik:', err)
      error.value = 'Statistik konnte nicht geladen werden'
    } finally {
      loading.value = false
    }
  }

  // Spende hinzufügen
  const addDonation = async (amount: number, projectName?: string, paymentMethod?: 'bar' | 'paypal') => {
    loading.value = true
    message.value = null
    error.value = null

    try {
      const response = await nocodbService.addDonation(amount, 'kiosk', projectName, paymentMethod)

      if (response.success) {
        message.value = `Vielen Dank für Ihre Spende von ${formatEUR(amount)}!`
        await loadStats() // Statistik aktualisieren
      } else {
        throw new Error(response.error || 'Unbekannter Fehler')
      }
    } catch (err) {
      console.error('Fehler beim Hinzufügen der Spende:', err)
      error.value = 'Spende konnte nicht gespeichert werden'

      // Offline-Fallback: Spende in Queue speichern
      enqueue(amount, 'kiosk', projectName)
      message.value = `Offline-Modus: Ihre Spende von ${formatEUR(amount)} wird später synchronisiert.`
    } finally {
      loading.value = false
    }
  }

  // Offline-Queue synchronisieren
  const syncQueue = async () => {
    if (!hasQueue()) return

    const entries = dequeueAll()
    for (const entry of entries) {
      try {
        await nocodbService.addDonation(entry.amount, entry.channel, entry.projectName)
      } catch (err) {
        // Bei Fehler: Eintrag zurück in die Queue
        enqueue(entry.amount, entry.channel, entry.projectName)
        break
      }
    }

    // Statistik aktualisieren
    await loadStats()
  }

  // Initialisierung
  const initialize = async () => {
    await loadStats()

    // Offline-Queue synchronisieren, wenn online
    if (navigator.onLine) {
      await syncQueue()
    }

    // Event-Listener für Online-Status
    window.addEventListener('online', syncQueue)
  }

  return {
    stats,
    loading,
    error,
    message,
    percentComplete,
    formatEUR,
    loadStats,
    addDonation,
    syncQueue,
    initialize,
  }
}
