#!/usr/bin/env node
/**
 * Merges future calendar entries into src/data/concerts.json.
 * Skips dates already present. Parses venue/city best-effort from summary.
 * Run: node scripts/sync-concerts.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const calendarPath = join(__dirname, '../resources/calendar.json');
const concertsPath = join(__dirname, '../src/data/concerts.json');

const calendar = JSON.parse(readFileSync(calendarPath, 'utf8'));
const concerts = JSON.parse(readFileSync(concertsPath, 'utf8'));

const today = new Date().toISOString().slice(0, 10);
const existingDates = new Set(concerts.map(c => c.date));

const NOISE = [
  /^(fix\s*[-–]?\s*|tbc\s*[-–]?\s*|confirmed\s*)/i,
  /\s*([-–]\s*)?(fix|tbc|fIX|FIX!?|gecancelt|verschoben)[^\w]*/gi,
  /\bno[rR][mM][aA][hH][lL]?\b/g,
  /\bnormahl\b/gi,
  /\bmit\s+\w+(\s+und\s+\w+)*/gi,
  /\bals\s+headliner\b/gi,
  /^\s*[-–]\s*/,
  /\s*[-–]\s*$/,
];

const clean = (s) => {
  let r = s;
  for (const re of NOISE) r = r.replace(re, ' ');
  return r.replace(/\s+/g, ' ').trim();
};

const parseVenueCity = (summary) => {
  // Pattern: "... in CITY: VENUE ..."
  const colonMatch = summary.match(/\bin\s+([^:,]+):\s*([^-,]+)/i);
  if (colonMatch) {
    return { city: colonMatch[1].trim(), venue: colonMatch[2].trim() };
  }

  // Pattern: "... in CITY VENUE - ..." where venue follows city
  const inMatch = summary.match(/\bin\s+([\w\s./äöüÄÖÜß-]+?)(?:\s*[-–]|$)/i);
  if (inMatch) {
    const parts = inMatch[1].trim().split(/\s+/);
    // Heuristic: first word(s) = city, rest = venue
    if (parts.length >= 2) {
      return { city: parts[0], venue: parts.slice(1).join(' ') };
    }
    return { city: parts[0], venue: '' };
  }

  // Fallback: use cleaned summary as venue
  return { city: '', venue: clean(summary) };
};

const newEntries = [];

for (const event of calendar) {
  if (event.date < today) continue;
  if (existingDates.has(event.date)) continue;

  const { city, venue } = parseVenueCity(event.summary);

  newEntries.push({
    date: event.date,
    venue: venue || clean(event.summary),
    city,
    ticketUrl: '',
    cancelled: event.cancelled,
    _source: 'calendar',        // marker so you can find & review these
    _summary: event.summary,    // original for reference
  });
}

if (newEntries.length === 0) {
  console.log('No new future concerts to add.');
  process.exit(0);
}

const merged = [...concerts, ...newEntries]
  .sort((a, b) => a.date.localeCompare(b.date));

writeFileSync(concertsPath, JSON.stringify(merged, null, 2));
console.log(`Added ${newEntries.length} new concerts:`);
for (const e of newEntries) {
  console.log(`  ${e.date}  ${e.venue} / ${e.city}  ← "${e._summary}"`);
}
