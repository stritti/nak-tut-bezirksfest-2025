<template>
  <div 
    class="well" 
    role="progressbar" 
    :aria-valuenow="percent" 
    aria-valuemin="0" 
    aria-valuemax="100"
  >
    <svg viewBox="0 0 200 260" class="w-full h-auto">
      <!-- Brunnen-Silhouette -->
      <rect x="40" y="20" width="120" height="20" rx="4" fill="#8B4513" />
      <rect x="50" y="40" width="20" height="160" fill="#8B4513" />
      <rect x="130" y="40" width="20" height="160" fill="#8B4513" />
      <rect x="60" y="200" width="80" height="40" rx="6" fill="#8B4513" />
      
      <!-- Wasserfüllung -->
      <defs>
        <clipPath id="wellCavity">
          <rect x="62" y="80" width="76" height="118" rx="6" />
        </clipPath>
        <pattern id="wave" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10 Q10 0 20 10 T40 10 V20 H0 Z" fill="#1b73e8" />
        </pattern>
      </defs>
      
      <g clip-path="url(#wellCavity)">
        <rect :y="calcY" x="62" width="76" :height="calcH" fill="url(#wave)">
          <animate attributeName="x" from="62" to="22" dur="3s" repeatCount="indefinite" />
        </rect>
      </g>
      
      <!-- Prozent-Text -->
      <text x="100" y="180" text-anchor="middle" font-size="18" fill="white" style="font-weight:600;">
        {{ percent }}%
      </text>
    </svg>
    
    <div class="legend">
      <div class="title">{{ title }}</div>
      <div class="amounts">{{ totalText }} / {{ goalText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  progress: number;
  total: number;
  goal: number;
  title: string;
}

const props = defineProps<Props>();

// Berechnung der Höhe und Position der Wasserfüllung
const calcH = computed(() => 118 * Math.min(1, Math.max(0, props.progress)));
const calcY = computed(() => 198 - calcH.value); // 80 + 118 - h

// Formatierung der Beträge
const formatEUR = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(amount);
};

const totalText = computed(() => formatEUR(props.total));
const goalText = computed(() => formatEUR(props.goal));
const percent = computed(() => Math.round(props.progress * 100));
</script>

<style scoped>
.well {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 360px;
  margin: 0 auto;
}

svg {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.legend {
  text-align: center;
  font-size: 1rem;
}

.title {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.amounts {
  color: #666;
}
</style>
