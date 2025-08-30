import { ApiClient } from '../api/apiClient';
import { Settings, Donation, Stats, DonationResponse } from '../models/types';

/**
 * Service für die Kommunikation mit der NocoDB-API
 */
export class NocoDBService {
  private apiClient: ApiClient;
  private projectId: string;
  private settingsTable: string;
  private donationsTable: string;

  constructor(apiClient: ApiClient, projectId: string, settingsTable = 'Settings', donationsTable = 'Donations') {
    this.apiClient = apiClient;
    this.projectId = projectId;
    this.settingsTable = settingsTable;
    this.donationsTable = donationsTable;
  }

  /**
   * Abrufen der Projekteinstellungen
   */
  async getSettings(): Promise<Settings> {
    const url = `/nc/${this.projectId}/api/v1/${this.settingsTable}/find-one`;
    return this.apiClient.get<Settings>(url);
  }

  /**
   * Abrufen aller Spenden
   */
  async getDonations(): Promise<Donation[]> {
    const url = `/nc/${this.projectId}/api/v1/${this.donationsTable}`;
    return this.apiClient.get<Donation[]>(url);
  }

  /**
   * Hinzufügen einer neuen Spende
   */
  async addDonation(amount: number, channel = 'kiosk', note = ''): Promise<DonationResponse> {
    try {
      const url = `/nc/${this.projectId}/api/v1/${this.donationsTable}`;
      const timestamp = new Date().toISOString();
      
      const donation = await this.apiClient.post<Donation>(url, {
        timestamp,
        amount_eur: amount,
        channel,
        note
      });

      return {
        success: true,
        donation
      };
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Spende:', error);
      return {
        success: false,
        error: 'Spende konnte nicht gespeichert werden'
      };
    }
  }

  /**
   * Abrufen der aktuellen Spendenstatistik
   */
  async getStats(): Promise<Stats> {
    try {
      // Einstellungen abrufen
      const settings = await this.getSettings();
      
      // Alle Spenden abrufen
      const donations = await this.getDonations();
      
      // Gesamtbetrag berechnen
      const total = donations.reduce((sum, donation) => sum + donation.amount_eur, 0);
      
      // Fortschritt berechnen (0-1)
      const progress = settings.goal_eur > 0 ? Math.min(1, total / settings.goal_eur) : 0;
      
      // Letzte Spende ermitteln
      const lastDonation = donations.length > 0 
        ? donations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
        : null;

      return {
        projectName: settings.project_name,
        goal_eur: settings.goal_eur,
        total_eur: Number(total.toFixed(2)),
        progress: Number(progress.toFixed(4)),
        last_donation: lastDonation
      };
    } catch (error) {
      console.error('Fehler beim Abrufen der Statistik:', error);
      throw new Error('Statistik konnte nicht abgerufen werden');
    }
  }
}

export default NocoDBService;
