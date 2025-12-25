import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VENUE_WIDTH = 1024;
const VENUE_HEIGHT = 768;
const SEAT_SIZE = 8;
const SEAT_SPACING = 10;
const ROW_SPACING = 15;

const priceTiers = [1, 2, 3];
const statuses = ['available', 'reserved', 'sold', 'held'];
const statusWeights = [0.6, 0.25, 0.1, 0.05];

function getRandomStatus() {
  const rand = Math.random();
  let cumulative = 0;

  for (let i = 0; i < statusWeights.length; i++) {
    cumulative += statusWeights[i];
    if (rand < cumulative) {
      return statuses[i];
    }
  }

  return statuses[0];
}

function generateSection(sectionId, sectionName, startX, startY, rows, seatsPerRow, priceTier) {
  const sectionData = {
    id: sectionId,
    name: sectionName,
    rows: []
  };

  for (let r = 0; r < rows; r++) {
    const rowId = `${sectionId}-R${r + 1}`;
    const rowData = {
      id: rowId,
      seats: []
    };

    const y = startY + (r * (SEAT_SIZE + ROW_SPACING));

    for (let s = 0; s < seatsPerRow; s++) {
      const x = startX + (s * (SEAT_SIZE + SEAT_SPACING));
      const seatId = `${rowId}-S${s + 1}`;

      rowData.seats.push({
        id: seatId,
        col: s + 1,
        x: Math.round(x),
        y: Math.round(y),
        priceTier: priceTier,
        status: getRandomStatus()
      });
    }

    sectionData.rows.push(rowData);
  }

  return sectionData;
}

function generateVenue() {
  const sections = [];

  sections.push(generateSection('A', 'Section A', 50, 50, 50, 80, 1));
  sections.push(generateSection('B', 'Section B', 50, 510, 50, 80, 2));
  sections.push(generateSection('C', 'Section C', 50, 200, 45, 75, 2));
  sections.push(generateSection('D', 'Section D', 600, 50, 45, 75, 3));

  const totalSeats = sections.reduce((total, section) => {
    return total + section.rows.reduce((rowTotal, row) => rowTotal + row.seats.length, 0);
  }, 0);

  console.log(`Generated ${totalSeats} seats`);

  return {
    venueId: 'venue-001',
    name: 'Grand Arena',
    map: {
      width: VENUE_WIDTH,
      height: VENUE_HEIGHT
    },
    sections
  };
}

const venue = generateVenue();
const outputPath = path.join(__dirname, '..', 'public', 'venue.json');
fs.writeFileSync(outputPath, JSON.stringify(venue, null, 2));

console.log(`Venue data written to ${outputPath}`);
