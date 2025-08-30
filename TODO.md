# TODO: Spenden-Kiosk für Wasserbrunnen-Projekt

Diese Aufgabenliste beschreibt die notwendigen Schritte zur Implementierung einer Vue.js-basierten Kiosk-Anwendung, die Spenden für ein Wasserbrunnen-Projekt in Afrika erfasst und visualisiert.

## 1. Grundlegende Infrastruktur

- [ ] Google Sheet erstellen mit zwei Tabellenblättern:
  - [ ] **Settings**: Konfiguration für Spendenziel, Projektname und API-Token
  - [ ] **Donations**: Tabelle für Spendendaten (Zeitstempel, Betrag, Kanal, Notiz)
- [ ] Google Apps Script als REST-API einrichten:
  - [ ] `doGet()` für Statusabfragen implementieren
  - [ ] `doPost()` für Spendenerfassung implementieren
  - [ ] Hilfsfunktionen für Sheet-Zugriff und Datenvalidierung erstellen
  - [ ] Als Web-App deployen mit "Run as me" und "Anyone" Zugriffsberechtigung
- [ ] Zeitzoneneinstellungen für Sheet und Script auf "Europe/Berlin" setzen

## 2. Vue.js Frontend-Entwicklung

- [ ] Vue 3 Projekt mit Vite initialisieren
- [ ] Projektstruktur gemäß Architekturrichtlinien anlegen
- [ ] Umgebungsvariablen für API-Endpunkte konfigurieren
- [ ] Komponenten entwickeln:
  - [ ] ProgressWell (Brunnen-Visualisierung mit Wasserstand)
  - [ ] Spendeneingabe-Formular mit Preset-Buttons
  - [ ] Statusanzeige für aktuelle Spendensumme und Fortschritt

## 3. Service-Layer und API-Integration

- [ ] API-Client für Google Apps Script erstellen:
  - [ ] `fetchStats()` für Statusabfragen
  - [ ] `postDonation()` für Spendenerfassung
- [ ] Offline-Funktionalität implementieren:
  - [ ] Queue-System für nicht gesendete Spenden
  - [ ] Automatische Synchronisierung bei Wiederverbindung

## 4. UI/UX-Design

- [ ] Responsives Design für Kiosk-Modus und mobile Nutzung
- [ ] Wasserstand-Animation für den Brunnen erstellen
- [ ] Farbschema mit Erdtönen und Wasserblau umsetzen
- [ ] Touch-freundliche Benutzeroberfläche gestalten
- [ ] Feedback-Elemente für erfolgreiche Spenden einbauen

## 5. Sicherheit und Missbrauchsschutz

- [ ] Shared-Token-Authentifizierung implementieren
- [ ] CORS-Konfiguration für die Web-App
- [ ] Eingabevalidierung auf Client- und Serverseite
- [ ] Optional: Cloudflare Turnstile für Bot-Schutz integrieren

## 6. Erweiterungen für "Eingabe von überall"

- [ ] PWA-Funktionalität hinzufügen:
  - [ ] Service Worker für Offline-Unterstützung
  - [ ] Web App Manifest erstellen
  - [ ] Install-Prompt für mobile Geräte
- [ ] QR-Code für einfachen Zugriff generieren
- [ ] Optional: Google Form als alternativen Eingabekanal einrichten

## 7. Optimierungen

- [ ] Caching-Strategien für API-Anfragen implementieren
- [ ] LockService für parallele Schreibzugriffe nutzen
- [ ] Performance-Optimierungen für die Vue-App
- [ ] Barrierefreiheit nach WCAG-Standards sicherstellen

## 8. Deployment und Betrieb

- [ ] Frontend auf statischem Hosting bereitstellen (Netlify, GitHub Pages, etc.)
- [ ] Dokumentation für Administratoren erstellen
- [ ] Monitoring für API-Nutzung und Fehler einrichten
- [ ] Backup-Strategie für Spendendaten implementieren

## 9. Testing

- [ ] Unit-Tests für kritische Komponenten schreiben
- [ ] End-to-End-Tests für den Spendenprozess erstellen
- [ ] Offline-Funktionalität testen
- [ ] Cross-Browser- und Geräte-Kompatibilität sicherstellen

## 10. Abschluss und Übergabe

- [ ] Benutzerhandbuch für Kiosk-Betreiber erstellen
- [ ] Schulung für Administratoren durchführen
- [ ] Feedback einholen und letzte Anpassungen vornehmen
- [ ] Projekt übergeben und Support-Prozess definieren
