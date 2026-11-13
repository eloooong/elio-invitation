import { neon } from '@neondatabase/serverless';
import { handleRequest } from '../server/api.js';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.pathname = '/api/' + (url.searchParams.get('path') || '');
    url.searchParams.delete('path');
    const headers = new Headers(request.headers);
    // Vercel supplies this header; do not trust a client-supplied Cloudflare IP.
    headers.set('cf-connecting-ip', request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() || 'unknown');
    return handleRequest(new Request(url, { method: request.method, headers,
      body: request.body, ...(request.body ? { duplex: 'half' } : {}) }), process.env,
      process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null);
  }
};
