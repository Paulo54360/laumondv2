import { describe, expect, it } from 'vitest';

import { proxyUrlForPublicS3Asset } from '../../composables/useImageProxy';

describe('useImageProxy - URL Masking', () => {
  const S3_BASE = 'https://plaumondpicture.s3.eu-west-3.amazonaws.com';

  it('converts full S3 URL to relative /api/media/ path', () => {
    const input = `${S3_BASE}/Archetypes/02/01.jpg`;
    const result = proxyUrlForPublicS3Asset(input, S3_BASE);
    expect(result).toBe('/api/media/Archetypes/02/01.jpg');
  });

  it('converts relative path to /api/media/ path', () => {
    const input = 'Archetypes/02/01.jpg';
    const result = proxyUrlForPublicS3Asset(input, S3_BASE);
    expect(result).toBe('/api/media/Archetypes/02/01.jpg');
  });

  it('preserves already masked /api/media/ path', () => {
    const input = '/api/media/Archetypes/02/01.jpg';
    const result = proxyUrlForPublicS3Asset(input, S3_BASE);
    expect(result).toBe('/api/media/Archetypes/02/01.jpg');
  });

  it('migrates legacy /api/image-proxy?url= query to /api/media/', () => {
    const input = `/api/image-proxy?url=${encodeURIComponent(`${S3_BASE}/Archetypes/02/01.jpg`)}`;
    const result = proxyUrlForPublicS3Asset(input, S3_BASE);
    expect(result).toBe('/api/media/Archetypes/02/01.jpg');
  });

  it('handles empty or null inputs gracefully', () => {
    expect(proxyUrlForPublicS3Asset('', S3_BASE)).toBe('');
    expect(proxyUrlForPublicS3Asset(null, S3_BASE)).toBe('');
    expect(proxyUrlForPublicS3Asset(undefined, S3_BASE)).toBe('');
  });
});
