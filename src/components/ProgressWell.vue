<template>
  <div 
    class="well" 
    role="progressbar" 
    :aria-valuenow="percent" 
    aria-valuemin="0" 
    aria-valuemax="100"
  >
    <svg viewBox="0 0 200 260" class="w-full h-auto">
      <!-- Brunnen-Silhouette mit Schatten und Texturen -->
      <defs>
        <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#6D4C41;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#8B4513;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#6D4C41;stop-opacity:1" />
        </linearGradient>
        
        <filter id="woodTexture" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.3" />
        </filter>
        
        <clipPath id="wellCavity">
          <rect x="62" y="80" width="76" height="118" rx="6" />
        </clipPath>
        
        <radialGradient id="waterGradient" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:#64B5F6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1976D2;stop-opacity:1" />
        </radialGradient>
        
        <pattern id="wave" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10 Q10 0 20 10 T40 10 V20 H0 Z" fill="url(#waterGradient)">
            <animate attributeName="d" 
                     values="M0 10 Q10 0 20 10 T40 10 V20 H0 Z;
                             M0 10 Q10 20 20 10 T40 10 V20 H0 Z;
                             M0 10 Q10 0 20 10 T40 10 V20 H0 Z" 
                     dur="4s" 
                     repeatCount="indefinite" />
          </path>
        </pattern>
      </defs>
      
      <!-- Brunnen-Basis mit Holztextur -->
      <rect x="40" y="20" width="120" height="20" rx="4" fill="url(#woodGradient)" filter="url(#woodTexture)" />
      <rect x="50" y="40" width="20" height="160" fill="url(#woodGradient)" filter="url(#woodTexture)" />
      <rect x="130" y="40" width="20" height="160" fill="url(#woodGradient)" filter="url(#woodTexture)" />
      <rect x="60" y="200" width="80" height="40" rx="6" fill="url(#woodGradient)" filter="url(#woodTexture)" />
      
      <!-- Dekorative Elemente -->
      <circle cx="60" cy="30" r="3" fill="#5D4037" />
      <circle cx="140" cy="30" r="3" fill="#5D4037" />
      
      <!-- Schatten für die Basis -->
      <rect x="60" y="200" width="80" height="40" rx="6" fill="transparent" filter="url(#shadow)" />
      
      <!-- Wasserfüllung mit Animation -->
      <g clip-path="url(#wellCavity)">
        <!-- Hintergrund für tieferes Wasser -->
        <rect x="62" :y="calcY + 5" width="76" :height="calcH" fill="#1565C0" opacity="0.3" />
        
        <!-- Animierte Wasserwellen -->
        <rect :y="calcY" x="62" width="76" :height="calcH" fill="url(#wave)" opacity="0.9">
          <animate attributeName="x" from="62" to="22" dur="3s" repeatCount="indefinite" />
        </rect>
        
        <!-- Glanzeffekt auf dem Wasser -->
        <ellipse 
          cx="100" 
          :cy="calcY + 20" 
          rx="30" 
          ry="5" 
          fill="white" 
          opacity="0.2"
          v-if="calcH > 30">
          <animate attributeName="opacity" values="0.2;0.3;0.2" dur="3s" repeatCount="indefinite" />
        </ellipse>
        
        <!-- Kleine Blasen im Wasser -->
        <circle cx="80" :cy="calcY + calcH/2" r="2" fill="white" opacity="0.6">
          <animate attributeName="cy" :from="calcY + calcH - 5" :to="calcY + 5" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="110" :cy="calcY + calcH/3" r="1.5" fill="white" opacity="0.6">
          <animate attributeName="cy" :from="calcY + calcH - 10" :to="calcY + 10" dur="6s" repeatCount="indefinite" />
        </circle>
      </g>
      
      <!-- Prozent-Text mit besserem Styling -->
      <g>
        <text x="100" y="140" text-anchor="middle" font-size="20" fill="white" style="font-weight:700; text-shadow: 0 0 4px rgba(0,0,0,0.7);">
          {{ percent }}%
        </text>
        <text x="100" y="160" text-anchor="middle" font-size="12" fill="white" style="font-weight:500; text-shadow: 0 0 3px rgba(0,0,0,0.7);">
          erreicht
        </text>
      </g>
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
// Ensure the percentage is correctly calculated and capped at 100%
const percent = computed(() => Math.min(100, Math.round(props.progress * 100)));
</script>

<style scoped>
.well {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 360px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.well:hover svg {
  transform: scale(1.02);
}

svg {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.15));
  transition: transform 0.3s ease;
}

.legend {
  text-align: center;
  font-size: 1.1rem;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.title {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--secondary-color, #8B4513);
}

.amounts {
  color: #555;
  font-weight: 500;
}

@media (max-width: 480px) {
  .well {
    max-width: 300px;
  }
  
  .legend {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }
}
</style>
