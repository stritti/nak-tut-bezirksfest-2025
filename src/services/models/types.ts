/**
 * Typdefinitionen für die Datenmodelle
 */

/**
 * Einstellungen für das Spendenprojekt
 */
export interface Settings {
  id: string;
  goal_eur: number;
  project_name: string;
  api_token?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Spendendaten
 */
export interface Donation {
  id: string;
  timestamp: string;
  amount_eur: number;
  channel: string;
  projectName?: string; // Name des Projekts, für das gespendet wurde
  created_at?: string;
  updated_at?: string;
}

/**
 * Statistiken für das Spendenprojekt
 */
export interface Stats {
  id?: string;
  projectName: string;
  goal_eur: number;
  total_eur: number;
  progress: number; // 0..1
  last_donation?: Donation | null;
}

/**
 * Antwort auf eine Spendenanfrage
 */
export interface DonationResponse {
  success: boolean;
  donation?: Donation;
  error?: string;
}
