export type SeatStatus = 'available' | 'reserved' | 'sold' | 'held';

export type PriceTier = 1 | 2 | 3;

export interface Seat {
  id: string;
  col: number;
  x: number;
  y: number;
  priceTier: PriceTier;
  status: SeatStatus;
}

export interface Row {
  id: string;
  seats: Seat[];
}

export interface Section {
  id: string;
  name: string;
  rows: Row[];
}

export interface VenueMap {
  width: number;
  height: number;
}

export interface Venue {
  venueId: string;
  name: string;
  map: VenueMap;
  sections: Section[];
}

export interface SelectedSeat extends Seat {
  section: string;
  row: string;
}

export interface PricingInfo {
  tier: PriceTier;
  price: number;
}
