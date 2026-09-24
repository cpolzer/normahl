export interface Concert {
  date: string; // YYYY-MM-DD
  venue: string;
  city: string;
  ticketUrl?: string;
  cancelled?: boolean;
  tbc?: boolean;
}

/** Today's date (YYYY-MM-DD) in Europe/Berlin; CI runs in UTC. */
export function berlinToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}

export function isTbc(c: Concert): boolean {
  return !!c.tbc || /tbc/i.test(`${c.venue} ${c.city}`);
}

export function upcomingConcerts(concerts: Concert[], today: string): Concert[] {
  return concerts.filter(c => c.date >= today && !isTbc(c)).sort((a, b) => a.date.localeCompare(b.date));
}

export function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function entryId(c: Concert): string {
  return `tag:normahl.de,${c.date.slice(0, 4)}:konzert/${c.date}-${slugify(c.venue) || 'konzert'}`;
}

const formatDate = (iso: string) => iso.split('-').reverse().join('.');

export function entryTitle(c: Concert): string {
  return `${c.cancelled ? 'ABGESAGT: ' : ''}${formatDate(c.date)} – ${c.venue}, ${c.city}`;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function renderFeed(opts: { concerts: Concert[]; now: Date; pageUrl: string; feedUrl: string }): string {
  const { concerts, now, pageUrl, feedUrl } = opts;
  const entries = upcomingConcerts(concerts, berlinToday(now)).map(c => {
    const html = `<p>${esc(entryTitle(c))}</p>` +
      (c.ticketUrl ? `<p><a href="${esc(c.ticketUrl)}">Tickets</a></p>` : '');
    return `  <entry>
    <id>${entryId(c)}</id>
    <title>${esc(entryTitle(c))}</title>
    <updated>${c.date}T00:00:00Z</updated>
    <link rel="alternate" type="text/html" href="${esc(pageUrl)}"/>
    <content type="html">${esc(html)}</content>
  </entry>`;
  });
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>NoRMAhl – Konzerte</title>
  <subtitle>Kommende Konzerte von NoRMAhl</subtitle>
  <id>${esc(pageUrl)}</id>
  <link rel="self" type="application/atom+xml" href="${esc(feedUrl)}"/>
  <link rel="alternate" type="text/html" href="${esc(pageUrl)}"/>
  <updated>${now.toISOString()}</updated>
  <author><name>NoRMAhl</name></author>
${entries.join('\n')}
</feed>
`;
}
