import { ApiClient } from '../api/apiClient'
import type { Settings, Donation, Stats, DonationResponse } from '../models/types'

/**
 * Service für die Kommunikation mit der NocoDB-API v2
 */
export class NocoDBService {
  private apiClient: ApiClient
  private settingsTable = 'mhbhc091n5dfr6y'
  private donationsTable = 'm3772qunbgq8adt'

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
  }

  /**
   * Abrufen der Projekteinstellungen
   */
  async getSettings(): Promise<Settings> {
    // In v2 API verwenden wir /api/v2/tables/{tableId}/records
    const url = `/api/v2/tables/${this.settingsTable}/records`
    const settings = await this.apiClient.get<Settings[]>(url)

    // Wir nehmen den ersten Eintrag aus der Liste
    if (Array.isArray(settings) && settings.length > 0) {
      return settings[0]
    }

    throw new Error('Keine Einstellungen gefunden')
  }

  /**
   * Abrufen aller Spenden
   */
  async getDonations(): Promise<Donation[]> {
    // In v2 API verwenden wir /api/v2/tables/{tableId}/records
    const url = `/api/v2/tables/${this.donationsTable}/records`
    return this.apiClient.get<Donation[]>(url)
  }

  /**
   * Hinzufügen einer neuen Spende
   */
  async addDonation(
    amount: number,
    channel = 'kiosk',
    projectName?: string,
  ): Promise<DonationResponse> {
    try {
      // In v2 API verwenden wir /api/v2/tables/{tableId}/records
      const url = `/api/v2/tables/${this.donationsTable}/records`
      const timestamp = new Date().toISOString()

      // Bereite die Daten vor
      const donationData: unknown = {
        timestamp,
        amount_eur: amount,
        channel,
        project_name: projectName, // Verwende den korrekten Feldnamen für die Datenbank
      }
      
      console.log('Sende Donation-Daten:', donationData);

      const donation = await this.apiClient.post<Donation>(url, donationData)

      return {
        success: true,
        donation,
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Spende:', error)
      return {
        success: false,
        error: 'Spende konnte nicht gespeichert werden',
      }
    }
  }

  /**
   * Abrufen der aktuellen Spendenstatistik
   */
  async getStats(): Promise<Stats> {
    try {
      // Einstellungen abrufen
      const settings = await this.getSettings()

      // Alle Spenden abrufen
      const donations = await this.getDonations()

      // Gesamtbetrag berechnen
      const total = donations.reduce((sum, donation) => sum + donation.amount_eur, 0)

      // Fortschritt berechnen (0-1)
      const progress = settings.goal_eur > 0 ? Math.min(1, total / settings.goal_eur) : 0

      // Letzte Spende ermitteln
      const lastDonation =
        donations.length > 0
          ? donations.sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
            )[0]
          : null

      // Stats-Objekt mit ID erstellen
      const statsObj: Stats = {
        id: settings.id, // ID aus den Einstellungen verwenden
        projectName: settings.project_name,
        goal_eur: settings.goal_eur,
        total_eur: Number(total.toFixed(2)),
        progress: Number(progress.toFixed(4)),
        last_donation: lastDonation,
      }
      
      console.log('Erstelltes Stats-Objekt:', statsObj);

      return statsObj
    } catch (error) {
      console.error('Fehler beim Abrufen der Statistik:', error)
      throw new Error('Statistik konnte nicht abgerufen werden')
    }
  }
}

export default NocoDBService
