import { describe, expect, test } from 'vitest';
import { berlinToday, entryId, entryTitle, isTbc, renderFeed, slugify, upcomingConcerts, type Concert } from './feed';

const c = (date: string, venue = 'V', city = 'C', extra: Partial<Concert> = {}): Concert =>
  ({ date, venue, city, ticketUrl: '', cancelled: false, ...extra });

describe('berlinToday', () => {
  test('uses Europe/Berlin, not UTC: 22:30 UTC in summer is already the next day', () => {
    expect(berlinToday(new Date('2026-07-01T22:30:00Z'))).toBe('2026-07-02');
  });
  test('winter offset is +1', () => {
    expect(berlinToday(new Date('2026-01-01T22:59:00Z'))).toBe('2026-01-01');
    expect(berlinToday(new Date('2026-01-01T23:00:00Z'))).toBe('2026-01-02');
  });
});

describe('upcomingConcerts', () => {
  test('keeps today and later, soonest first', () => {
    const list = [c('2026-10-17'), c('2026-09-23'), c('2026-09-24'), c('2026-10-16')];
    expect(upcomingConcerts(list, '2026-09-24').map(x => x.date))
      .toEqual(['2026-09-24', '2026-10-16', '2026-10-17']);
  });
  test('keeps cancelled concerts', () => {
    expect(upcomingConcerts([c('2026-10-01', 'V', 'C', { cancelled: true })], '2026-09-24')).toHaveLength(1);
  });
  test('excludes TBC concerts', () => {
    const list = [
      c('2026-10-01', 'V', 'C', { tbc: true }),
      c('2026-10-02', 'TBC Club', 'C'),
      c('2026-10-03', 'V', 'City TBC'),
      c('2026-10-04', 'V', 'C'),
    ];
    expect(upcomingConcerts(list, '2026-09-24').map(x => x.date)).toEqual(['2026-10-04']);
  });
});

describe('isTbc', () => {
  test('true when the tbc flag is set', () => {
    expect(isTbc(c('2026-10-01', 'V', 'C', { tbc: true }))).toBe(true);
  });
  test('true when "tbc" appears in the venue, case-insensitive', () => {
    expect(isTbc(c('2026-10-01', 'Venue TBC', 'C'))).toBe(true);
    expect(isTbc(c('2026-10-01', 'venue tbc', 'C'))).toBe(true);
  });
  test('true when "tbc" appears in the city, case-insensitive', () => {
    expect(isTbc(c('2026-10-01', 'V', 'City TBC'))).toBe(true);
  });
  test('false for a normal concert', () => {
    expect(isTbc(c('2026-10-01', 'Kulturbühne', 'Geislingen'))).toBe(false);
  });
});

describe('slugify / entryId', () => {
  test('umlauts, ß and slashes', () => {
    expect(slugify('Komma/AT-Wörgl')).toBe('komma-at-woergl');
    expect(slugify('Große Bühne  Süd')).toBe('grosse-buehne-sued');
    expect(slugify('JENA - F-Haus')).toBe('jena-f-haus');
  });
  test('stable tag URI from date + venue', () => {
    expect(entryId(c('2026-04-10', 'Komma/AT-Wörgl'))).toBe('tag:normahl.de,2026:konzert/2026-04-10-komma-at-woergl');
  });
  test('falls back to "konzert" when venue slugifies to empty', () => {
    expect(entryId(c('2026-04-10', '!!!'))).toBe('tag:normahl.de,2026:konzert/2026-04-10-konzert');
  });
});

describe('entryTitle', () => {
  test('formats date, venue, city', () => {
    expect(entryTitle(c('2026-10-16', 'Kulturbühne Hinterhalt', 'Geislingen'))).toBe('16.10.2026 – Kulturbühne Hinterhalt, Geislingen');
  });
  test('prefixes cancelled', () => {
    expect(entryTitle(c('2026-10-16', 'X', 'Y', { cancelled: true }))).toBe('ABGESAGT: 16.10.2026 – X, Y');
  });
});

describe('renderFeed', () => {
  const xml = renderFeed({
    concerts: [c('2026-10-16', 'A & B', 'Ulm', { ticketUrl: 'https://t.example/?a=1&b=2' }), c('2020-01-01', 'Old')],
    now: new Date('2026-09-24T10:00:00Z'),
    pageUrl: 'https://www.normahl.de/konzerte/',
    feedUrl: 'https://www.normahl.de/konzerte/feed.xml',
  });

  test('atom envelope', () => {
    expect(xml).toMatch(/^<\?xml version="1.0" encoding="utf-8"\?>\n<feed xmlns="http:\/\/www.w3.org\/2005\/Atom">/);
    expect(xml).toContain('<link rel="self" type="application/atom+xml" href="https://www.normahl.de/konzerte/feed.xml"/>');
    expect(xml).toContain('<updated>2026-09-24T10:00:00.000Z</updated>');
  });
  test('only upcoming entries, escaped', () => {
    expect(xml.match(/<entry>/g)).toHaveLength(1);
    expect(xml).toContain('<title>16.10.2026 – A &amp; B, Ulm</title>');
    expect(xml).toContain('<updated>2026-10-16T00:00:00Z</updated>');
    expect(xml).toContain('a=1&amp;amp;b=2'); // href inside escaped HTML content is double-escaped
    expect(xml).not.toContain('Old');
  });
  test('omits ticket link when ticketUrl is empty', () => {
    const noTicket = renderFeed({
      concerts: [c('2026-10-16', 'V', 'C', { ticketUrl: '' })],
      now: new Date('2026-09-24T10:00:00Z'),
      pageUrl: 'https://www.normahl.de/konzerte/',
      feedUrl: 'https://www.normahl.de/konzerte/feed.xml',
    });
    expect(noTicket).not.toContain('Tickets');
  });
});
