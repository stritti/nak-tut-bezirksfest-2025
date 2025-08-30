<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ProgressWell from './components/ProgressWell.vue'
import DonationForm from './components/DonationForm.vue'
import { ApiClient } from './services/api/apiClient'
import { NocoDBService } from './services/nocodb/nocodbService'
import { useDonations } from './composables/useDonations'
import type { Stats } from './services/models/types'

// NocoDB API-Client und Service initialisieren
const apiClient = new ApiClient({
  baseURL: import.meta.env.VITE_NOCODB_API_URL,
  apiKey: import.meta.env.VITE_NOCODB_API_KEY,
})

const nocodbService = new NocoDBService(apiClient)

// Zustandsvariablen
const stats = ref<Stats | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const message = ref<string | null>(null)

// Donations Composable verwenden
const { formatEUR, loadStats, addDonation, syncQueue } = useDonations(nocodbService)

// Datum formatieren
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Spende verarbeiten
const handleDonate = async (amount: number) => {
  loading.value = true
  message.value = null
  error.value = null

  try {
    // Projektnamen an die Spende übergeben, falls vorhanden
    await addDonation(amount, stats.value?.projectName)
    message.value = `Vielen Dank für Ihre Spende von ${formatEUR(amount)}!`
    await loadStats() // Statistik aktualisieren
  } catch (err) {
    console.error('Fehler beim Hinzufügen der Spende:', err)
    error.value = 'Spende konnte nicht gespeichert werden'
  } finally {
    loading.value = false
  }
}

// Statistik laden
const fetchStats = async () => {
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

// Polling-Intervall für Statistik-Updates
let statsInterval: number | undefined

onMounted(async () => {
  // Initiale Statistik laden
  await fetchStats()

  // Offline-Queue synchronisieren, wenn online
  if (navigator.onLine) {
    await syncQueue()
  }

  // Event-Listener für Online-Status
  window.addEventListener('online', syncQueue)

  // Regelmäßiges Update der Statistik (alle 30 Sekunden)
  statsInterval = window.setInterval(fetchStats, 30000)
})

onUnmounted(() => {
  // Aufräumen
  if (statsInterval) {
    clearInterval(statsInterval)
  }

  // Event-Listener entfernen
  window.removeEventListener('online', syncQueue)
})
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="title">{{ stats?.projectName || 'Wasserbrunnen Afrika' }}</h1>
      <p class="subtitle">
        Helfen Sie mit, den Brunnen zu finanzieren!
        <strong>Ziel: {{ formatEUR(stats?.goal_eur || 5000) }}</strong>
      </p>
    </header>

    <main class="main">
      <div v-if="loading && !stats" class="loading">
        <p>Daten werden geladen...</p>
      </div>

      <div v-else-if="error && !stats" class="error-message">
        <p>{{ error }}</p>
        <button @click="fetchStats" class="retry-button">Erneut versuchen</button>
      </div>

      <template v-else-if="stats">
        <ProgressWell
          :progress="stats.progress"
          :total="stats.total_eur"
          :goal="stats.goal_eur"
          :title="stats.projectName || 'Wasserbrunnen Afrika'"
        />

        <DonationForm
          :loading="loading"
          :message="message"
          :error="error"
          :formatEUR="formatEUR"
          @donate="handleDonate"
        />
      </template>
    </main>

    <footer class="footer">
      <p v-if="stats?.last_donation" class="last-donation">
        Letzte Spende: {{ formatEUR(stats.last_donation.amount_eur) }} ({{
          formatDate(stats.last_donation.timestamp)
        }})
      </p>
      <p class="status">
        <span v-if="loading">Wird geladen...</span>
        <span v-else>Stand wird alle 30 Sekunden aktualisiert</span>
      </p>
    </footer>
  </div>
</template>

<style>
/* Globale Styles */
:root {
  --primary-color: #1b73e8;
  --secondary-color: #8b4513;
  --background-color: #f5f5f5;
  --text-color: #333;
  --light-text: #666;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}
</style>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--light-text);
}

.main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
  min-height: 400px;
}

.loading,
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 0.75rem;
  text-align: center;
  min-height: 200px;
}

.error-message {
  color: #c62828;
  background-color: #ffebee;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.footer {
  text-align: center;
  font-size: 0.9rem;
  color: var(--light-text);
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.last-donation {
  margin-bottom: 0.5rem;
  font-style: italic;
}

.status {
  font-size: 0.8rem;
}

@media (max-width: 600px) {
  .app {
    padding: 1rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
</style>
