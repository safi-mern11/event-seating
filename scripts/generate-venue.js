import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const statuses = ['available', 'reserved', 'sold', 'held'];
const statusWeights = [0.65, 0.20, 0.10, 0.05];

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

function generateSection(sectionId, sectionName, rowCount, seatsPerRow, priceTier) {
  const sectionData = {
    id: sectionId,
    name: sectionName,
    rows: []
  };

  for (let r = 0; r < rowCount; r++) {
    const rowId = `${sectionId}-R${r + 1}`;
    const rowData = {
      id: rowId,
      seats: []
    };

    // Vary seats per row slightly for realism (10-15 seats)
    const actualSeats = seatsPerRow + Math.floor(Math.random() * 3) - 1;

    for (let s = 0; s < actualSeats; s++) {
      const seatId = `${rowId}-S${s + 1}`;

      rowData.seats.push({
        id: seatId,
        col: s + 1,
        x: 0,
        y: 0,
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

  // Orchestra (VIP) - closer to stage
  sections.push(generateSection('ORCH', 'Orchestra', 25, 12, 1));

  // Mezzanine (Premium) - middle tier
  sections.push(generateSection('MEZZ', 'Mezzanine', 30, 14, 2));

  // Balcony Left (Standard)
  sections.push(generateSection('BALL', 'Balcony Left', 35, 13, 3));

  // Balcony Right (Standard)
  sections.push(generateSection('BALR', 'Balcony Right', 35, 13, 3));

  const totalSeats = sections.reduce((total, section) => {
    return total + section.rows.reduce((rowTotal, row) => rowTotal + row.seats.length, 0);
  }, 0);

  console.log(`Generated ${totalSeats} seats`);
  console.log(`Sections breakdown:`);
  sections.forEach(s => {
    const seatCount = s.rows.reduce((t, r) => t + r.seats.length, 0);
    console.log(`  ${s.name}: ${s.rows.length} rows, ${seatCount} seats`);
  });

  return {
    venueId: 'venue-grand-theater',
    name: 'Grand Theater',
    map: {
      width: 1024,
      height: 768
    },
    sections
  };
}

const venue = generateVenue();
const outputPath = path.join(__dirname, '..', 'public', 'venue.json');
fs.writeFileSync(outputPath, JSON.stringify(venue, null, 2));

console.log(`\nVenue data written to ${outputPath}`);
