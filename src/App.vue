<script setup lang="ts">
// App.vue ist jetzt nur noch ein Container für den Router
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="title">Wasserbrunnen Afrika</h1>
      <p class="subtitle">
        Helfen Sie mit, den Brunnen zu finanzieren!
      </p>
    </header>

    <main class="main">
      <router-view />
    </main>

    <footer class="footer">
      <div class="footer-row">
        <p class="status">
          <span>Stand wird regelmäßig aktualisiert</span>
        </p>
        <router-link to="/beamer" class="beamer-link" target="_blank">
          Beamer-Ansicht
        </router-link>
      </div>
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

.footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  font-size: 0.8rem;
}

.beamer-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: rgba(27, 115, 232, 0.1);
  transition: background-color 0.2s;
}

.beamer-link:hover {
  background-color: rgba(27, 115, 232, 0.2);
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
