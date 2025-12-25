const STORAGE_KEY = 'seating-map-selection';

export function saveSelection(seatIds: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seatIds));
  } catch (error) {
    console.error('Failed to save selection:', error);
  }
}

export function loadSelection(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load selection:', error);
    return [];
  }
}

export function clearSelection(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear selection:', error);
  }
}
