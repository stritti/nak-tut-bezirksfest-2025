/**
 * Offline-Queue für nicht gesendete Spenden
 */

export interface QueueEntry {
  amount: number;
  channel?: string;
  note?: string;
  statsId?: string;
  timestamp: number;
}

const STORAGE_KEY = 'pendingDonations';

/**
 * Spende zur Queue hinzufügen
 */
export function enqueue(amount: number, channel = 'kiosk', note = '', statsId?: string): void {
  const queue = getQueue();
  queue.push({
    amount,
    channel,
    note,
    statsId,
    timestamp: Date.now()
  });
  saveQueue(queue);
}

/**
 * Alle Einträge aus der Queue abrufen und Queue leeren
 */
export function dequeueAll(): QueueEntry[] {
  const queue = getQueue();
  clearQueue();
  return queue;
}

/**
 * Prüfen, ob Einträge in der Queue vorhanden sind
 */
export function hasQueue(): boolean {
  return getQueue().length > 0;
}

/**
 * Queue aus dem localStorage abrufen
 */
function getQueue(): QueueEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Fehler beim Lesen der Queue:', error);
    return [];
  }
}

/**
 * Queue im localStorage speichern
 */
function saveQueue(queue: QueueEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Fehler beim Speichern der Queue:', error);
  }
}

/**
 * Queue leeren
 */
function clearQueue(): void {
  localStorage.removeItem(STORAGE_KEY);
}
