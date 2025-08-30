<template>
  <div class="donation-form">
    <h2 class="title">Spenden Sie für den Wasserbrunnen</h2>
    
    <div class="preset-grid">
      <button 
        v-for="amount in presets" 
        :key="amount" 
        class="preset-button"
        @click="handlePresetClick(amount)"
      >
        {{ formatEUR(amount) }}
      </button>
    </div>
    
    <div class="custom-amount">
      <label for="custom-amount">Eigener Betrag (€):</label>
      <div class="input-group">
        <input 
          id="custom-amount"
          v-model="customAmount" 
          inputmode="decimal" 
          placeholder="z.B. 12,50"
          class="amount-input"
        />
        <button 
          class="submit-button" 
          @click="handleCustomSubmit"
          :disabled="loading"
        >
          Spenden
        </button>
      </div>
    </div>
    
    <div v-if="message" class="message success">
      {{ message }}
    </div>
    
    <div v-if="error" class="message error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  loading: boolean;
  message: string | null;
  error: string | null;
  formatEUR: (amount: number) => string;
}

interface Emits {
  (e: 'donate', amount: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Voreingestellte Beträge
const presets = [2, 5, 10, 20, 50];
const customAmount = ref('');

// Voreingestellten Betrag spenden
const handlePresetClick = (amount: number) => {
  emit('donate', amount);
};

// Eigenen Betrag spenden
const handleCustomSubmit = () => {
  const amount = parseAmount(customAmount.value);
  
  if (isNaN(amount) || amount <= 0) {
    // Fehlerbehandlung könnte hier verbessert werden
    return;
  }
  
  emit('donate', amount);
  customAmount.value = ''; // Eingabefeld zurücksetzen
};

// Betrag parsen (unterstützt deutsches Format)
const parseAmount = (input: string): number => {
  const normalized = input.replace(/\./g, '').replace(',', '.').trim();
  return Number(normalized);
};
</script>

<style scoped>
.donation-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.preset-button {
  padding: 0.75rem;
  font-size: 1.25rem;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-button:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
}

.custom-amount {
  margin-bottom: 1rem;
}

.custom-amount label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.amount-input {
  flex: 1;
  padding: 0.75rem;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  background-color: #1b73e8;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: #1555b7;
}

.submit-button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-align: center;
}

.success {
  background-color: #e6f7e6;
  color: #2e7d32;
}

.error {
  background-color: #ffebee;
  color: #c62828;
}

@media (max-width: 480px) {
  .input-group {
    flex-direction: column;
  }
  
  .submit-button {
    width: 100%;
  }
}
</style>
