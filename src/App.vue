<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ProgressWell from './components/ProgressWell.vue';
import DonationForm from './components/DonationForm.vue';

// Simulierte Daten für die Entwicklung
const stats = ref({
  projectName: 'Wasserbrunnen Afrika',
  goal_eur: 5000,
  total_eur: 1250,
  progress: 0.25,
  last_donation: {
    timestamp: new Date().toISOString(),
    amount_eur: 50,
    channel: 'kiosk',
    note: ''
  }
});

const loading = ref(false);
const error = ref<string | null>(null);
const message = ref<string | null>(null);

// Formatierung von Geldbeträgen
const formatEUR = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(amount);
};

// Datum formatieren
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Spende verarbeiten
const handleDonate = async (amount: number) => {
  loading.value = true;
  message.value = null;
  error.value = null;
  
  try {
    // Hier würde die API-Anfrage erfolgen
    // Simuliere eine erfolgreiche Spende
    setTimeout(() => {
      stats.value.total_eur += amount;
      stats.value.progress = Math.min(1, stats.value.total_eur / stats.value.goal_eur);
      stats.value.last_donation = {
        timestamp: new Date().toISOString(),
        amount_eur: amount,
        channel: 'kiosk',
        note: ''
      };
      
      message.value = `Vielen Dank für Ihre Spende von ${formatEUR(amount)}!`;
      loading.value = false;
    }, 1000);
  } catch (err) {
    console.error('Fehler beim Hinzufügen der Spende:', err);
    error.value = 'Spende konnte nicht gespeichert werden';
    loading.value = false;
  }
};

// Polling-Intervall für Statistik-Updates
let statsInterval: number | undefined;

onMounted(() => {
  // Regelmäßiges Update der Statistik (alle 30 Sekunden)
  // In der realen Implementierung würde hier die API abgefragt werden
  statsInterval = window.setInterval(() => {
    // Simuliere API-Abfrage
  }, 30000);
});

onUnmounted(() => {
  // Aufräumen
  if (statsInterval) {
    clearInterval(statsInterval);
  }
});
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="title">{{ stats.projectName }}</h1>
      <p class="subtitle">
        Helfen Sie mit, den Brunnen zu finanzieren!
        <strong>Ziel: {{ formatEUR(stats.goal_eur) }}</strong>
      </p>
    </header>

    <main class="main">
      <ProgressWell
        :progress="stats.progress"
        :total="stats.total_eur"
        :goal="stats.goal_eur"
        :title="stats.projectName"
      />

      <DonationForm
        :loading="loading"
        :message="message"
        :error="error"
        :formatEUR="formatEUR"
        @donate="handleDonate"
      />
    </main>

    <footer class="footer">
      <p v-if="stats.last_donation" class="last-donation">
        Letzte Spende: {{ formatEUR(stats.last_donation.amount_eur) }} 
        ({{ formatDate(stats.last_donation.timestamp) }})
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
  --secondary-color: #8B4513;
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
