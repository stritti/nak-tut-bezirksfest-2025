<template>
  <div class="qr-code-container">
    <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
    <div class="qr-code">
      <img 
        :src="qrCodeSrc" 
        alt="PayPal Moneypool QR-Code" 
        class="max-w-full h-auto"
      />
    </div>
    <p class="mt-2 text-sm text-gray-600">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'PayPal Spenden-QR-Code'
  },
  description: {
    type: String,
    default: 'Scannen Sie diesen QR-Code, um über PayPal zu spenden'
  },
  useSvg: {
    type: Boolean,
    default: false
  }
});

const qrCodeSrc = computed(() => {
  return props.useSvg ? '/moneypool-qrcode.svg' : '/moneypool-qrcode.png';
});
</script>

<style scoped>
.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.qr-code {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 640px) {
  .qr-code {
    width: 150px;
    height: 150px;
  }
}
</style>
