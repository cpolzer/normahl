import { describe, expect, test } from 'vitest';
import { canonical, SITE } from './urls';

describe('canonical', () => {
  test('site constant', () => expect(SITE).toBe('https://www.normahl.de'));

  test.each([
    // [path, base, expected]
    ['/normahl/', '/normahl/', 'https://www.normahl.de/'],
    ['/normahl', '/normahl/', 'https://www.normahl.de/'],
    ['/normahl/konzerte/', '/normahl/', 'https://www.normahl.de/konzerte/'],
    ['/normahl/konzerte', '/normahl/', 'https://www.normahl.de/konzerte/'],
    ['/normahl/konzerte/feed.xml', '/normahl/', 'https://www.normahl.de/konzerte/feed.xml'],
    ['/', '/', 'https://www.normahl.de/'],
    ['/presse', '/', 'https://www.normahl.de/presse/'],
    ['/presse/', '/', 'https://www.normahl.de/presse/'],
    ['sitemap.xml', '/', 'https://www.normahl.de/sitemap.xml'],
    ['konzerte/', '/', 'https://www.normahl.de/konzerte/'],
  ])('canonical(%j, %j) → %s', (path, base, expected) => {
    expect(canonical(path, base)).toBe(expected);
  });

  test('protocol-relative path does not escape www.normahl.de', () => {
    expect(canonical('//evil.com/x', '/normahl/')).toBe('https://www.normahl.de/evil.com/x/');
    expect(new URL(canonical('//evil.com/x', '/normahl/')).host).toBe('www.normahl.de');
  });

  test('protocol-relative path matching the base still stays on www.normahl.de', () => {
    expect(new URL(canonical('//normahl/konzerte/', '/normahl/')).host).toBe('www.normahl.de');
  });

  test('default base uses import.meta.env.BASE_URL', () => {
    expect(canonical('/presse/')).toBe('https://www.normahl.de/presse/');
  });
});
