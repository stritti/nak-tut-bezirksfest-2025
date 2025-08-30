# TODO: Spenden-Kiosk für Wasserbrunnen-Projekt

Diese Aufgabenliste beschreibt die notwendigen Schritte zur Implementierung einer Vue.js-basierten Kiosk-Anwendung, die Spenden für ein Wasserbrunnen-Projekt in Afrika erfasst und visualisiert.

## 1. Grundlegende Infrastruktur

- [x] NocoDB-Instanz einrichten:
  - [x] **Settings**: Tabelle für Konfiguration (Spendenziel, Projektname, API-Token)
  - [x] **Donations**: Tabelle für Spendendaten (Zeitstempel, Betrag, Kanal, Notiz)
- [x] NocoDB REST-API konfigurieren:
  - [x] API-Schlüssel generieren
  - [x] Berechtigungen für Lese- und Schreibzugriff einrichten
  - [ ] CORS-Einstellungen konfigurieren
- [x] Zeitzoneneinstellungen auf "Europe/Berlin" setzen

## 2. Vue.js Frontend-Entwicklung

- [x] Vue 3 Projekt mit Vite initialisieren
- [x] Projektstruktur gemäß Architekturrichtlinien anlegen
- [x] Umgebungsvariablen für API-Endpunkte konfigurieren
- [x] Komponenten entwickeln:
  - [x] ProgressWell (Brunnen-Visualisierung mit Wasserstand)
  - [x] Spendeneingabe-Formular mit Preset-Buttons
  - [x] Statusanzeige für aktuelle Spendensumme und Fortschritt

## 3. Service-Layer und API-Integration

- [x] API-Client für NocoDB erstellen:
  - [x] `fetchStats()` für Statusabfragen
  - [x] `postDonation()` für Spendenerfassung
  - [x] Repository-Pattern für den Datenzugriff implementieren
- [x] Offline-Funktionalität implementieren:
  - [x] Queue-System für nicht gesendete Spenden
  - [x] Automatische Synchronisierung bei Wiederverbindung

## 4. UI/UX-Design

- [x] Responsives Design für Kiosk-Modus und mobile Nutzung
- [x] Wasserstand-Animation für den Brunnen erstellen
- [x] Farbschema mit Erdtönen und Wasserblau umsetzen
- [x] Touch-freundliche Benutzeroberfläche gestalten
- [x] Feedback-Elemente für erfolgreiche Spenden einbauen

## 5. Sicherheit und Missbrauchsschutz

- [x] API-Token-Authentifizierung für NocoDB implementieren
- [ ] CORS-Konfiguration für die NocoDB-API
- [x] Eingabevalidierung auf Client- und Serverseite
- [ ] Rate-Limiting für API-Anfragen einrichten
- [ ] Optional: Cloudflare Turnstile für Bot-Schutz integrieren

## 6. Erweiterungen für "Eingabe von überall"

- [x] PWA-Funktionalität hinzufügen:
  - [x] Service Worker für Offline-Unterstützung
  - [x] Web App Manifest erstellen
  - [x] Install-Prompt für mobile Geräte
- [x] QR-Code für einfachen Zugriff generieren (qrcode.vue installiert)
- [ ] Optional: Einfaches Web-Formular als alternativen Eingabekanal einrichten

## 7. Optimierungen

- [x] Caching-Strategien für API-Anfragen implementieren
- [x] Optimistische UI-Updates für bessere Benutzererfahrung
- [x] Performance-Optimierungen für die Vue-App
- [x] Barrierefreiheit nach WCAG-Standards sicherstellen
- [ ] Datenbank-Indizes für schnellere Abfragen einrichten

## 8. Deployment und Betrieb

- [x] Frontend auf statischem Hosting bereitstellen (Netlify, GitHub Pages, etc.)
- [x] NocoDB auf geeignetem Server deployen (Docker, VPS, etc.)
- [ ] Dokumentation für Administratoren erstellen
- [ ] Monitoring für API-Nutzung und Fehler einrichten
- [ ] Backup-Strategie für NocoDB-Datenbank implementieren

## 9. Testing

- [ ] Unit-Tests für kritische Komponenten schreiben
- [x] End-to-End-Tests für den Spendenprozess erstellen
- [x] Offline-Funktionalität testen
- [x] Cross-Browser- und Geräte-Kompatibilität sicherstellen

## 10. Abschluss und Übergabe

- [ ] Benutzerhandbuch für Kiosk-Betreiber erstellen
- [ ] Schulung für Administratoren durchführen
- [x] Feedback einholen und letzte Anpassungen vornehmen
- [ ] Projekt übergeben und Support-Prozess definieren
