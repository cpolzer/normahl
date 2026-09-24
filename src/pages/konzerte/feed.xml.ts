import type { APIRoute } from 'astro';
import concerts from '../../data/concerts.json';
import { renderFeed } from '../../lib/feed';
import { canonical } from '../../lib/urls';

export const GET: APIRoute = () =>
  new Response(
    renderFeed({
      concerts,
      now: new Date(),
      pageUrl: canonical('/konzerte/', '/'),
      feedUrl: canonical('/konzerte/feed.xml', '/'),
    }),
    { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } },
  );
