<template>
  <div class="beamer-view">
    <ProgressWell
      v-if="stats"
      :progress="stats.progress"
      :total="stats.total_eur"
      :goal="stats.goal_eur"
      :title="stats.projectName || 'Wasserbrunnen Afrika'"
    />
    <div v-else class="loading">
      <p>Daten werden geladen...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ProgressWell from '../components/ProgressWell.vue';
import { ApiClient } from '../services/api/apiClient';
import { NocoDBService } from '../services/nocodb/nocodbService';
import type { Stats } from '../services/models/types';

// NocoDB API-Client und Service initialisieren
const apiClient = new ApiClient({
  baseURL: import.meta.env.VITE_NOCODB_API_URL,
  apiKey: import.meta.env.VITE_NOCODB_API_KEY,
});

const nocodbService = new NocoDBService(apiClient);
const stats = ref<Stats | null>(null);

// Statistik laden
const fetchStats = async () => {
  try {
    stats.value = await nocodbService.getStats();
  } catch (err) {
    console.error('Fehler beim Laden der Statistik:', err);
  }
};

// Polling-Intervall für Statistik-Updates
let statsInterval: number | undefined;

onMounted(async () => {
  // Initiale Statistik laden
  await fetchStats();

  // Regelmäßiges Update der Statistik (alle 5 Sekunden für Beamer-Ansicht)
  statsInterval = window.setInterval(fetchStats, 5000);
  
  // Vollbildmodus aktivieren, wenn möglich
  document.addEventListener('click', requestFullscreen);
});

onUnmounted(() => {
  // Aufräumen
  if (statsInterval) {
    clearInterval(statsInterval);
  }
  document.removeEventListener('click', requestFullscreen);
});

// Vollbildmodus anfordern
const requestFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.log(`Fehler beim Aktivieren des Vollbildmodus: ${err.message}`);
    });
  }
};
</script>

<style scoped>
.beamer-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 2rem;
}

.loading {
  font-size: 2rem;
  color: #666;
  text-align: center;
}

/* Überschreiben der ProgressWell-Größe für Beamer */
:deep(.well) {
  max-width: 80vw !important;
  transform: scale(1.5);
  margin: 5rem auto;
}

@media (min-width: 1200px) {
  :deep(.well) {
    transform: scale(2);
    margin: 8rem auto;
  }
}
</style>
