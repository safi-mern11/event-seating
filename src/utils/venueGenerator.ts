import type { Venue, Section, Seat } from '../types/venue';

const statuses: Seat['status'][] = ['available', 'reserved', 'sold', 'held'];
const statusWeights = [0.65, 0.20, 0.10, 0.05];

function getRandomStatus(): Seat['status'] {
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

function generateSection(
  sectionId: string,
  sectionName: string,
  rowCount: number,
  seatsPerRow: number,
  priceTier: 1 | 2 | 3
): Section {
  const sectionData: Section = {
    id: sectionId,
    name: sectionName,
    rows: []
  };

  for (let r = 0; r < rowCount; r++) {
    const rowId = `${sectionId}-R${r + 1}`;
    const rowData = {
      id: rowId,
      seats: [] as Seat[]
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

export function generateVenue(targetSeatCount = 1635): Venue {
  const sections: Section[] = [];

  // Calculate section parameters based on target seat count
  // Distribution: 20% Orchestra, 30% Mezzanine, 25% Balcony Left, 25% Balcony Right
  const orchSeats = Math.floor(targetSeatCount * 0.20);
  const mezzSeats = Math.floor(targetSeatCount * 0.30);
  const ballSeats = Math.floor(targetSeatCount * 0.25);
  const balrSeats = Math.floor(targetSeatCount * 0.25);

  // Calculate rows and seats per row dynamically
  // Keep seats per row between 10-15 for good visuals
  const calcRowsAndSeats = (totalSeats: number) => {
    const seatsPerRow = Math.min(15, Math.max(10, Math.ceil(Math.sqrt(totalSeats))));
    const rows = Math.ceil(totalSeats / seatsPerRow);
    return { rows, seatsPerRow };
  };

  const orchConfig = calcRowsAndSeats(orchSeats);
  const mezzConfig = calcRowsAndSeats(mezzSeats);
  const ballConfig = calcRowsAndSeats(ballSeats);
  const balrConfig = calcRowsAndSeats(balrSeats);

  // Orchestra (VIP) - closer to stage
  sections.push(generateSection('ORCH', 'Orchestra', orchConfig.rows, orchConfig.seatsPerRow, 1));

  // Mezzanine (Premium) - middle tier
  sections.push(generateSection('MEZZ', 'Mezzanine', mezzConfig.rows, mezzConfig.seatsPerRow, 2));

  // Balcony Left (Standard)
  sections.push(generateSection('BALL', 'Balcony Left', ballConfig.rows, ballConfig.seatsPerRow, 3));

  // Balcony Right (Standard)
  sections.push(generateSection('BALR', 'Balcony Right', balrConfig.rows, balrConfig.seatsPerRow, 3));

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
