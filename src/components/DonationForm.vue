<template>
  <div class="donation-form">
    <h2 class="title">Spenden Sie für den Wasserbrunnen</h2>
    <p class="disclaimer">Diese Spendenaktion ist unabhängig vom Sonderopfer 2025.</p>

    <div class="payment-method">
      <label class="method-label">Zahlungsmethode:</label>
      <div class="method-options">
        <label class="method-option">
          <input type="radio" v-model="paymentMethod" value="bar" name="payment-method">
          <span>Bar</span>
        </label>
        <label class="method-option">
          <input type="radio" v-model="paymentMethod" value="paypal" name="payment-method">
          <span>PayPal</span>
        </label>
      </div>
    </div>

    <!-- Modal für Zahlungshinweise -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">&times;</button>
        <h3>Vielen Dank für Ihre Spende!</h3>

        <div v-if="paymentMethod === 'bar'" class="modal-body">
          <p>Bitte werfen Sie Ihre Barspende in den Opferkasten am Stand.</p>
        </div>

        <div v-else-if="paymentMethod === 'paypal'" class="modal-body">
          <p>Bitte scannen Sie den QR-Code, um zum PayPal Moneypool zu gelangen:</p>
          <div class="qr-code-container">
            <div class="qr-code">QR-Code zum PayPal Moneypool</div>
          </div>
        </div>

        <button class="modal-button" @click="closeModal">Schließen</button>
      </div>
    </div>

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
          :disabled="customInputDisabled || props.loading"
        />
        <button
          class="submit-button"
          @click="handleCustomSubmit"
          :disabled="customInputDisabled || props.loading"
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
import { ref, computed } from 'vue';

interface Props {
  loading: boolean;
  message: string | null;
  error: string | null;
  formatEUR: (amount: number) => string;
}

interface Emits {
  (e: 'donate', amount: number, paymentMethod: 'bar' | 'paypal'): void;
  (e: 'modalClosed'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Voreingestellte Beträge
const presets = [5, 10, 20, 50];
const customAmount = ref('');
const paymentMethod = ref<'bar' | 'paypal'>('bar');
const showModal = ref(false);
const customInputDisabled = ref(false);

// Voreingestellten Betrag spenden
const handlePresetClick = (amount: number) => {
  emit('donate', amount, paymentMethod.value);
  showModal.value = true;
  // Deaktiviere das Textfeld und den Senden-Button für 3 Sekunden
  customInputDisabled.value = true;
  setTimeout(() => {
    customInputDisabled.value = false;
  }, 3000);
};

// Eigenen Betrag spenden
const handleCustomSubmit = () => {
  const amount = parseAmount(customAmount.value);

  if (isNaN(amount) || amount <= 0) {
    // Fehlerbehandlung könnte hier verbessert werden
    return;
  }

  emit('donate', amount, paymentMethod.value);
  customAmount.value = ''; // Eingabefeld zurücksetzen
  showModal.value = true;
};

// Modal schließen
const closeModal = () => {
  showModal.value = false;
  emit('modalClosed');
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

.payment-method {
  margin-bottom: 1.5rem;
}

.method-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.method-options {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin: 1rem 0;
}

.method-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.75rem;
  width: 40%;
  transition: all 0.2s ease;
}

.method-option:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
}

.method-option input[type="radio"] {
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  accent-color: #1b73e8;
}

.method-option span {
  font-size: 1.25rem;
  font-weight: 500;
}

.method-option:has(input:checked) {
  border-color: #1b73e8;
  background-color: #f0f7ff;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
  color: #333;
}

.disclaimer {
  text-align: center;
  margin-bottom: 1.5rem;
  font-style: italic;
  color: #666;
  font-size: 0.9rem;
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

.amount-input:disabled {
  background-color: #f0f0f0;
  color: #888;
  cursor: not-allowed;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
}

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  margin: 1.5rem 0;
  text-align: center;
}

.qr-code-container {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.qr-code {
  width: 180px;
  height: 180px;
  background-color: #fff;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.5rem;
  font-size: 0.9rem;
}

.modal-button {
  display: block;
  width: 100%;
  padding: 0.75rem;
  background-color: #1b73e8;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.modal-button:hover {
  background-color: #1555b7;
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
