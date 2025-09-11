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

        <linearGradient id="waterGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#90CAF9;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1976D2;stop-opacity:1" />
        </linearGradient>

        <linearGradient id="waterGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#64B5F6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1565C0;stop-opacity:1" />
        </linearGradient>

        <filter id="waterBlur" x="0" y="0" width="100%" height="100%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>

        <!-- Mehrere Wellenmuster für komplexere Animation -->
        <pattern id="wave1" x="0" y="0" width="40" height="10" patternUnits="userSpaceOnUse">
          <path d="M0 5 Q5 0 10 5 T20 5 T30 5 T40 5 V10 H0 Z" fill="url(#waterGradient1)">
            <animate attributeName="d"
                     values="M0 5 Q5 0 10 5 T20 5 T30 5 T40 5 V10 H0 Z;
                             M0 5 Q5 10 10 5 T20 5 T30 5 T40 5 V10 H0 Z;
                             M0 5 Q5 0 10 5 T20 5 T30 5 T40 5 V10 H0 Z"
                     dur="3s"
                     repeatCount="indefinite" />
          </path>
        </pattern>

        <pattern id="wave2" x="0" y="0" width="60" height="15" patternUnits="userSpaceOnUse">
          <path d="M0 7.5 Q7.5 0 15 7.5 T30 7.5 T45 7.5 T60 7.5 V15 H0 Z" fill="url(#waterGradient2)" opacity="0.7">
            <animate attributeName="d"
                     values="M0 7.5 Q7.5 0 15 7.5 T30 7.5 T45 7.5 T60 7.5 V15 H0 Z;
                             M0 7.5 Q7.5 15 15 7.5 T30 7.5 T45 7.5 T60 7.5 V15 H0 Z;
                             M0 7.5 Q7.5 0 15 7.5 T30 7.5 T45 7.5 T60 7.5 V15 H0 Z"
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

      <!-- Wasserfüllung mit verbesserter Animation -->
      <g clip-path="url(#wellCavity)">
        <!-- Hintergrund für tieferes Wasser -->
        <rect x="62" :y="calcY + 5" width="76" :height="calcH" fill="#0D47A1" opacity="0.2" />

        <!-- Mehrere Wellenschichten für mehr Tiefe ohne horizontale Bewegung -->
        <rect :y="calcY" x="62" width="76" :height="calcH" fill="url(#wave2)" opacity="0.9" filter="url(#waterBlur)" />

        <rect :y="calcY - 3" x="62" width="76" :height="calcH" fill="url(#wave1)" opacity="0.8" />

        <!-- Wellenoberfläche mit Bewegung -->
        <path :d="`M62 ${calcY} Q75 ${calcY - 3} 88 ${calcY} T114 ${calcY} T138 ${calcY} V${calcY + calcH} H62 Z`"
              fill="#64B5F6" opacity="0.3" filter="url(#waterBlur)">
          <animate attributeName="d"
                   :values="`M62 ${calcY} Q75 ${calcY - 3} 88 ${calcY} T114 ${calcY} T138 ${calcY} V${calcY + calcH} H62 Z;
                             M62 ${calcY} Q75 ${calcY + 3} 88 ${calcY} T114 ${calcY} T138 ${calcY} V${calcY + calcH} H62 Z;
                             M62 ${calcY} Q75 ${calcY - 3} 88 ${calcY} T114 ${calcY} T138 ${calcY} V${calcY + calcH} H62 Z`"
                   dur="2s"
                   repeatCount="indefinite" />
        </path>

        <!-- Verbesserte Glanzeffekte auf dem Wasser -->
        <ellipse
          cx="100"
          :cy="calcY + 15"
          rx="30"
          ry="4"
          fill="white"
          opacity="0.25"
          filter="url(#waterBlur)"
          v-if="calcH > 20">
          <animate attributeName="opacity" values="0.25;0.4;0.25" dur="3s" repeatCount="indefinite" />
          <animate attributeName="rx" values="30;32;30" dur="5s" repeatCount="indefinite" />
        </ellipse>

        <!-- Mehrere Blasen im Wasser mit unterschiedlichen Bewegungen -->
        <g opacity="0.7">
          <circle cx="75" :cy="calcY + calcH/2" r="1.5" fill="white">
            <animate attributeName="cy" :from="calcY + calcH - 5" :to="calcY + 5" dur="7s" repeatCount="indefinite" />
            <animate attributeName="cx" values="75;77;75" dur="7s" repeatCount="indefinite" />
          </circle>

          <circle cx="95" :cy="calcY + calcH/3" r="1" fill="white">
            <animate attributeName="cy" :from="calcY + calcH - 10" :to="calcY + 10" dur="9s" repeatCount="indefinite" />
            <animate attributeName="r" values="1;1.2;1" dur="4s" repeatCount="indefinite" />
          </circle>

          <circle cx="115" :cy="calcY + calcH*0.6" r="1.8" fill="white">
            <animate attributeName="cy" :from="calcY + calcH - 8" :to="calcY + 8" dur="8s" repeatCount="indefinite" />
            <animate attributeName="cx" values="115;113;115" dur="8s" repeatCount="indefinite" />
          </circle>

          <circle cx="85" :cy="calcY + calcH*0.7" r="0.8" fill="white">
            <animate attributeName="cy" :from="calcY + calcH - 12" :to="calcY + 12" dur="10s" repeatCount="indefinite" />
          </circle>
        </g>
      </g>

      <!-- Prozent-Text mit besserem Styling und Anzeige des fehlenden Betrags -->
      <g>
        <text x="100" y="140" text-anchor="middle" font-size="20" fill="white" style="font-weight:700; text-shadow: 0 0 4px rgba(0,0,0,0.7);">
          {{ percent }}%
        </text>
        <text x="100" y="160" text-anchor="middle" font-size="12" fill="white" style="font-weight:500; text-shadow: 0 0 3px rgba(0,0,0,0.7);">
          erreicht
        </text>
        <text x="100" y="180" text-anchor="middle" font-size="12" fill="white" style="font-weight:500; text-shadow: 0 0 3px rgba(0,0,0,0.7);">
          Noch {{ remainingText }}
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
// Berechnung des noch fehlenden Betrags
const remaining = computed(() => Math.max(0, props.goal - props.total));
const remainingText = computed(() => formatEUR(remaining.value));
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
  background-color: #3e3d3d;
  background-image: linear-gradient(to bottom, #bcd4fb, #917b02);
  padding: 2rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
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
